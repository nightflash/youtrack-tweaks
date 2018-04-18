import cardsTweak from './agile-board/card-fields/tweak';
import notificationsTweak from './agile-board/desktop-notifications/tweak';
import layoutTweak from './agile-board/layout/tweak';
import reportTweak from './agile-board/report/tweak';
import issueScreen from './issue-screen/general/tweak';

const LOG_KEY = 'ytTweaks.log';

const ytTweaks = window.ytTweaks = {
  injector: null,
  userTweaksConfiguration: [],

  baseClass: 'yt-tweaks',
  baseAttribute: 'yt-tweaks',

  initialized: false,
  registeredTweaks: new Map(),
  running: false,
  extensionId: null,

  mainWaitCancel: () => {},

  init() {
    // process browser back/forward buttons
    window.addEventListener('popstate', () => this.runTweaks(true));

    // process angular routes
    this.inject('$rootScope').$on('$routeChangeSuccess', () => this.runTweaks(true));

    this.registerTweak(cardsTweak('agile-board/card-fields'));
    this.registerTweak(notificationsTweak('agile-board/desktop-notifications'));
    this.registerTweak(layoutTweak('agile-board/layout'));
    this.registerTweak(reportTweak('agile-board/report'));
    this.registerTweak(issueScreen('issue-screen/general'));
  },

  configure(config = []) {
    this.log('recieve configuration', config, this.registeredTweaks.size);
    this.userTweaksConfiguration = config;


    this.waitForAngularAndRun();
  },

  getConfigsForTweak(name) {
    return this.userTweaksConfiguration.filter(c => (c.type === name && !c.disabled));
  },

  inject(...args) {
    const result = {};
    let lastDI;
    args.forEach(di => {
      lastDI = result[di] = this.injector.get(di);
    });

    return args.length === 1 ? lastDI : result;
  },

  registerTweak(tweak) {
    this.registeredTweaks.set(tweak.name, tweak);
  },

  runTweaks(forceRerun = false) {
    this.log('runTweaks', forceRerun);

    this.registeredTweaks.forEach(tweak => {
      this.log('running tweak', tweak.name);

      const currentConfigs = JSON.stringify(this.getConfigsForTweak(tweak.name));
      if (forceRerun || tweak.lastConfig !== currentConfigs) {
        tweak.lastConfig = currentConfigs;
        tweak.run();
      }
    });
  },

  mockMethod(object, propertyName, mockFn, returnOriginal = true) {
    if (!object[propertyName].ytTweaks) {
      const original = object[propertyName];

      object[propertyName] = function (...args) {
        const originalResult = original(...args);
        const results = object[propertyName].ytTweaks.fns.map(f => f(originalResult, ...args));
        return returnOriginal ? originalResult : results.pop();
      };

      object[propertyName].ytTweaks = {
        original,
        fns: []
      };
    }

    object[propertyName].ytTweaks.fns.push(mockFn);

    return () => {
      const fns = object[propertyName].ytTweaks.fns;
      const index = fns.indexOf(mockFn);
      fns.splice(index, 1);

      if (fns.length === 0) {
        object[propertyName] = object[propertyName].ytTweaks.original;
      }
    }
  },

  waitNum: 0,
  wait(waitFn, successFn, errorFn, name = this.waitNum++) {
    this.log('wait created', name);

    const interval = window.setInterval(() => {
      this.log('wait iteration', name);
      const result = waitFn();

      if (result) {
        this.log('wait successfully finished', name);
        window.clearInterval(interval);
        successFn(result);
      } else {
        errorFn && errorFn();
      }
    }, 500);

    return () => window.clearInterval(interval);
  },

  waitForAngularAndRun() {
    this.mainWaitCancel();
    this.mainWaitCancel = this.wait(() => window.angular, angular => {
      this.injector = angular.element(document.body).injector();
      if (this.injector) {
        if (!this.initialized) {
          this.init();
          this.initialized = true;
        }

        this.runTweaks();
      } else {
        ytTweaks.error('injector unreachable')
      }
    }, null, 'angular');
  },

  removeNodes(selector, element = document) {
    element.querySelectorAll(selector).forEach(node => {
      node.parentNode.removeChild(node);
    });
  },

  inArray(arr, str, emptyArrayAsTrue = false) {
    return (arr.indexOf(str) !== -1) || (emptyArrayAsTrue && arr.length === 0);
  },

  isLogEnabled() {
    return window.localStorage && window.localStorage.getItem(LOG_KEY);
  },

  toggleLog() {
    if (window.localStorage) {
      if (this.isLogEnabled()) {
        window.localStorage.removeItem(LOG_KEY);
        return "disabled";
      } else {
        window.localStorage.setItem(LOG_KEY, 1);
        return "enabled";
      }
    }
  },

  log(...args) {
    this.isLogEnabled() && console.log('YouTrack Tweaks:', ...args);
  },

  error(...args) {
    this.isLogEnabled() && console.error('YouTrack Tweaks:', ...args);
  },

  storage(type) {
    return {
      set: (itemKey, itemData) => window[`${type}Storage`].setItem(itemKey, JSON.stringify(itemData)),
      get: itemKey => JSON.parse(window[`${type}Storage`].getItem(itemKey)),
      removeItem: itemKey => window[`${type}Storage`].removeItem(itemKey)
    };
  },

  injectCSS(content) {
    const tag = document.createElement('style');
    tag.textContent = content;
    document.head.appendChild(tag);

    return () => document.head.removeChild(tag);
  }
};
