import board from '../board';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  let agileBoardNode, agileBoardController, agileBoardEventSource, configs;

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

  function getValue(value) {
    return value.name || value.fullName || value.login || value.presentation || value;
  }

  function isValueEqual(field, testValue) {
    let fieldValues;
    const value = getValue(field.value);
    if (!Array.isArray(value)) {
      fieldValues = [value];
    } else {
      fieldValues = value;
    }

    return fieldValues.some(val => val === testValue)
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

  const defaultIcon = require('./default-icon.png');

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

    stopFns.push(
        () => agileBoardEventSource.removeEventListener('sprintCellUpdate', cellUpdateHandler),
        () => window.removeEventListener('beforeunload', closeAllNotifications)
    );
  }

  function ready(data) {
    agileBoardNode = data.agileBoardNode;
    agileBoardController = data.agileBoardController;
    agileBoardEventSource = data.agileBoardEventSource;
    configs = data.configs;

    Notification.requestPermission();
    conditionsGroups = [];

    configs.forEach(config => {
      conditionsGroups.push(config.config);
    });

    ytTweaks.log(name, 'watchers', conditionsGroups);

    attachToBoardEvents();
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