chrome.management.getSelf(info => {
  const develop = info.installType === 'development';

  const url = develop ? 'http://localhost:4200/' : 'https://extension.youtrack-tweaks.com/menu/';

  const styles = ['styles.bundle.css'];
  const scripts = ['inline.bundle.js', 'vendor.bundle.js', 'main.bundle.js'];

  function loadScript(scriptUrl) {
    return new Promise((resolve, reject) => {
      const node = document.createElement('script');
      node.type = 'text/javascript';
      node.src = url + scriptUrl;
      node.onload = resolve;
      node.onerror = reject;
      document.head.appendChild(node);
    });
  }

  styles.forEach(script => {
    const node = document.createElement('link');
    node.rel = 'stylesheet';
    node.href = url + script;
    document.head.appendChild(node);
  });

  let chain = Promise.resolve();
  scripts.forEach(script => {
    chain = chain.then(() => loadScript(script));
  });
});