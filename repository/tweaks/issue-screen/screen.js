export default {
  issueWait(tweakName, successCb, errorCb) {
    const issueSelector = '[data-test="yt-issue-view"]';
    let issueNode, controller;

    const waitFn = () => {
      issueNode = document.querySelector(issueSelector);
      controller = angular.element(issueNode).controller();

      if (issueNode && controller) {
        return true;
      }
    };

    const runFn = () => {
      const configs = ytTweaks.getConfigsForTweak(tweakName);

      successCb({
        configs,
        issue: controller.issue,
        issueNode
      });
    };


    if (document.location.pathname.indexOf('/issue/') !== -1) {
      return ytTweaks.wait(waitFn, runFn, errorCb, `wait run() ${tweakName}`);
    } else {
      return () => {};
    }
  }
}
