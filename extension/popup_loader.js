chrome.management.getSelf(info => {
  const develop = info.installType === 'development';

  const url = develop ? 'http://localhost:4200/' : 'https://extension.youtrack-tweaks.com/menu/';

  // fucking chrome https://bugs.chromium.org/p/chromium/issues/detail?id=457887
  window.setTimeout(() => {
    const node = document.createElement('script');
    node.type = 'text/javascript';
    node.src = url + 'main.js' + '?' + Math.random();
    document.head.appendChild(node);
  }, 70)
});