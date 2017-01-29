console.log('YouTrack tweaks');

function errorHandler(...args) {
  console.error(...args);
}

function injectTagWithContent(details, content, isJS = true, fnArgs = []) {
  const newLineReplacement = '!nl!';
  let escapedContent = content.trim()
      .replace(new RegExp("'", 'g'), "\\'") // escape single quotes
      .replace(new RegExp("\\n", 'g'), newLineReplacement);// remove new lines

  const getArg = arg => typeof arg === 'string' ? `\\'${arg}\\'` : arg;

  if (isJS) { // wrap into function
    if (escapedContent.indexOf('function') === 0) {
      escapedContent = `(${escapedContent})(${fnArgs.map(getArg).join(',')});`;
    } else {
      escapedContent = `(function() { ${escapedContent} })();`;
    }
  }

  const code = `
    (function () {
      const script = document.createElement('${isJS ? 'script' : 'style'}');
      script.textContent = '${escapedContent}'.replace(new RegExp("${newLineReplacement}", 'g'), '\\n');
      (document.head || document.body || document.documentElement).appendChild(script);
    })(); 
  `;

  chrome.tabs.executeScript(details.id, {code});
}

function runFileAsCode(details, path, ...args) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.getPackageDirectoryEntry(function(root) {
      root.getFile(path, {}, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            // contents are in this.result
            const extension = path.split('.').pop();
            const isJS = extension === 'js';

            injectTagWithContent(details, this.result, isJS, ...args);
            resolve();
          };
          reader.readAsText(file);
        }, reject);
      }, reject);
    });
  });
}

let tweaksConfiguration = [];

chrome.storage.sync.get('tweaks', data => {
  console.log('tweaks are fetched', data['tweaks']);
  tweaksConfiguration = data['tweaks'];
});

function injectTweak(details, tweakName) {
  console.log('YouTrack Tweaks: injecting', tweakName);
  return runFileAsCode(details, `tweaks/${tweakName}/inject.css`)
      .then(() => runFileAsCode(details, `tweaks/${tweakName}/inject.js`));
}

const youtrackTabs = new Map();

function forAllTabs(action) {
  youtrackTabs.forEach((tabData, tabId) => {
    console.log('updating tab', tabId);
    action(tabData.details);
  });
}

const configFilter = (config, details) => (details.url.indexOf(config.url) !== -1);

function sendConfiguration(details) {
  const filteredConfigs = tweaksConfiguration.filter(config => configFilter(config, details));
  console.log('sending configuration', details.url, filteredConfigs);
  return injectTagWithContent(details, `
    window.ytTweaks.configure(${JSON.stringify(filteredConfigs)});
  `);
}

function checkAndInject(details) {
  const tabData = youtrackTabs.get(details.id);

  if (!tabData.injected) {
    const hasConfigMatches = tweaksConfiguration.some(config => configFilter(config, details));

    if (hasConfigMatches) {
      runFileAsCode(details, `tweaks/core.js`).then(() => {
        return injectTweak(details, 'agile-board/card-fields');
      }).then(() => sendConfiguration(details));

      tabData.injected = true;
    }
  } else {
    sendConfiguration(details);
  }
}

chrome.webNavigation.onBeforeNavigate.addListener(details => {
  youtrackTabs.delete(details.id);
});

chrome.tabs.onRemoved.addListener(tabId => {
  youtrackTabs.delete(tabId);
});

chrome.runtime.onConnect.addListener(port => {
  console.log('new connection');
  if (port.name === 'ytTweaks') {
    port.onMessage.addListener(msg => {
      if (msg.tweaks) {
        console.log('Recieve new tweaks config', tweaksConfiguration);
        tweaksConfiguration = msg.tweaks;
        forAllTabs(checkAndInject);
      }
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.probe) {
    console.log('Successful probe', request);

    const details = sender.tab;

    youtrackTabs.set(details.id, {
      details: details,
      injected: false
    });
    checkAndInject(details);
  }
});