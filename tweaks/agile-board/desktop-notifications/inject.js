const ytTweaks = window.ytTweaks;
const name = 'agile-board/desktop-notifications';

const agileBoardSelector = '[data-test="agileBoard"]';

let timeToken;

let agileBoardNode, agileBoardController, agileBoardEventSource;
let newIssueWatcher = '';
let injects = {};

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
  const orCases = ytTweaks.trimmedSplit(newIssueWatcher, ';');

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

  new Notification(issue.summary);
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

  newIssueWatcher = '';
  injects = ytTweaks.inject('$compile', '$timeout', '$rootScope');

  const configs = ytTweaks.getTweakConfigs(name);
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
    const pickedConfig = suitableConfigs.shift().config;
    newIssueWatcher = pickedConfig.newIssueWatcher;
  }

  ytTweaks.log(name, 'watchers', newIssueWatcher);

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