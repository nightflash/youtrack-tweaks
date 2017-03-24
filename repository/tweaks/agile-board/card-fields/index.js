function tweak(name) {
  const ytTweaks = window.ytTweaks;

  const tweakClass = `${ytTweaks.baseClass}-${name.replace('/', '-')}`;
  const tweakAttribute = `${ytTweaks.baseAttribute}-${name.replace('/', '-')}`;

  const agileBoardSelector = '[data-test="agileBoard"]';

  let stopFns = [];

  let agileBoardNode, agileBoardController, agileBoardEventSource;
  let fieldsToShow;
  let injects = {};

  function attachToBoardEvents() {
    const revertOnBoardSelect = ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', run);
    const revertOnSprintSelect = ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', run);
    const revertOnChangeCardDetailLevel = ytTweaks.mockMethod(agileBoardController, 'onChangeCardDetailLevel', run);
    const revertLoadMoreCards = ytTweaks.mockMethod(agileBoardController, 'toggleSwimlane', promise => promise.then(tweakNewCards));
    const revertCollapseBoardColumn = ytTweaks.mockMethod(agileBoardController, 'collapseBoardColumn', () => injects.$timeout(tweakNewCards));

    stopFns.push(revertOnBoardSelect, revertOnSprintSelect, revertOnChangeCardDetailLevel, revertLoadMoreCards, revertCollapseBoardColumn);

    const onSprintCellUpdate = event => {
      const data = JSON.parse(event.data);
      injects.$timeout(() => {
        const cardNode = agileBoardNode.querySelector(`[data-issue-id="${data.issue.id}"]`);
        revertCardNode(cardNode);
        processCardNode(cardNode);
      });
    };

    agileBoardEventSource.addEventListener('sprintCellUpdate', onSprintCellUpdate);

    stopFns.push(() => agileBoardEventSource.removeEventListener('sprintCellUpdate', onSprintCellUpdate));
  }

  const conversions = {
    no: name => name,
    letter: name => name.substr(0, 1)
  };

  function processCardNode(cardNode) {
    if (cardNode.hasAttribute(tweakAttribute)) {
      return;
    }
    cardNode.setAttribute(tweakAttribute, true);

    if (!fieldsToShow.length) return;
    const allowedFieldNames = fieldsToShow.map(f => f.name);

    const cardCtrl = angular.element(cardNode).controller('ytAgileCard');
    const cardFooter = cardNode.querySelector('.yt-agile-card__footer .yt-pull-right');

    const scope = injects.$rootScope.$new();
    scope.ytAgileCardCtrl = cardCtrl;

    scope.ytTweakFields = (issueFields = []) => {
      return issueFields
        .filter(f => allowedFieldNames.indexOf(f.projectCustomField.field.name) !== -1)
        .map(f => {
          const index = allowedFieldNames.indexOf(f.projectCustomField.field.name);
          const conversionType = fieldsToShow[index].conversion;
          const useColors = !fieldsToShow[index].ignoreColors;

          let values = f.value;
          if (!Array.isArray(values)) {
            values = [values];
          }

          values = values.filter(v => v);

          f.ytTweakData = {
            index,
            name: f.projectCustomField.field.name,
            values,
            conversionType,
            getValueName: conversions[conversionType],
            getValueClasses(value) {
              let classes = `yt-tweak-field-value-${conversionType}`;
              if (+value.color.id && useColors) {
                classes += ` color-fields__background-${value.color.id} color-fields__field-${value.color.id}`;
              }
              return classes;
            }
          };

          return f;
        })
        .sort((a, b) => (a.ytTweakData.index > b.ytTweakData.index));
    };

    stopFns.push(() => scope.$destroy());

    const compiledElement = injects.$compile(`
        <span class="${tweakClass}">
          <span class="yt-tweak-field" ng-repeat="field in ytTweakFields(ytAgileCardCtrl.issue.fields) track by field.id">
            <span ng-repeat="value in field.ytTweakData.values track by value.id" title="{{value.name}}"
              class="{{field.ytTweakData.getValueClasses(value)}}">{{field.ytTweakData.getValueName(value.name)}}</span>
          </span>
        </span>
      `)(scope);

    cardFooter.appendChild(compiledElement[0]);
    scope.$evalAsync();
  }

  function tweakNewCards() {
    document.querySelectorAll(`yt-agile-card:not([${tweakAttribute}])`).forEach(processCardNode);
  }

  function revertCardNode(node) {
    ytTweaks.removeNodes(`.${tweakClass}`, node);
    node.removeAttribute(tweakAttribute);
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
    fieldsToShow = [];
    injects = ytTweaks.inject('$compile', '$timeout', '$rootScope');

    const configs = ytTweaks.getConfigsForTweak(name).filter(config => {
      return ytTweaks.inArray(config.config.sprintName, agileBoardController.sprint.name, true) &&
          ytTweaks.inArray(config.config.boardName, agileBoardController.agile.name, true);
    });

    if (!configs.length) {
      ytTweaks.log(name, 'no suitable config, sorry');
      return;
    }

    configs.forEach(tweak => {
      const config = tweak.config;
      let fields = [];
      if (config.singleMode) {
        fields = config.sizeParams;
      } else {
        fields = config[`sizeParams${agileBoardController.cardDetailLevel}`];
      }

      fields.reverse().forEach(field => {
        fieldsToShow.push(field);
      });
    });

    ytTweaks.log(name, 'fields to show', fieldsToShow);

    attachToBoardEvents();
    tweakNewCards();
  }

  function stop() {
    stopFns.forEach(fn => fn());
    stopFns = [];
    document.querySelectorAll(`[${tweakAttribute}]`).forEach(revertCardNode);
  }

  function run() {
    stop();
    ytTweaks.wait(runWait, runAction, null, `wait run() ${name}`);
  }

  ytTweaks.registerTweak({
    name,
    run,
    stop
  });
}