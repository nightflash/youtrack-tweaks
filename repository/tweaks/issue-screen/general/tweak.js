import screen from '../screen';

export default function tweak(name) {
  let stopFns = [];

  function ready({issue, configs, issueViewController}) {
    if (!configs.length) {
      return;
    }

    const config = [...configs].pop();
    tabTitle(issue, config);
    formattedCopy(issue, issueViewController, config);
  }

  function formattedCopy(issue, ctrl, config) {
    const mockUndo = ytTweaks.mockMethod(ctrl, 'getIssueIdAndSummary', original =>
        formatter(config.config.formattedCopy, issue) || original, false);

    stopFns.push(mockUndo);
  }

  function tabTitle(issue, config) {
    const currentTitle = document.title;

    stopFns.push(() => {
      document.title = currentTitle;
    });

    document.title = formatter(config.config.tabTitle, issue);
  }

  function formatter(template = '', issue) {
    return template.replace('%id%', issue.idReadable).replace('%summary%', issue.summary);
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
