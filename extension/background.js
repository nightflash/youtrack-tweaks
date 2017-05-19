console.log('YouTrack tweaks');

const youtrackTabs = new Map();

let userTweaksConfiguration = [];

const serverUrl = chrome.extension.getURL("/");

function asyncLoad(path) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', serverUrl + path, true);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.status);
    xhr.send();
  });
}

function injectTagWithContent(tab, content) {
  return new Promise(resolve => {
    const escapedContent = content.
      replace(/\\/g, '\\\\').
      replace(/'/g, "\\'").
      replace(/\n/g, '\\n');

    const code = `
      (function() {
        const script = document.createElement('script');
        script.textContent = '${escapedContent}';
        document.body.appendChild(script);
      })();
    `;

    chrome.tabs.executeScript(tab.id, {code}, result => {
      resolve(result)
    });
  });
}

function injectScript(tab, filename) {
  return asyncLoad(filename).then(content => {
    return injectTagWithContent(tab, content);
  });
}

function forAllTabs(action) {
  youtrackTabs.forEach((tabData, tabId) => {
    console.log('updating tab', tabId);
    action(tabData.tab);
  });
}

const configFilter = (config, tab) => {
  console.log('config filter', tab.id);
  const url = config.config && config.config.url || '';
  return (url === '' || tab.url.indexOf(url) !== -1);
};

function sendConfiguration(tab) {
  const filteredConfigs = userTweaksConfiguration.filter(config => configFilter(config, tab));
  console.log('sending configuration', tab.url, filteredConfigs);
  injectTagWithContent(tab, `window.ytTweaks.configure(${JSON.stringify(filteredConfigs)});`);
  return Promise.resolve();
}

function checkAndInject(tab) {
  console.log('checkAndInject', tab);

  const tabData = youtrackTabs.get(tab.id);

  return Promise.resolve().then(() => {
    if (!tabData.coreInjected) {
      tabData.coreInjected = true;
      return injectScript(tab, 'repository.js');
    }
  }).then(() => sendConfiguration(tab));
}

function getYoutrackTabsByQuery() {
  return new Promise(resolve => {
    chrome.tabs.query({}, tabs => {
      resolve(tabs.filter(tab => tab.title.indexOf('YouTrack') !== -1));
    });
  });
}

chrome.tabs.onRemoved.addListener(tabId => {
  console.log('tab delete: onRemove', tabId);
  youtrackTabs.delete(tabId);
});

chrome.runtime.onMessage.addListener((request, sender) => {
  const tab = sender.tab;

  if (request.probe !== undefined) {
    if (request.probe) {
      console.log('set tab', tab.id, tab.url);

      youtrackTabs.set(tab.id, {
        tab: tab,
        injected: new Map(),
        coreInjected: false
      });
      checkAndInject(tab);
    } else {
      console.log('tab delete: bad probe', tab.id);

      youtrackTabs.delete(tab.id);
    }
  } else if (request.tweaks) {
    console.log('new config');

    userTweaksConfiguration = request.tweaks;
    forAllTabs(checkAndInject);
  }
});

chrome.runtime.onMessageExternal && chrome.runtime.onMessageExternal.addListener((request, sender, sendResponse) => {
  if (request.ping) {
    sendResponse({pong: true});
  }
});

const storage = window.browser ? chrome.storage.local : chrome.storage.sync; // fix for firefox

function readSavedConfiguration() {
  return new Promise(resolve => {
    storage.get(['tweaks', 'version', 'welcome'], data => {
      userTweaksConfiguration = data.tweaks || [];
      console.log('initial tweaks fetched', userTweaksConfiguration.length);

      userTweaksConfiguration.forEach(tweak => {
        console.log(JSON.stringify(tweak));
      });

      if (!data.welcome && userTweaksConfiguration.length === 0) {
        resolve(setDefaultTweaks());
      } else {
        resolve();
      }
    });
  });
}

function setDefaultTweaks() {
  return asyncLoad('default.json').
  then(content => {
    const tweaks = JSON.parse(content);
    storage.set({
      welcome: true,
      tweaks
    });
    userTweaksConfiguration = tweaks;
  });
}

readSavedConfiguration()
  .then(getYoutrackTabsByQuery)
  .then(tabs => {
    tabs.forEach(tab => chrome.tabs.reload(tab.id));
  });