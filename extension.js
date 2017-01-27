console.log('YouTrack tweaks');

function errorHandler(...args) {
  console.error(...args);
}

function executeCode(details, code, isJS = true) {
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

function forAllTabs(action) {
  const promises = [];
  youtrackTabs.forEach(tabId => {
    const p = getTabById(tabId).then(action);
    promises.push(p);
  });

  return Promise.all(promises);
}

const configFilter = (config, details) => (details.url.indexOf(config.url) !== -1);

function sendConfiguration(details) {
  const filteredConfigs = tweaksConfiguration.filter(config => configFilter(config, details));
  console.log('sending configuration', details.url, filteredConfigs);
  return executeCode(details, `
    window.ytTweaks.configure(${JSON.stringify(filteredConfigs)});
  `);
}

function broadcastConfiguration() {
  return forAllTabs(sendConfiguration);
}

chrome.webNavigation.onCompleted.addListener(details => {
  if (!tweaksConfiguration.some(config => configFilter(config, details))) return;

  youtrackTabs.add(details.tabId);

  runFileAsCode(details, `tweaks/tweaks.js`).then(() => {
    return injectTweak(details, 'agile-board/card-fields');
  }).then(() => sendConfiguration(details));
});

chrome.webNavigation.onBeforeNavigate.addListener(details => {
  youtrackTabs.delete(details.tabId);
});

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'ytTweaks') {
    port.onMessage.addListener(msg => {
      if (msg.tweaks) {
        console.log('Recieve new tweaks config', tweaksConfiguration);
        tweaksConfiguration = msg.tweaks;
        broadcastConfiguration();
      }
    });
  }
});