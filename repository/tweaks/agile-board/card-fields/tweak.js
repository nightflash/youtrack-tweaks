import board from '../board';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  const tweakClass = `${ytTweaks.baseClass}-${name.replace('/', '-')}`;
  const tweakAttribute = `${ytTweaks.baseAttribute}-${name.replace('/', '-')}`;

  let stopFns = [];

  let agileBoardNode, agileBoardController, agileBoardEventSource, configs;
  let fieldsToShow, prependIssueID, showTagsInSmallModes;
  let injects = {};

  const detailsLevelWithTags = 2;

  function attachToBoardEvents() {
    const onChangeCardDetailLevel = ytTweaks.mockMethod(agileBoardController, 'onChangeCardDetailLevel', run);
    const toggleSwimlane = ytTweaks.mockMethod(agileBoardController, 'toggleSwimlane', promise => promise.then(tweakNewCards));
    const loadMoreSwimlanes = ytTweaks.mockMethod(agileBoardController, 'loadMoreSwimlanes', promise => promise.then(() => injects.$timeout(tweakNewCards, 10)));
    const collapseBoardColumn = ytTweaks.mockMethod(agileBoardController, 'collapseBoardColumn', () => injects.$timeout(tweakNewCards));

    agileBoardController.boardSearchQueryModel.on('apply', run);
    const offOnApply = () => agileBoardController.boardSearchQueryModel.off('apply', run);

    stopFns.push(onChangeCardDetailLevel, toggleSwimlane, loadMoreSwimlanes, collapseBoardColumn, offOnApply);

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

    if (prependIssueID && agileBoardController.cardDetailLevel === 0) {
      const cardSummary = cardNode.querySelector('[data-test="yt-agile-board-card__summary"]');

      const compiledElement = injects.$compile(`
        <div class="yt-agile-card__summary" ng-class="{'yt-agile-card__summary_3-lines': ytAgileCardCtrl.show3LinesOfSummary()}" data-test="yt-agile-board-card__summary">
          <a class="${tweakClass} yt-issue-id yt-agile-card__id yt-dark-grey-text js-issue-id" 
             ng-class="{'yt-issue-id_resolved': !!ytAgileCardCtrl.issue.resolved}"
             style="margin-right: 4px;"
             target="_blank" data-test="yt-agile-board-card__id" 
             yt-agile-card-focus="" 
             yt-agile-card-focus-selection=":: ytAgileCardCtrl.selection" 
             yt-agile-card-focus-issue-id="94-93" 
             ng-click="ytAgileCardCtrl.onIssueIdClick($event)"
             ng-href="issue/{{ytAgileCardCtrl.readableIssueId}}">
                {{ytAgileCardCtrl.readableIssueId}}
           </a>
          {{ytAgileCardCtrl.issue.summary}}
        </div>
      `)(scope);

      cardSummary.parentNode.replaceChild(compiledElement[0], cardSummary);
    }

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
          const field = f.projectCustomField.field;
          const name = field.name;
          const valueType = field.fieldType && field.fieldType.valueType;
          const config = fieldsToShow[index];
          const color = config.color || {};
          const conversionType = config.conversion;
          const opacity = color.opacity || 1;

          let valueConverter;
          switch (valueType) {
            default:
              valueConverter = v => v;
              break;
            case 'date':
              valueConverter = v => injects.$filter('date')(v, 'MMM d');
              break;
          }

          let values = f.value;
          if (!Array.isArray(values)) {
            values = [values];
          }

          values = values.filter(v => v).map(value => {
            let colorId = value.color && +value.color.id;
            let classes = `yt-tweak-field-value-${conversionType}`;

            let valueName = valueConverter(value.name || value.fullName || value.login || value.presentation || value);

            if (color.mode === 'ignore') {
              colorId = null;
            } else if (color.mode === 'auto') {
              colorId = Math.abs(hash(valueName) % color.generator);
            }

            if (colorId) {
              classes += ` yt-tweak-field-value-colored color-fields__background-${colorId} color-fields__field-${colorId}`;
            }

            return {
              id: value.id,
              name: valueName,
              convertedName: conversions[conversionType](valueName),
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

    const tagsTemplate = `
        <yt-issue-tags
          issue-id="ytAgileCardCtrl.issue.id" 
          issue-project="ytAgileCardCtrl.issue.project" 
          tags="ytAgileCardCtrl.issue.tags" tag-width-limit="10">           
        </yt-issue-tags>`;

    const compiledElement = injects.$compile(`
        <span class="${tweakClass}">
          <span class="yt-tweaks-fields-area">
            <span class="yt-tweak-field" ng-repeat="field in fields track by field.id" style="opacity: {{field.opacity}}">
              <span ng-repeat="value in field.values track by value.id" title="{{field.name}}: {{value.name}}"
                class="{{value.classes}}">{{value.convertedName}}</span>
            </span>
          </span>
          ${showTagsInSmallModes && agileBoardController.cardDetailLevel < detailsLevelWithTags ? tagsTemplate : ''}
        </span>
      `)(scope);

    !scope.$$phase && scope.$digest();
    cardFooter.parentNode.insertBefore(compiledElement[0], cardFooter);
  }

  function tweakNewCards() {
    document.querySelectorAll(`yt-agile-card:not([${tweakAttribute}])`).forEach(processCardNode);
  }

  function revertCardNode(node) {
    ytTweaks.removeNodes(`.${tweakClass}`, node);
    node.removeAttribute(tweakAttribute);
  }

  function ready(data) {
    agileBoardNode = data.agileBoardNode;
    agileBoardController = data.agileBoardController;
    agileBoardEventSource = data.agileBoardEventSource;
    configs = data.configs;

    const css = require('./index.css');
    stopFns.push(ytTweaks.injectCSS(css));

    prependIssueID = configs.some(c => c.config.prependIssueId);
    showTagsInSmallModes = configs.some(c => c.config.showTagsInSmallModes);

    if (showTagsInSmallModes && agileBoardController.cardDetailLevel < detailsLevelWithTags) {
      const cardsDetailLevelUtils = ytTweaks.inject('cardsDetailLevelUtils');
      const boardModelUpdater = ytTweaks.inject('boardModelUpdater');
      const agileBoardLiveUpdater = ytTweaks.inject('agileBoardLiveUpdater');

      const fields = cardsDetailLevelUtils.getIssueFields(detailsLevelWithTags, agileBoardController.cardDetailLevel);
      boardModelUpdater.updateCardsFields(agileBoardController.boardColumnsInstance, agileBoardController.getSprint(), fields, {
        $topLinks: 3
      });
    }

    fieldsToShow = [];
    injects = ytTweaks.inject('$compile', '$timeout', '$rootScope', '$filter');

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

  let agileWaitCancel = () => {};

  function stop() {
    agileWaitCancel();
    stopFns.forEach(fn => fn());
    stopFns = [];
    document.querySelectorAll(`[${tweakAttribute}]`).forEach(revertCardNode);
  }

  function run() {
    stop();
    agileWaitCancel = board.agileWait(name, ready);
  }

  return {
    name,
    run,
    stop
  };
}