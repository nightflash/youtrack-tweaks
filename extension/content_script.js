(function () {
  const probeResult = document.querySelector('html').getAttribute('ng-app') === 'YouTrack';

  chrome.runtime.sendMessage(chrome.runtime.id, {probe: probeResult});

  window.addEventListener('message', event => {
    if (event.data && event.data.extensionId === chrome.runtime.id) {
      chrome.runtime.sendMessage(chrome.runtime.id, event.data);
    }
  });
})();