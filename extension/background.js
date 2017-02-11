console.log('YouTrack tweaks');

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
    injectTagWithContent(details, content, path.indexOf('.js') !== -1, args);
  });
}

function forAllTabs(action) {
  youtrackTabs.forEach((tabData, tabId) => {
    console.log('updating tab', tabId);
    action(tabData.details);
  });
}

let tweaksConfiguration = [];

chrome.storage.sync.get('tweaks', data => {
  console.log('tweaks are fetched', data['tweaks']);
  tweaksConfiguration = data['tweaks'] || [];
});

const youtrackTabs = new Map();

const configFilter = (config, details) => (details.url.indexOf(config.url) !== -1);

function sendConfiguration(details) {
  const filteredConfigs = tweaksConfiguration.filter(config => configFilter(config, details));
  console.log('sending configuration', details.url, filteredConfigs);
  return injectTagWithContent(details, `
    window.ytTweaks.configure(${JSON.stringify(filteredConfigs)});
  `);
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
  let version = 0;
  const tabData = youtrackTabs.get(details.id);

  if (!tabData.injected) {
    const hasConfigMatches = tweaksConfiguration.some(config => configFilter(config, details));

    if (hasConfigMatches) {
      asyncLoad('options.json?' + +Math.random()).
      then(content => {
        const json = JSON.parse(content);
        version = json.version;

        return runFileAsCode(details, `index.js?v=${version}`).then(() => getTweaksFromJSON(json));
      }).
      then(tweaksToInject => {
        const promises = [];

        tweaksToInject.forEach(tweak => {
          tweak.config.js && promises.push(runFileAsCode(details, `${tweak.name}/index.js?v=${version}`, tweak.name));
          tweak.config.css && promises.push(runFileAsCode(details, `${tweak.name}/index.css?v=${version}`));
        });

        return Promise.all(promises);
      }).
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