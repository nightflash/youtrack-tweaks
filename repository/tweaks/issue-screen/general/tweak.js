import screen from '../screen';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  let stopFns = [];

  function ready({issue, configs}) {
    if (!configs.length) {
      return;
    }

    const config = [...configs].pop();
    const currentTitle = document.title;

    stopFns.push(() => {
      document.title = currentTitle;
    });

    document.title = config.config.tabTitle.replace('%id%', issue.idReadable).replace('%summary%', issue.summary);
  }

  let issueWaitCancel = () => {};

  function stop() {
    issueWaitCancel();
    stopFns.forEach(fn => fn());
    stopFns = [];
  }

  function run() {
    stop();
    issueWaitCancel = screen.issueWait(name, ready);
  }

  return {
    name,
    run,
    stop
  };
}
