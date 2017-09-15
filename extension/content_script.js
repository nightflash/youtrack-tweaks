(function () {
  const probeResult = document.querySelector('html').getAttribute('ng-app') === 'YouTrack';

  chrome.runtime.sendMessage(chrome.runtime.id, {probe: probeResult});

  const messageBridgeHandler = event => {
    if (event.data && event.data.ytTweaks) {
      try {
        chrome.runtime.sendMessage(chrome.runtime.id, event.data);
      } catch(e) {
        window.removeEventListener('message', messageBridgeHandler);
      }
    }
  };

  window.addEventListener('message', messageBridgeHandler);
})();