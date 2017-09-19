import board from '../board';

export default function tweak(name) {
  const ytTweaks = window.ytTweaks;

  let agileBoardController, configs, options, $timeout;

  let stopFns = [];

  function ready(data) {
    $timeout = ytTweaks.inject('$timeout');
    agileBoardController = data.agileBoardController;
    configs = data.configs;

    options = {};
    const listOfOptions = ['darculaMode', 'stickyHeader', 'stickyFooter'];

    listOfOptions.forEach(option => (options[option] = null));

    configs.forEach(config => {
      listOfOptions.forEach(option => (options[option] |= config.config[option]));
    });

    stopFns.push(ytTweaks.injectCSS(require('./fixes.css')));

    options.darculaMode && stopFns.push(ytTweaks.injectCSS(require('./darcula.css')));
    !options.stickyHeader && stopFns.push(ytTweaks.injectCSS(require('./header.css')));
    !options.stickyFooter && stopFns.push(ytTweaks.injectCSS(require('./footer.css')));
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