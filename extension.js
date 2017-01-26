console.log('YouTrack tweaks');

function errorHandler(...args) {
  console.error(...args);
}

function executeCode(details, code, isJS) {
  const escapedCode = code
      .replace(/(\/\/(\s*).+(\n|$))/ig, '') // remove one line comments
      .replace(new RegExp("'", 'g'), "\\'") // escape single quotes
      .replace(new RegExp("\\n", 'g'), ' ');// remove new lines

  chrome.tabs.executeScript(details.tabId, {
    code: `
              (function () {
                const script = document.createElement('${isJS ? 'script' : 'style'}');
                script.textContent = '${escapedCode}';
                (document.head || document.body || document.documentElement).appendChild(script);
              })(); 
            `
  });
}

function runFileAsCode(details, path) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.getPackageDirectoryEntry(function(root) {
      root.getFile(path, {}, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(e) {
            // contents are in this.result
            const extension = path.split('.').pop();
            const isJS = extension === 'js';

            executeCode(details, this.result, isJS);
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

const youtrackTabs = new Set();

function getTabById(tabId) {
  return new Promise(function(resolve, reject) {
    chrome.tabs.get(tabId, resolve);
  });
}

function executeJSForAllYouTrackTabs(code) {
  const promises = [];
  youtrackTabs.forEach(tabId => {
    const p = getTabById(tabId).then(details => {
      executeCode(details, code, true);
    });
    promises.push(p);
  });

  return Promise.all(promises);
}

function sendConfiguration() {
  return executeJSForAllYouTrackTabs(`
    window.ytTweaks.configure(${JSON.stringify(tweaksConfiguration)});
  `);
}

chrome.webNavigation.onCompleted.addListener(function(details) {
  if (!tweaksConfiguration.some(config => (details.url.indexOf(config.url) !== -1))) return;

  youtrackTabs.add(details.tabId);

  runFileAsCode(details, `tweaks/tweaks.js`).then(() => {
    return injectTweak(details, 'agile-board/card-fields');
  }).then(sendConfiguration);
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
  const tabId = details.tabId;
  if (youtrackTabs.has(tabId)) {
    youtrackTabs.delete(tabId);
  }
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'ytTweaks') {
    port.onMessage.addListener(msg => {
      if (msg.tweaks) {
        console.log('Recieve new tweaks config', tweaksConfiguration);
        tweaksConfiguration = msg.tweaks;
        sendConfiguration();
      }
    });
  }
});