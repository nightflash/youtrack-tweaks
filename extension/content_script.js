(function () {
  const probeResult = document.querySelector('html').getAttribute('ng-app') === 'YouTrack';

  probeResult && chrome.runtime.sendMessage(chrome.runtime.id, {probe: true});
})();