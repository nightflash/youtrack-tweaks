function tweak(name) {
  const ytTweaks = window.ytTweaks;

  const agileBoardSelector = '[data-test="agileBoard"]';

  let injects, timeToken;
  let agileBoardNode, agileBoardController, agileBoardEventSource;

  let tweakData;

  const alreadyNotified = new Map();

  function isValueEqual(field, testValue) {
    let fieldValues;
    if (!Array.isArray(field.value)) {
      fieldValues = [field.value];
    } else {
      fieldValues = field.value;
    }

    return fieldValues.some(val => val.name === testValue)
  }

  function isFieldEquals(issue, fieldName, testValue) {
    return issue.fields.some(field => {
      return field.projectCustomField.field.name === fieldName && isValueEqual(field, testValue);
    });
  }

  function shouldNotify(issue) {
    const orCases = ytTweaks.trimmedSplit(tweakData.newIssueWatcher, ';');

    const testResult = orCases.some(orExpression => {
      const andCases = ytTweaks.trimmedSplit(orExpression, ',');

      return andCases.every(andExpression => {
        const [fieldName, testValue] = ytTweaks.trimmedSplit(andExpression, ':');

        if (fieldName && testValue !== undefined) {
          return isFieldEquals(issue, fieldName, testValue);
        } else {
          return false;
        }
      });
    });

    return testResult && !alreadyNotified.has(issue.id);
  }

  function notify(issue) {
    alreadyNotified.set(issue.id, true);

    let closeTimeout;
    const closeTTL = +tweakData.ttl || 0;
    const notification = new Notification(issue.summary);
    notification.onclick = () => {
      const cardNode = agileBoardNode.querySelector(`[data-issue-id="${issue.id}"]`);
      const ytAgileCardCtrl = angular.element(cardNode).controller('ytAgileCard');

      ytAgileCardCtrl.openIssueView(ytAgileCardCtrl.issue, ytAgileCardCtrl.analyticsModifier);
      notification.close();
      window.focus();
    };

    notification.onshow = () => {
      if (closeTTL) {
        closeTimeout = window.setTimeout(() => notification.close(), closeTTL);
      }
    };

    notification.onclose = () => {
      window.clearTimeout(closeTimeout);
    }
  }

  function attachToBoardEvents() {
    const localTimeToken = timeToken;

    agileBoardEventSource.on('sprintCellUpdate', data => {
      if (localTimeToken !== timeToken) return false;

      const issue = data.issue;

      if (shouldNotify(issue)) {
        notify(issue);
      }
    });
  }

  function runWait() {
    agileBoardNode = document.querySelector(agileBoardSelector);
    if (agileBoardNode) {
      agileBoardController = angular.element(agileBoardNode).controller();
      agileBoardEventSource = ytTweaks.inject('agileBoardLiveUpdater').getEventSource();
      return agileBoardEventSource && agileBoardController && !agileBoardController.loading;
    }
  }

  function runAction() {
    Notification.requestPermission();
    tweakData = {};

    injects = ytTweaks.inject('$compile', '$timeout', '$rootScope');

    const configs = ytTweaks.getConfigsForTweak(name);
    if (!configs.length) {
      ytTweaks.log(name, 'no suitable config, sorry');
      return;
    }


    const suitableConfigs = configs.filter(config => {
      const sprintNames = ytTweaks.trimmedSplit(config.config.sprintName);
      const boardNames = ytTweaks.trimmedSplit(config.config.boardName);

      return ytTweaks.inArray(sprintNames, agileBoardController.sprint.name, true) &&
        ytTweaks.inArray(boardNames, agileBoardController.agile.name, true);
    });

    if (suitableConfigs.length) {
      tweakData = suitableConfigs.shift().config;
    }

    ytTweaks.log(name, 'watchers', tweakData.newIssueWatcher);

    attachToBoardEvents();
  }

  function stop() {
  }

  function run() {
    timeToken = +(new Date());
    stop();
    ytTweaks.wait(runWait, runAction, null, `wait run() ${name}`);
  }

  ytTweaks.registerTweak({
    name,
    run,
    stop
  });
}