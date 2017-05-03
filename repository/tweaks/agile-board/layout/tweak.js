import board from '../board';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  const tweakAttribute = `${ytTweaks.baseAttribute}-${name.replace('/', '-')}`;

  let agileBoardController, configs, options, $timeout;

  let stopFns = [];

  function onLineSwimlane() {
    if (!options.oneLineSwimlane) {
      return;
    }

    const reverts = [];

    document.querySelectorAll(`.yt-agile-table__row-title:not([${tweakAttribute}])`).forEach(titleNode => {
      const titleIdNode = titleNode.querySelector('.yt-agile-table__row-title__id');
      if (titleIdNode) {
        titleNode.setAttribute(tweakAttribute, true);

        const summaryNode = titleNode.querySelector('[data-test="yt-agile-board-swimlane__summary"]');
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
    stopFns.push(
        ytTweaks.mockMethod(agileBoardController, 'loadMoreSwimlanes', promise => promise.then(() => $timeout(onLineSwimlane)))
    );
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

    stopFns.push(ytTweaks.injectCSS(require('./fixes.css')));

    options.darculaMode && stopFns.push(ytTweaks.injectCSS(require('./darcula.css')));
    !options.stickyHeader && stopFns.push(ytTweaks.injectCSS(require('./header.css')));
    !options.stickyFooter && stopFns.push(ytTweaks.injectCSS(require('./footer.css')));
    onLineSwimlane();

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
  };
}