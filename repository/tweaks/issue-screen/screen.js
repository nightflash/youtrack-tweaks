export default {
  issueWait(tweakName, successCb, errorCb) {
    const issueSelector = '[data-test="yt-issue-view"]';
    let issueNode, issueController;

    const waitFn = () => {
      issueNode = document.querySelector(issueSelector);
      issueController = angular.element(issueNode).controller();

      if (issueNode && issueController) {
        return true;
      }
    };

    const runFn = () => {
      const configs = ytTweaks.getConfigsForTweak(tweakName);

      successCb({
        configs,
        issueViewController: angular.element(issueNode).controller('ytIssueView'),
        issue: issueController.issue,
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
