import clipboardJS from 'clipboard-js';

import board from '../board';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  let agileBoardNode, agileBoardController, agileBoardEventSource,
      groupByField, messageFormat, useForSingleIssue, addNewlineAfterGroup;

  let stopFns = [];

  function listenToKeys(event) {
    const selectedIssues = agileBoardController.getAllSelectedIssues();
    const notify = ytTweaks.inject('notify');

    const baseUrl = document.location.href.split('/agiles')[0];
    const format = issue => messageFormat.
                              replace('%id%', issue.id).
                              replace('%link%', issue.link).
                              replace('%summary%', issue.summary).
                              replace('%group%', issue.value);

    if (event.keyCode === 67 && (event.ctrlKey || event.metaKey) && selectedIssues.length) {
      if (selectedIssues.length === 1 && !useForSingleIssue) {
        return;
      }

      const groupsMap = new Map();
      let issuesText = '';

      selectedIssues.
        forEach(issue => {
          const id = `${issue.project.shortName}-${issue.numberInProject}`;
          const groupKey = board.getIssueFieldValue(issue, groupByField);

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

      Array.from(groupsMap.values()).forEach((group, index) => {
        issuesText += group.join('\n');
        issuesText += '\n';

        if (index !== (groupsMap.size - 1) && addNewlineAfterGroup) {
          issuesText += '\n';
        }
      });

      clipboardJS.copy(issuesText).then(() => {
        notify.success('Issues successfully copied to the clipboard!');
      }, error => {
        notify.error('Can\'t copy issues!');
      });

      event.preventDefault();
    }
  }

  function ready(data) {
    ({agileBoardNode, agileBoardController, agileBoardEventSource} = data);

    data.configs.forEach(config => {
      groupByField = config.config.groupByField;
      messageFormat = config.config.messageFormat;
      useForSingleIssue |= config.config.useForSingleIssue;
      addNewlineAfterGroup |= config.config.addNewlineAfterGroup;
    });

    document.addEventListener('keydown', listenToKeys);

    stopFns.push(() => document.removeEventListener('keydown', listenToKeys));
    stopFns.push(() => {
      useForSingleIssue = false;
      addNewlineAfterGroup = false;
    });
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