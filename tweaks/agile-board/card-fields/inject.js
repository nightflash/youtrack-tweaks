(function () {
  const ytTweaks = window.ytTweaks;
  const name = 'agile-board/card-fields';

  const tweakClass = `${ytTweaks.baseClass}-${name.replace('/', '.')}`;
  const tweakAttribute = `${ytTweaks.baseAttribute}-${name.replace('/', '-')}`;

  let stopFns = [];
  let timeToken;

  function run() {
    const {$compile, $timeout, $rootScope, $q} = ytTweaks.inject('$compile', '$timeout', '$rootScope', '$q');
    timeToken = +(new Date());

    const configs = ytTweaks.getTweakConfigs(name);
    if (!configs.length) return;

    const tweakConfig = configs[0];

    const fieldsToShow = [];

    const fields = tweakConfig.config.sizeParams0.split(',');
    fields.forEach(f => {
      const fieldData = f.split(':');

      fieldsToShow.push({
        name: fieldData[0],
        conversion: fieldData[1] || 'no'
      });
    });

    console.log(fieldsToShow);

    let agileBoardEventSource;
    let agileBoardNode;
    let agileBoardController;

    function attachToBoardEvents() {
      agileBoardNode = document.querySelector('[data-test="agileBoard"]');
      agileBoardController = angular.element(agileBoardNode).controller();
      agileBoardEventSource = ytTweaks.inject('agileBoardLiveUpdater').getEventSource();

      stopFns = [];

      const unMockOnBoardSelect = ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', () => {
        ytTweaks.log('board changed');
        waitForCards(() => {
          tweakNewCards();
          attachToBoardEvents();
        });
      });

      const unMockOnSprintSelect = ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', () => {
        ytTweaks.log('sprint changed');
        waitForCards(() => {
          tweakNewCards();
          attachToBoardEvents();
        });
      });

      stopFns.push(unMockOnBoardSelect, unMockOnSprintSelect);

      const onSprintCellUpdate = data => {
        const localTimeToken = timeToken;
        if (localTimeToken !== timeToken) return false;

        $timeout(function () {
          const cardNode = agileBoardNode.querySelector(`[data-issue-id="${data.issue.id}"]`);
          processCardNode(cardNode);
        });
      };

      agileBoardEventSource.on('sprintCellUpdate', onSprintCellUpdate);
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
      const cardCtrl = angular.element(cardNode).controller('ytAgileCard');

      ytTweaks.removeNodes(`.${tweakClass}`, cardNode);

      const cardFooter = cardNode.querySelector('.yt-agile-card__footer .yt-pull-right');
      const allowedFieldNames = fieldsToShow.map(f => f.name);

      const scope = $rootScope.$new();
      scope.ytAgileCardCtrl = cardCtrl;
      scope.ytTweakFields = (enumeratedIssueFields = []) => {
        return enumeratedIssueFields
            .filter(f => allowedFieldNames.indexOf(f.projectCustomField.field.name) !== -1)
            .map(f => {
              const index = allowedFieldNames.indexOf(f.projectCustomField.field.name);
              const conversionType = fieldsToShow[index].conversion;

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
                  if (+value.color.id) {
                    classes += ` color-fields__background-${value.color.id} color-fields__field-${value.color.id}`;
                  }
                  return classes;
                }
              };

              return f;
            })
            .sort((a, b) => (a.ytTweakData.index > b.ytTweakData.index));
      };

      const compiledElement = $compile(`
          <span class="${tweakClass}">
            <span class="yt-tweak-field" ng-repeat="field in ytTweakFields(ytAgileCardCtrl.enumeratedFieldValues) track by field.id">
              <span ng-repeat="value in field.ytTweakData.values track by value.id" title="{{value.name}}"
                class="{{field.ytTweakData.getValueClasses(value)}}">{{field.ytTweakData.getValueName(value.name)}}</span>
            </span>
          </span>
        `)(scope);

      cardFooter.appendChild(compiledElement[0]);
      scope.$evalAsync();
    }

    function tweakNewCards() {
      document.querySelectorAll(`[data-test="yt-agile-board-card"]:not([${tweakAttribute}])`).forEach(processCardNode);
    }


    waitForCards(() => {
      tweakNewCards();
      attachToBoardEvents();
    });
  }

  function revertCardNode(node) {
    ytTweaks.removeNodes(`.${tweakClass}`, node);
    node.removeAttribute(tweakAttribute);
  }

  function stop() {
    stopFns.forEach(fn => fn());
    document.querySelectorAll(`[${tweakAttribute}]`).forEach(revertCardNode);
  }

  function waitForCards(callback) {
    ytTweaks.wait(
        () => document.querySelectorAll(`[data-test="yt-agile-board-card"]:not([${tweakAttribute}]`).length,
        callback,
        null,
        `run ${name}`
    );
  }

  ytTweaks.registerTweak({
    name,
    run,
    stop
  })
})();