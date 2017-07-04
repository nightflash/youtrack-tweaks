import clipboardJS from 'clipboard-js';

import board from '../board';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  let agileBoardNode, agileBoardController, agileBoardEventSource, config, alert;

  let stopFns = [];

  function listenToKeys(event) {
    const selectedIssues = agileBoardController.getAllSelectedIssues();
    const issueViewOpened = document.querySelector('yt-issue-view');

    const baseUrl = document.location.href.split('/agiles')[0];
    const format = issue => config.messageFormat.
                              replace('%id%', issue.id).
                              replace('%link%', issue.link).
                              replace('%summary%', issue.summary).
                              replace('%group%', issue.value);

    if (!issueViewOpened && event.keyCode === 67 && (event.ctrlKey || event.metaKey) && selectedIssues.length) {
      if (selectedIssues.length === 1 && !config.useForSingleIssue) {
        return;
      }

      const groupsMap = new Map();
      let issuesText = '';

      selectedIssues.
        forEach(issue => {
          const id = `${issue.project.shortName}-${issue.numberInProject}`;
          const groupKey = board.getIssueFieldValue(issue, config.groupByField);

          if (!groupsMap.has(groupKey)) {
            groupsMap.set(groupKey, []);
          }

          const group = groupsMap.get(groupKey);

          group.push(format({
            id,
            link: `${baseUrl}/issue/${id}`,
            summary: issue.summary,
            value: groupKey
          }));
        });

      let index = 0;
      groupsMap.forEach((group, groupName) => {
        if (config.groupAsTitle) {
          issuesText += groupName + '\n';
        }

        issuesText += group.join('\n');
        issuesText += '\n';

        if (index !== (groupsMap.size - 1) && config.addNewlineAfterGroup) {
          issuesText += '\n';
        }

        index++;
      });

      clipboardJS.copy(issuesText).then(() => {
        alert.successMessage('Issues successfully copied to the clipboard!');
      }, error => {
        alert.errorMessage('Can\'t copy issues!');
      });

      event.preventDefault();
    }
  }

  function ready(data) {
    ({agileBoardNode, agileBoardController, agileBoardEventSource, alert} = data);

    config = angular.copy(data.configs[0].config);

    document.addEventListener('keydown', listenToKeys);

    stopFns.push(() => document.removeEventListener('keydown', listenToKeys));
  }

  let agileWaitCancel = () => {};

  function stop() {
    agileWaitCancel();
    stopFns.forEach(fn => fn());
    stopFns = [];
  }

  function run() {
    stop();
    agileWaitCancel = board.agileWait(name, ready);
  }

  return {
    name,
    run,
    stop
  }
}