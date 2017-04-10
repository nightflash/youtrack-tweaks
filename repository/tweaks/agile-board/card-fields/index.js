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
    const onBoardSelect = ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', run);
    const onSprintSelect = ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', run);
    const onChangeCardDetailLevel = ytTweaks.mockMethod(agileBoardController, 'onChangeCardDetailLevel', run);
    const toggleSwimlane = ytTweaks.mockMethod(agileBoardController, 'toggleSwimlane', promise => promise.then(tweakNewCards));
    const loadMoreSwimlanes = ytTweaks.mockMethod(agileBoardController, 'loadMoreSwimlanes', promise => promise.then(() => injects.$timeout(tweakNewCards, 10)));
    const collapseBoardColumn = ytTweaks.mockMethod(agileBoardController, 'collapseBoardColumn', () => injects.$timeout(tweakNewCards));

    agileBoardController.boardSearchQueryModel.on('apply', run);
    const offOnApply = () => agileBoardController.boardSearchQueryModel.off('apply', run);

    stopFns.push(onBoardSelect, onSprintSelect, onChangeCardDetailLevel, toggleSwimlane, loadMoreSwimlanes, collapseBoardColumn, offOnApply);

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

  const hash = s => s.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
  }, 0);

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

    const fields = [];

    scope.$watch(() => cardCtrl.issue.fields, () => {
      scope.fields = [];

      const availableFields = cardCtrl.issue.fields.slice();
      availableFields.push({
        id: 'project',
        projectCustomField: {
          field: {
            name: 'Project'
          }
        },
        value: {
          name: cardCtrl.issue.project.name,
          id: 'pname'
        }
      });

      availableFields.forEach(f => {
        const index = allowedFieldNames.indexOf(f.projectCustomField.field.name);

        if (index !== -1) {
          const name = f.projectCustomField.field.name;
          const config = fieldsToShow[index];
          const color = config.color || {};
          const conversionType = config.conversion;
          const opacity = color.opacity || 1;

          let values = f.value;
          if (!Array.isArray(values)) {
            values = [values];
          }

          values = values.filter(v => v).map(value => {
            let colorId = value.color && +value.color.id;
            let classes = `yt-tweak-field-value-${conversionType}`;

            if (color.mode === 'ignore') {
              colorId = null;
            } else if (color.mode === 'auto' && !colorId) {
              colorId = Math.abs(hash(value.name) % color.generator);
            }

            if (colorId) {
              classes += ` yt-tweak-field-value-colored color-fields__background-${colorId} color-fields__field-${colorId}`;
            }

            return {
              id: value.id,
              name: value.name,
              convertedName: conversions[conversionType](value.name),
              classes
            };
          });

          scope.fields.push({
            id: f.id,
            opacity,
            index,
            name,
            values
          });
        }
      });

      scope.fields = scope.fields.sort((a, b) => (a.index > b.index));
    });

    stopFns.push(() => scope.$destroy());

    const compiledElement = injects.$compile(`
        <span class="${tweakClass}">
          <span class="yt-tweak-field" ng-repeat="field in fields track by field.id" style="opacity: {{field.opacity}}">
            <span ng-repeat="value in field.values track by value.id" title="{{field.name}}: {{value.name}}"
              class="{{value.classes}}">{{value.convertedName}}</span>
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

      fields.slice().reverse().forEach(field => {
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