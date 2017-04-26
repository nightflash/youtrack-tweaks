function tweak(name, extensionId) {
  const ytTweaks = window.ytTweaks;

  const tweakAttribute = `${ytTweaks.baseAttribute}-${name.replace('/', '-')}`;

  const fixesCss = `   
    .global_agile-board .app__footer.app__footer {
      margin-top: 0px;
      margin-bottom: 0px;
    }
  `;

  const darculaCss = `
    .global_agile-board .app__container {
      background-color: #2b2b2b;
    }
    
    .yt-bottom-toolbar {
      background-color: #2b2b2b;
      border-top: 1px solid black;
    }
  
    .yt-agile-table__row__cell {
      border-color: #2b2b2b;
      border-right: 1px solid #2b2b2b;
      border-left: 1px solid #2b2b2b;
    }
    
    .yt-agile-table .yt-agile-table__row {
      border-bottom: 1px solid #2b2b2b;
    }
    
    .yt-sticky-panel__container_pinned .yt-agile-table__row__cell_head:last-child {
      border: 1px solid #2b2b2b;  
    }
    
    .yt-agile-table {
      background-color: #3c3f41;
    }
    
    .yt-agile-board__toolbar__slider-wrapper, .yt-sticky-panel__container_pinned .yt-agile-board__toolbar__slider-wrapper {
      background: #3c3f41;
    }
    
    .yt-agile-table__row-container__head_sticky {
      background-color: #3c3f41;
    }
    
    .global .yt-agile-board {
      color: #e9e9e9;
    }
    
    .ring-island, .yt-agile-card {
      background-color: #313335;
      border: none;
    }
    
    .yt-agile-card.yt-agile-card_selected {
      background-color: #2b2b2b;
    }
    
    .global .yt-agile-table__row-title__summary, .global .yt-agile-table__row__cell, .yt-agile-card__summary, .yt-drag-agile-card__summary {
      color: #a9b7c6;
    }
    
    .global .yt-dark-grey-text, .yt-agile-board__grey-link, .yt-page__block .ring-link {
      color: #3f92b0;
    }
    
    .global .yt-dark-grey-text:hover {
      color: #49a8cb;
    }
    
    .global .yt-agile-table__row__estimation.yt-dark-grey-text {
      color:#888;
      background-color: #2b2b2b;
    }
    
    .yt-agile-table__row_orphan_white {
      background-color: #3c3f41;
    }
    
    .yt-agile-board.yt-page {
      background-color: #3c3f41;
      padding-top: 3px;
      border-bottom: 3px solid #2b2b2b;
    }
    
    .yt-sticky-panel__container {
      background-color: #3c3f41;
    }
    
    .yt-agile-board__toolbar__sprint {
      background-image: none;
      background-color: #2b2b2b;
      color: #a9b7c6;
      box-shadow:none;
    }
    
    .yt-page__block .ring-input, 
    .yt-page__block .ring-input-size_l {
      background-color: #2b2b2b;
      color: #a9b7c6;
      border: none;
      box-shadow:none;
    }
    
    .yt-page__block .ring-tag {
        background-color: #3c3f41;
        border:none;
    }
    
    .yt-page__block .yt-search-panel__input .ring-icon_gray {
      background-color: #2b2b2b;
      color: #a9b7c6;
    }
    
    .ring-button:not([disabled]):not(.ring-button_loader)[data-test="createActionsHeaderDropdown"],
    .yt-page__block .ring-button:not([disabled]):not(.ring-button_loader),
    .yt-page__block .ring-button.ring-button_active:not([disabled]):not(.ring-button_loader) {
      background-color: #3c3f41;
      background-image: none;
      color:#a9b7c6;
    }
    .yt-page__block .ring-button.ring-button_blue,
    .yt-page__block .ring-button.ring-button_blue:hover {
      background-color: #2b2b2b;
      background-image: none;
      background: none;
      box-shadow:none;
    }
    
    .yt-page__block .yt-column-settings .ring-table__header {
        background-color: #3c3f41;
    }
    
    .yt-page__block .ring-table__column {
      background-color: #3c3f41;
    }
    
    .yt-page__block .ring-tabs__btn {
      color:#a9b7c6;
    }
    
    .yt-agile-table__row {
      border-bottom: none
    }
    
    .ring-query-assist {
      background: none;
    }
    
    .yt-page__block  .ring-query-assist__letter, .global.background__gradient.global_agile-board {
        color: #a9b7c6;
    }
    
    .global .yt-issue-comment__text, .global .yt-issue-key-value-list__column_key, .global .command-dialog-container.command-dialog-container {
      color: #444;
    }
    
    .yt-agile-board__toolbar__time-left, .yt-agile-board__toolbar__time-left .yt-icon {
      color: #a9b7c6;
    }
    
    /* Header */
    
    .yt-header {
      background-color: #2b2b2b;
    }
    
    .yt-header .ring-link {
      color: #a9b7c6 !important;
    }
    
    .yt-header .ring-header__menu-item_active {
      text-decoration: underline;
    }
    
    /* Footer */    
    .global_agile-board .yt-footer {
      background-color: #2b2b2b;
    }
    
    .global_agile-board .yt-footer .ring-footer {
      color: #a9b7c6;
    }
    
    .global_agile-board .yt-footer .ring-footer a {
      color: #a9b7c6;
      text-decoration: underline;
    }
    
    /* Collapsed swimlanes */ 
    
    .yt-swimlane-column__collapsed-cards-holder:after, .yt-agile-table__row_orphan_white .yt-swimlane-column__collapsed-cards-holder:after {
      box-shadow: none;
    }
    
    /* Estimation */
    .yt-agile-table__row__estimation {
      background-color: #2b2b2b;
      color: #a9b7c6;
    }
    
    /* Selects */
    .ring-select-popup {
      background-color: #3c3f41;
    }
    
    .ring-list__item_action, .ring-select__button, .ring-select__message {
      color: #a9b7c6;
    }
    
    .ring-select-popup  .ring-input_filter-popup {
      background-color: #2b2b2b;
      color: #a9b7c6;
    }
  `;

  const hideHeaderCss = `
    .yt-sticky-panel__container.yt-sticky-panel__container_pinned.yt-agile-table__row-container__head_sticky, 
    .yt-sticky-panel__container.yt-sticky-panel__container_pinned.yt-agile-board__toolbar_sticky {
      visibility: hidden;
  `;

  const hideFooterCss = `
    yt-agile-bottom-toolbar {
      display:none;
    }
  `;

  let agileBoardController, configs, options, $timeout;

  let stopFns = [];

  function injectCSS(content) {
    const tag = document.createElement('style');
    tag.textContent = content;
    document.head.appendChild(tag);

    return () => document.head.removeChild(tag);
  }

  function onLineSwimlane() {
    if (!options.oneLineSwimlane) {
      return;
    }

    const reverts = [];

    document.querySelectorAll(`.yt-agile-table__row-title:not([${tweakAttribute}])`).forEach(titleNode => {
      const titleIdNode = titleNode.querySelector('.yt-agile-table__row-title__id');
      if (titleIdNode) {
        titleNode.setAttribute(tweakAttribute, true);

        const summaryNode = titleNode.querySelector('[data-test="yt-agile-board-swimlane__summary"]')
        const dragNode = titleIdNode.querySelector('[data-test="yt-agile-board-swimlane__drag-control"]');
        const issueIdNode = titleIdNode.querySelector('[data-test="yt-agile-board-swimlane__issue-id"]');

        if (dragNode) {
          titleIdNode.removeChild(dragNode);
          summaryNode.insertBefore(dragNode, summaryNode.childNodes[0]);
          reverts.push(() => {
            summaryNode.removeChild(dragNode);
            titleIdNode.appendChild(dragNode);
          });
        }

        if (issueIdNode) {
          titleIdNode.removeChild(issueIdNode);
          summaryNode.insertBefore(issueIdNode, summaryNode.querySelector('.yt-icon-action'));
          const editIcon = summaryNode.querySelector('.yt-icon-action .yt-icon');

          if (editIcon) {
            editIcon.style.top = '-3px';
            editIcon.style.left = '2px';
          }

          reverts.push(() => {
            summaryNode.removeChild(issueIdNode);
            titleIdNode.appendChild(issueIdNode);
            if (editIcon) {
              editIcon.style.top = '-1px';
              editIcon.style.left = '';
            }
          });
        }

        reverts.push(() => titleNode.removeAttribute(tweakAttribute));
      }
    });

    stopFns.push(() => reverts.forEach(fn => fn()));
  }

  function attachToBoardEvents() {
    const revertOnBoardSelect = ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', run);
    const revertOnSprintSelect = ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', run);
    const loadMoreSwimlanes = ytTweaks.mockMethod(agileBoardController, 'loadMoreSwimlanes', promise => promise.then(() => $timeout(onLineSwimlane)));

    stopFns.push(revertOnBoardSelect, revertOnSprintSelect, loadMoreSwimlanes);
  }

  function ready(data) {
    $timeout = ytTweaks.inject('$timeout');
    agileBoardController = data.agileBoardController;
    configs = data.configs;

    options = {};
    const listOfOptions = ['darculaMode', 'stickyHeader', 'stickyFooter', 'oneLineSwimlane'];

    listOfOptions.forEach(option => (options[option] = null));

    configs.forEach(config => {
      listOfOptions.forEach(option => (options[option] |= config.config[option]));
    });

    stopFns.push(injectCSS(fixesCss));

    options.darculaMode && stopFns.push(injectCSS(darculaCss));
    !options.stickyHeader && stopFns.push(injectCSS(hideHeaderCss));
    !options.stickyFooter && stopFns.push(injectCSS(hideFooterCss));
    onLineSwimlane();

    attachToBoardEvents();
  }

  function stop() {
    stopFns.forEach(fn => fn());
    stopFns = [];
  }

  function run() {
    stop();
    ytTweaks.agileWait(name, ready);
  }

  ytTweaks.registerTweak({
    name,
    run,
    stop
  });
}