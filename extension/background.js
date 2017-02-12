console.log('YouTrack tweaks');
const develop = true;

function asyncLoad(path) {
  return new Promise(function(resolve, reject) {
    const serverUrl = develop ? 'http://localhost:8080/' : 'https://extension.youtrack-tweaks.com/';
    const xhr = new XMLHttpRequest();

    xhr.open('GET', serverUrl + path, true);

    xhr.onload = function () {
      resolve(this.responseText);
    };

    xhr.onerror = function () {
      reject(this.status);
    };

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

let userTweaksConfiguration = [];

chrome.storage.sync.get('tweaks', data => {
  console.log('tweaks are fetched', data['tweaks']);
  userTweaksConfiguration = data['tweaks'] || [];
});

const youtrackTabs = new Map();

const configFilter = (config, details) => (config.url === '' || details.url.indexOf(config.url) !== -1);

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

let repositoryTweaksConfig = {
  version: -1,
  tweaks: []
};

function reloadTweaksConfiguration() {
  return asyncLoad('options.json?' + +Math.random()).
  then(content => {
    const json = JSON.parse(content);
    const currentVersion = repositoryTweaksConfig.version;
    repositoryTweaksConfig.tweaks = getTweaksFromJSON(json);
    repositoryTweaksConfig.version = json.version;

    console.log('Latest version', repositoryTweaksConfig.version);
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
          tweak.config.js && promises.push(loadAndInject(details, `${tweak.name}/index.js?v=${version}`, tweak.name));
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

reloadTweaksConfiguration().then(() => {
  !develop && window.setInterval(() => {
    reloadTweaksConfiguration().then(shouldUpdate => {
      console.log('check for new version: ', shouldUpdate);
      shouldUpdate && forAllTabs(checkAndInject);
    });
  }, 60 * 30 * 1000);
});