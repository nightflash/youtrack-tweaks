console.log('YouTrack tweaks');

function errorHandler(...args) {
  console.error(...args);
}

function runFileAsCode(details, path) {
  chrome.runtime.getPackageDirectoryEntry(function(root) {
    root.getFile(path, {}, function(fileEntry) {
      fileEntry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(e) {
          // contents are in this.result
          const extension = path.split('.').pop();
          const isJS = extension === 'js';
          const code = this.result.replace(new RegExp("'", 'g'), "\\'").replace(new RegExp("\\n", 'g'), ' ');


          chrome.tabs.executeScript(details.tabId, {
            code: `
              (function () {
                const script = document.createElement('${isJS ? 'script' : 'style'}');
                script.textContent = '${code}';
                (document.head || document.body || document.documentElement).appendChild(script);
              })();
            `
          });
        };
        reader.readAsText(file);
      }, errorHandler);
    }, errorHandler);
  });
}

function injectTweak(details, tweakName) {
  console.log('YouTrack Tweaks: injecting', tweakName);
  runFileAsCode(details, `tweaks/${tweakName}/inject.css`);
  runFileAsCode(details, `tweaks/${tweakName}/inject.js`);
}

chrome.webNavigation.onCompleted.addListener(function(details) {
  injectTweak(details, 'agile-board/card-fields')
}, {
  url: [{
    hostContains: 'youtrack'
  }]
});