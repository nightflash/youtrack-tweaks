function tweak(name, extensionId) {
  const ytTweaks = window.ytTweaks;

  const css = `
    .global_agile-board .app__container {
      background-color: #394c55;
    }
  
    .yt-agile-table__row__cell {
      border-color: #232e34;
      border-right: 1px solid #232e34;
      border-left: 1px solid #232e34;
    }
    
    .yt-agile-table .yt-agile-table__row {
      border-bottom: 1px solid #232e34;
    }
    
    .yt-sticky-panel__container_pinned .yt-agile-table__row__cell_head:last-child {
      border: 1px solid #232e34;  
    }
    
    .yt-agile-table {
      background-color: #394c55;
    }
    
    .yt-agile-board__toolbar__slider-wrapper, .yt-sticky-panel__container_pinned .yt-agile-board__toolbar__slider-wrapper {
      background: #394c55;
    }
    
    .yt-agile-table__row-container__head_sticky {
      background-color: #394c55;
    }
    
    .global .yt-agile-board {
      color: #fff;
    }
    
    .ring-island, .yt-agile-card {
      color: #fff;
      background-color: #232e34;
      border: none;
    }
    
    .yt-agile-card.yt-agile-card_selected {
      background-color: #355559;
    }
    
    .global .yt-agile-table__row-title__summary, .global .yt-agile-table__row__cell, .yt-agile-card__summary, .yt-drag-agile-card__summary {
      color: #fff;
    }
    
    .global .yt-dark-grey-text {
      color: #25b7ff;
    }
    
    .yt-agile-board__grey-link {
      color: #25b7ff;
    }
    
    .global .yt-agile-table__row__estimation.yt-dark-grey-text {
      color:#888;
      background-color: #232e34;
    }
    
    .yt-agile-table__row_orphan_white {
      background-color: #394c55;
    }
    
    yt-agile-bottom-toolbar {
      display:none;
    }
    
    .yt-agile-board.yt-page {
      background-color: #394c55;
      padding-top: 3px;
      border-bottom: 3px solid #232e34;
    }
    
    .yt-sticky-panel__container {
      background-color: #394c55;
    }
    
    .yt-agile-board__toolbar__sprint {
      background-image: none;
      background-color: #232e34;
      color: #fff;
      box-shadow:none;
    }
    
    .yt-page__block .ring-input, 
    .yt-page__block .ring-input-size_l {
      background-color: #232e34;
      color: #fff;
      border: none;
      box-shadow:none;
    }
    
    .yt-page__block .ring-tag {
        background-color: #394c55;
        border:none;
    }
    
    .yt-page__block .yt-search-panel__input .ring-icon_gray {
      background-color: #232e34;
      color: #fff;
    }
    
    .yt-page__block .ring-button:not([disabled]):not(.ring-button_loader),
    .yt-page__block .ring-button.ring-button_active:not([disabled]):not(.ring-button_loader) {
      background-color: #232e34;
      background-image: none;
      color:#fff;
    }
    .yt-page__block .ring-button.ring-button_blue,
    .yt-page__block .ring-button.ring-button_blue:hover {
      background-color: #232e34;
      background-image: none;
      background: none;
      box-shadow:none;
    }
    
    .yt-page__block .yt-column-settings .ring-table__header {
        background-color: #394c55;
    }
    
    .yt-page__block .ring-table__column {
      background-color: #394c55;
    }
    
    .yt-page__block .ring-link {
      color: #25b7ff;
    }
    
    .yt-page__block .ring-tabs__btn {
      color:#fff;
    }
    
    .yt-agile-table__row {
      border-bottom: none
    }
    
    .ring-query-assist {
      background: none;
    }
    
    .yt-page__block  .ring-query-assist__letter, .global.background__gradient.global_agile-board {
        color: white;
    }
    
    /*
    .yt-sticky-panel__container.yt-sticky-panel__container_pinned.yt-agile-table__row-container__head_sticky, 
    .yt-sticky-panel__container.yt-sticky-panel__container_pinned.yt-agile-board__toolbar_sticky {
      visibility: hidden;
    }*/
    
    .global .yt-issue-comment__text, .global .yt-issue-key-value-list__column_key, .global .command-dialog-container.command-dialog-container {
      color: #444;
    }
    
    .yt-agile-board__toolbar__time-left, .yt-agile-board__toolbar__time-left .yt-icon {
      color: #ddd;
    }
    
    /* Header */
    
    .yt-header {
      background-color: #232E34;
    }
    
    .yt-header .ring-link {
      color: #ddd !important;
    }
    
    .yt-header .ring-header__menu-item_active {
      text-decoration: underline;
    }
    
    /* Footer */
   
    .global_agile-board .app__footer.app__footer {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    
    .global_agile-board .yt-footer {
      background-color: #232e34;
    }
    
    .global_agile-board .yt-footer .ring-footer {
      color: #ddd;
    }
    
    .global_agile-board .yt-footer .ring-footer a {
      color: #ddd;
      text-decoration: underline;
    }
    
    /* Collapsed swimlanes */ 
    
    .yt-swimlane-column__collapsed-cards-holder:after, .yt-agile-table__row_orphan_white .yt-swimlane-column__collapsed-cards-holder:after {
      box-shadow: none;
    }
  `;

  const agileBoardSelector = '[data-test="agileBoard"]';

  let injects;
  let agileBoardNode, agileBoardController, agileBoardEventSource;

  let activeConfigs = [];
  let stopFns = [];

  function injectCSS(content) {
    const tag = document.createElement('style');
    tag.textContent = content;
    document.head.appendChild(tag);

    return () => document.head.removeChild(tag);
  }

  function attachToBoardEvents() {
    const revertOnBoardSelect = ytTweaks.mockMethod(agileBoardController, 'onBoardSelect', run);
    const revertOnSprintSelect = ytTweaks.mockMethod(agileBoardController, 'onSprintSelect', run);

    stopFns.push(revertOnBoardSelect, revertOnSprintSelect);
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
    activeConfigs = [];

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
      activeConfigs.push(config.config);
    });

    stopFns.push(injectCSS(css));

    attachToBoardEvents();
  }

  function stop() {
    stopFns.forEach(fn => fn());
    stopFns = [];
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