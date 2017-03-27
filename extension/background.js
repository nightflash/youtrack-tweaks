console.log('YouTrack tweaks');
let develop = false;

chrome.management.getSelf(info => {
  if (info.installType === 'development') {
    console.warn('DEVELOPMENT');
    develop = true;
  }
});

const youtrackTabs = new Map();

const repositoryTweaksConfig = {
  version: -1,
  tweaks: []
};

let userTweaksConfiguration = [];

function asyncLoad(path) {
  return new Promise(function(resolve, reject) {
    const serverUrl = develop ? 'http://localhost:8083/' : 'https://extension.youtrack-tweaks.com/repository/';

    const xhr = new XMLHttpRequest();
    xhr.open('GET', serverUrl + path, true);
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => reject(xhr.status);
    xhr.send();
  });
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

function loadAndInject(details, path, ...args) {
  return asyncLoad(path).then(content => {
    injectTagWithContent(details, content, path.indexOf('.js') !== -1, args);
  });
}

function forAllTabs(action) {
  youtrackTabs.forEach((tabData, tabId) => {
    console.log('updating tab', tabId);
    action(tabData.details);
  });
}

const configFilter = (config, details) => {
  const url = config.config && config.config.url || '';
  return (url === '' || details.url.indexOf(url) !== -1);
};

function sendSafeStop(details) {
  console.log('sending stop', details.url);
  injectTagWithContent(details, `
    window.ytTweaks && window.ytTweaks.stopTweaks();
  `);
  return Promise.resolve();
}

function sendConfiguration(details) {
  const filteredConfigs = userTweaksConfiguration.filter(config => configFilter(config, details));
  console.log('sending configuration', details.url, filteredConfigs);
  injectTagWithContent(details, `
    window.ytTweaks.configure(${JSON.stringify(filteredConfigs)});
  `);
  return Promise.resolve();
}

function reloadRepositoryConfiguration() {
  return asyncLoad('options.json?' + +Math.random()).
  then(content => {
    const json = JSON.parse(content);
    const currentVersion = repositoryTweaksConfig.version;
    repositoryTweaksConfig.tweaks = getTweaksFromJSON(json);
    repositoryTweaksConfig.version = json.version;

    console.log('Latest repository version', repositoryTweaksConfig.version, repositoryTweaksConfig.tweaks);
    return repositoryTweaksConfig.version !== currentVersion;
  });
}

function getTweaksFromJSON(json, path = '') {
  if (json.tweaks) {
    let result = [];
    for (let name in json.tweaks) {
      result = result.concat(getTweaksFromJSON(json.tweaks[name], (path ? path + '/' : '') + name));
    }
    return result;
  } else {
    return {
      name: path,
      config: json
    }
  }
}

function checkAndInject(details) {
  console.log(details);

  const version = develop ? Math.random() : repositoryTweaksConfig.version;
  const tabData = youtrackTabs.get(details.id);

  const matchedConfigs = userTweaksConfiguration.slice().filter(config => configFilter(config, details)).map(c => c.type);

  let chain = sendSafeStop(details);

  if (matchedConfigs.length) {
    if (!tabData.coreInjected || tabData.coreInjected !== version) {
      chain = chain.then(() => loadAndInject(details, `index.js?v=${version}`));
      tabData.coreInjected = version;
    }

    chain = chain.
    then(() => {
      const promises = [];

      repositoryTweaksConfig.tweaks.forEach(tweak => {
        const existingVersion = tabData.injected.get(tweak.name);
        if ((!existingVersion || existingVersion !== version) && matchedConfigs.indexOf(tweak.name) !== -1) {
          tweak.config.js && promises.push(loadAndInject(details, `${tweak.name}/index.js?v=${version}`, tweak.name, chrome.runtime.id));
          tweak.config.css && promises.push(loadAndInject(details, `${tweak.name}/index.css?v=${version}`));

          tabData.injected.set(tweak.name, version);
        }
      });

      return Promise.all(promises);
    }).
    then(() => sendConfiguration(details));
  }

  return chain;
}

function getYoutrackTabsByQuery(query = {title: '*YouTrack*'}) {
  return new Promise(resolve => {
    chrome.tabs.query(query, function(tabs) {
      resolve(tabs);
    });
  });
}

function reloadTab(tab) {
  return chrome.tabs.reload(tab.id);
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
      injected: new Map(),
      coreInjected: false
    });
    checkAndInject(details);
  } else if (request.tweaks) {
    console.log('Recieve new tweaks config');

    userTweaksConfiguration = request.tweaks;
    forAllTabs(checkAndInject);
  }
});

const storage = window.browser ? chrome.storage.local : chrome.storage.sync; // fix for firefox

function readSavedConfiguration() {
  return new Promise(resolve => {
    storage.get(['tweaks', 'version'], data => {
      userTweaksConfiguration = data.tweaks || [];
      console.log('initial tweaks fetched', JSON.stringify(userTweaksConfiguration));

      if (!data.welcome && userTweaksConfiguration.length === 0) {
        resolve(setDefaultTweaks());
      } else {
        resolve();
      }
    });
  });
}

function setDefaultTweaks() {
  return asyncLoad('default.json?' + repositoryTweaksConfig.version).
  then(content => {
    const tweaks = JSON.parse(content);
    storage.set({
      welcome: true,
      tweaks
    });
    userTweaksConfiguration = tweaks;
  });
}

function scheduleCheck() {
  window.setInterval(() => {
    reloadRepositoryConfiguration().then(shouldUpdate => {
      console.log('check for new version: ', shouldUpdate);
      shouldUpdate && forAllTabs(checkAndInject);
    });
  }, 60 * 30 * 1000);
}

reloadRepositoryConfiguration().then(() => {
  return readSavedConfiguration()
    .then(getYoutrackTabsByQuery)
    .then(tabs => {
      tabs.forEach(reloadTab);
    })
    .then(scheduleCheck);
});