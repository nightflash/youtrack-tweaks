function tweak(name, extensionId) {
  const ytTweaks = window.ytTweaks;
  let running = false;

  const agileBoardSelector = '[data-test="agileBoard"]';

  let injects;
  let agileBoardNode, agileBoardController, agileBoardEventSource;

  let tweakData;
  let conditionsGroups = [];

  const storage = ytTweaks.storage('local');
  const storageKey = `ytTweaks-${name}-notified`;
  let stopFns = [];

  let activeNotifications = [];

  storage.removeItem(storageKey);

  function addNotified(issueId) {
    const current = storage.get(storageKey) || [];
    if (current.indexOf(issueId) === -1) {
      current.push(issueId);
    }

    storage.set(storageKey, current);
  }

  function isNotified(issueId) {
    const current = storage.get(storageKey) || [];
    return current.indexOf(issueId) !== -1;
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
    if (isNotified(issue.id)) return false;
    let _config;

    const checkResult = conditionsGroups.some(config => {
      _config = config;
      return config.conditions.every(condition => {
        return isFieldEquals(issue, condition.fieldName, condition.fieldValue);
      });
    });

    return checkResult ? _config : false;
  }

  const defaultIcon = `chrome-extension://${extensionId}/images/128.png`;

  function notify(issue, message, ttl, icon) {
    addNotified(issue.id);
    console.log(issue);

    let closeTimeout;

    const body = (message || 'New issue on the board')
        .replace('%sprintName%', agileBoardController.sprint.name)
        .replace('%boardName%', agileBoardController.agile.name)
        .replace('%projectName%', issue.project.name)
        .replace('%reporterName%', issue.reporter.login);

    const notification = new Notification(issue.summary, {
      requireInteraction: true,
      icon: icon || defaultIcon,
      body
    });
    notification.onclick = () => {
      notification.close();
      window.focus();

      const cardNode = agileBoardNode.querySelector(`[data-issue-id="${issue.id}"]`);
      const ytAgileCardCtrl = cardNode && angular.element(cardNode).controller('ytAgileCard');

      if (ytAgileCardCtrl) {
        ytAgileCardCtrl.openIssueView(ytAgileCardCtrl.issue, ytAgileCardCtrl.analyticsModifier);
      } else {
        const path = window.location.href.split('/agiles')[0];
        window.open(`${path}/issue/${issue.project.shortName}-${issue.numberInProject}`);
      }
    };

    notification.onshow = () => {
      if (+ttl > 0) {
        closeTimeout = window.setTimeout(() => notification.close(), ttl);
      }
    };

    notification.onclose = () => {
      window.clearTimeout(closeTimeout);
    };

    activeNotifications.push(notification);
  }

  function cellUpdateHandler(event) {
    const data = JSON.parse(event.data);
    const issue = data.issue;
    const cardNode = agileBoardNode.querySelector(`[data-issue-id="${data.issue.id}"]`);

    if (!cardNode) {
      const successConfig = shouldNotify(issue);
      if (successConfig) {
        notify(issue, successConfig.message, successConfig.ttl, successConfig.icon);
      }
    }
  }

  function closeAllNotifications() {
    activeNotifications.forEach(notification => notification.close());
    activeNotifications = [];
  }

  function attachToBoardEvents() {
    agileBoardEventSource.addEventListener('sprintCellUpdate', cellUpdateHandler);
    window.addEventListener('beforeunload', closeAllNotifications);

    const revertOnBoardSelect = ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', run);
    const revertOnSprintSelect = ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', run);
    const revertSprintCellUpdate = () => agileBoardEventSource.removeEventListener('sprintCellUpdate', cellUpdateHandler);
    const revertOnBeforeUnload = () => window.removeEventListener('beforeunload', closeAllNotifications);

    stopFns.push(revertOnBoardSelect, revertOnSprintSelect, revertSprintCellUpdate, revertOnBeforeUnload);
  }

  function runWait() {
    agileBoardNode = document.querySelector(agileBoardSelector);
    if (agileBoardNode) {
      agileBoardController = angular.element(agileBoardNode).controller();
      agileBoardEventSource = ytTweaks.inject('agileBoardLiveUpdater').getEventSource();
      agileBoardEventSource = agileBoardEventSource && agileBoardEventSource._nativeEventSource;
      return agileBoardEventSource && agileBoardController && !agileBoardController.loading;
    }
  }

  function runAction() {
    Notification.requestPermission();
    conditionsGroups = [];

    injects = ytTweaks.inject('$compile', '$timeout', '$rootScope');

    const configs = ytTweaks.getConfigsForTweak(name).filter(config => {
      return ytTweaks.inArray(config.config.sprintName, agileBoardController.sprint.name, true) &&
          ytTweaks.inArray(config.config.boardName, agileBoardController.agile.name, true);
    });

    if (!configs.length) {
      ytTweaks.log(name, 'no suitable config, sorry');
      return;
    }

    configs.forEach(config => {
      conditionsGroups.push(config.config);
    });

    ytTweaks.log(name, 'watchers', conditionsGroups);

    attachToBoardEvents();
  }

  function stop() {
    stopFns.forEach(fn => fn());
    stopFns = [];
    running = false;
  }

  function run() {
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