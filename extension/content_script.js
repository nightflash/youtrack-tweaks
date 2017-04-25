(function () {
  const probeResult = document.querySelector('html').getAttribute('ng-app') === 'YouTrack';

  chrome.runtime.sendMessage(chrome.runtime.id, {probe: probeResult});
})();