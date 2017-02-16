function tweak(name, extensionId) {
  const ytTweaks = window.ytTweaks;
  let running = false;

  console.log(`chrome-extension://${extensionId}/images/256.png`);

  const agileBoardSelector = '[data-test="agileBoard"]';

  let injects, timeToken;
  let agileBoardNode, agileBoardController, agileBoardEventSource;

  let tweakData;

  const localStorage = ytTweaks.localStorage;


  let alreadyNotified = new Map();

  const storageKey = `ytTweaks-${name}-notified`;

  function addNotified(issueId) {
    alreadyNotified.set(issueId, true);
    localStorage.set(storageKey, Array.from(alreadyNotified.entries()));
  }

  function reloadNotified() {
    alreadyNotified = new Map(localStorage.get(storageKey));
  }

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
    reloadNotified();
    if (alreadyNotified.has(issue.id)) return false;

    const orCases = ytTweaks.trimmedSplit(tweakData.newIssueWatcher, ';');

    return orCases.some(orExpression => {
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
  }

  function notify(issue, reason = '') {
    addNotified(issue.id);

    let closeTimeout;
    const closeTTL = +tweakData.ttl || 0;
    const notification = new Notification(issue.summary, {
      requireInteraction: true,
      icon: `chrome-extension://${extensionId}/images/128.png`,
      body: reason
    });
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
    };
  }

  function attachToBoardEvents() {
    const localTimeToken = timeToken;

    agileBoardEventSource.on('sprintCellUpdate', data => {
      if (localTimeToken !== timeToken || !running) return false;

      const issue = data.issue;

      if (shouldNotify(issue)) {
        notify(issue, 'New issue on the board');
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
    running = false;
  }

  function run() {
    timeToken = +(new Date());
    stop();
    running = true;
    ytTweaks.wait(runWait, runAction, null, `wait run() ${name}`);
  }

  ytTweaks.registerTweak({
    name,
    run,
    stop
  });
}