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
  console.log('<<<<', request);

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
  } else if (request.resync) {
    console.log('resync config');

    readSavedConfiguration().then(() => forAllTabs(checkAndInject));
  } else if (request.ping) {
    injectTagWithContent(tab, `window.pong && window.pong(true);`);
  }
});

const storage = window.browser ? chrome.storage.local : chrome.storage.sync; // fix for firefox

const getVersion = () => chrome.runtime.getManifest().version;

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
      } else if (data.welcome && data.version !== getVersion()) {
        resolve(checkMigration());
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
      version: getVersion(),
      welcome: true,
      tweaks
    });
    userTweaksConfiguration = tweaks;
  });
}

function checkMigration() {
  console.log('check migration');

  return asyncLoad('default.json').then(content => {
    const defaultTweaks = JSON.parse(content);

    userTweaksConfiguration.forEach(tweak => {
      let defaultTweak = null;
      for (let i = 0; i < defaultTweaks.length; i++) {
        if (defaultTweaks[i].type === tweak.type) {
          defaultTweak = defaultTweaks[i];
          break;
        }
      }

      if (defaultTweak) {
        for (let configProp in defaultTweak.config) {
          if (defaultTweak.config.hasOwnProperty(configProp) && tweak.config[configProp] === undefined) {
            tweak.config[configProp] = defaultTweak.config[configProp];
            console.log('Config property', configProp, 'was set to', defaultTweak.config[configProp], 'for', tweak);
          }
        }
      }
    });


    storage.set({
      version: getVersion(),
      tweaks: userTweaksConfiguration
    });
  });
}

readSavedConfiguration()
  .then(getYoutrackTabsByQuery)
  .then(tabs => {
    tabs.forEach(tab => chrome.tabs.reload(tab.id));
  });