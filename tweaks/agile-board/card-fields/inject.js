(function () {
  const ytTweaks = window.ytTweaks;

  function run() {
    const {$compile, $timeout, $rootScope, $q} = ytTweaks.inject('$compile', '$timeout', '$rootScope', '$q');

    const fieldsToShow = [
      {name: 'Subsystems', conversion: 'letter'},
      {name: 'Subsystem', conversion: 'letter'},
      {name: 'Type', conversion: 'no'}
    ];

    let agileBoardEventSource;
    let agileBoardNode;
    let agileBoardController;

    function attachToBoardEvents() {
      agileBoardNode = document.querySelector('[data-test="agileBoard"]');
      agileBoardController = angular.element(agileBoardNode).controller();
      agileBoardEventSource = ytTweaks.inject('agileBoardLiveUpdater').getEventSource();

      ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', () => {
        ytTweaks.log('board changed');
        waitForCards(() => {
          tweakNewCards();
          attachToBoardEvents();
        });
      });

      ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', () => {
        ytTweaks.log('sprint changed');
        waitForCards(() => {
          tweakNewCards();
          attachToBoardEvents();
        });
      });

      agileBoardEventSource.on('sprintCellUpdate', function (data) {
        $timeout(function () {
          const cardNode = agileBoardNode.querySelector(`[data-issue-id="${data.issue.id}"]`);
          processCardNode(cardNode);
        });
      });
    }

    const conversions = {
      no: name => name,
      letter: name => name.substr(0, 1)
    };

    const tweakClass = 'yt-tweak-agile-fields';

    function processCardNode(cardNode) {
      if (cardNode.hasAttribute('yt-tweak')) {
        return;
      }

      cardNode.setAttribute('yt-tweak', true);
      const cardCtrl = angular.element(cardNode).controller('ytAgileCard');

      function redrawFields() {
        cardNode.querySelectorAll(`.${tweakClass}`).forEach(node => {
          node.parentNode.removeChild(node);
        });

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
                  getValueName: conversions[conversionType]
                };

                return f;
              })
              .sort((a, b) => (a.ytTweakData.index > b.ytTweakData.index));
        };

        const compiledElement = $compile(`
      <span class="${tweakClass}">
        <span class="yt-tweak-field" ng-repeat="field in ytTweakFields(ytAgileCardCtrl.enumeratedFieldValues) track by field.id">
          <span ng-repeat="value in field.ytTweakData.values track by value.id"
            class="yt-tweak-field-value-{{field.ytTweakData.conversionType}} color-fields__background-{{value.color.id}} color-fields__field-{{value.color.id}}">
                  {{field.ytTweakData.getValueName(value.name)}}
          </span>
        </span>
      </span>
    `)(scope);

        cardFooter.appendChild(compiledElement[0]);
        scope.$evalAsync();
      }

      redrawFields();
    }

    function tweakNewCards() {
      document.querySelectorAll('[data-test="yt-agile-board-card"]:not([yt-tweak])').forEach(processCardNode);
    }


    attachToBoardEvents();
    waitForCards(tweakNewCards);
  }

  function waitForCards(callback) {
    ytTweaks.wait(
        () => document.querySelectorAll('[data-test="yt-agile-board-card"]:not([yt-tweak]').length,
        callback
    );
  }

  ytTweaks.registerTweak({
    name: 'Agile Board Custom Fields',
    group: 'agile-board',
    wait: waitForCards,
    run
  })
})();