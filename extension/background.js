console.log('YouTrack tweaks');

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
  return asyncLoad(path).then(content => {
    const extension = path.split('.').pop();
    const isJS = extension === 'js';

    injectTagWithContent(details, content, isJS, ...args);
  });
}

function asyncLoad(path) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'http://localhost:8080/' + path, true);

    xhr.onload = function () {
      resolve(this.responseText);
    };

    xhr.onerror = function () {
      reject(this.status);
    };

    xhr.send();
  });
}


let tweaksConfiguration = [];

chrome.storage.sync.get('tweaks', data => {
  console.log('tweaks are fetched', data['tweaks']);
  tweaksConfiguration = data['tweaks'] || [];
});

function injectTweak(details, tweakName) {
  console.log('YouTrack Tweaks: injecting', tweakName);
  return runFileAsCode(details, `${tweakName}/inject.css`)
      .then(() => runFileAsCode(details, `${tweakName}/inject.js`));
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
      runFileAsCode(details, `core.js`).
        then(injectTweak(details, 'agile-board/card-fields')).
        then(injectTweak(details, 'agile-board/desktop-notifications')).
        then(() => sendConfiguration(details));

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

chrome.runtime.onMessage.addListener((request, sender) => {
  console.log('New messsage', request, sender);

  if (request.probe) {
    console.log('Successful probe');

    const details = sender.tab;

    youtrackTabs.set(details.id, {
      details: details,
      injected: false
    });
    checkAndInject(details);
  } else if (request.tweaks) {
    console.log('Recieve new tweaks config');

    tweaksConfiguration = request.tweaks;
    forAllTabs(checkAndInject);
  }
});