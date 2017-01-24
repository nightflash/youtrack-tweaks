(function () {
  const ytTweaks = window.ytTweaks;

  function run() {
    const injector = ytTweaks.injector;
    const $compile = injector.get('$compile');
    const $timeout = injector.get('$timeout');
    const $rootScope = injector.get('$rootScope');
    const $q = injector.get('$q');
    const agileBoardEventSource = injector.get('agileBoardLiveUpdater').getEventSource();

    const fieldsToShow = [
      {name: 'Subsystems', conversion: 'letter'},
      {name: 'Subsystem', conversion: 'letter'},
      {name: 'Type', conversion: 'no'}
    ];

    let agileBoardNode;
    let agileBoardController;

    function refreshDeps() {
      agileBoardNode = document.querySelector('[data-test="agileBoard"]');
      agileBoardController = angular.element(agileBoardNode).controller();

      mockMethod(agileBoardController, 'onBoardSelect', () => {
        ytTweaks.log('board changed');
        waitForCards(() => {
          tweakNewCards();
          refreshDeps();
        });
      });

      mockMethod(agileBoardController, 'onSprintSelect', () => {
        ytTweaks.log('sprint changed');
        waitForCards(() => {
          tweakNewCards();
          refreshDeps();
        });
      });
    }

    const conversions = {
      no: {
        fn: name => name
      },
      letter: {
        fn: name => name.substr(0, 1)
      }
    };

    const tweakClass = 'yt-tweak-agile-fields';

    function mockMethod(object, propertyName, mockFn) {
      const original = object[propertyName];
      object[propertyName] = (...args) => {
        original(...args);
        mockFn(...args);
      };
    }

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
                  getValueName: conversions[conversionType].fn
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

    agileBoardEventSource.on('sprintCellUpdate', function (data) {
      $timeout(function () {
        const cardNode = agileBoardNode.querySelector(`[data-issue-id="${data.issue.id}"]`);
        processCardNode(cardNode);
      });
    });


    refreshDeps();
    waitForCards(tweakNewCards);
  }

  function waitForCards(callback) {
    const interval = window.setInterval(() => {
      const cards = document.querySelectorAll('[data-test="yt-agile-board-card"]:not([yt-tweak]');
      if (cards.length) {
        window.clearInterval(interval);
        callback(cards);
      }
    }, 500);
  }

  ytTweaks.registerTweak({
    group: 'agile-board',
    wait: waitForCards,
    run
  })
})();