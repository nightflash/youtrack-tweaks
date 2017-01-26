(function () {
  const ytTweaks = window.ytTweaks = {
    injector: null,
    tweaksConfiguration: [],

    baseClass: 'yt-tweaks',
    baseAttribute: 'yt-tweaks',

    registeredTweaks: [],

    configure(config) {
      this.log('recieve configuration', config);
      this.tweaksConfiguration = config;
      this.stopTweaks();
      this.waitForAngularAndRun();
    },

    getTweakConfigs(name) {
      console.log(this.tweaksConfiguration);
      return this.tweaksConfiguration.filter(c => c.type === name);
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
      this.registeredTweaks.push(tweak);
    },
    
    runTweaks() {
      this.registeredTweaks.forEach(tweak => {
        this.log('running tweak', tweak.name);
        tweak.run();
      });
    },

    stopTweaks() {
      this.registeredTweaks.forEach(tweak => {
        if (tweak.stop) {
          this.log('stopping tweak', tweak.name);
          tweak.stop();
        }
      });
    },

    mockMethod(object, propertyName, mockFn) {
      const original = object[propertyName];
      object[propertyName] = (...args) => {
        original(...args);
        mockFn(...args);
      };

      return () => object[propertyName] = original;
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
    },

    waitForAngularAndRun() {
      this.wait(() => window.angular, angular => {
        this.injector = angular.element(document.body).injector();
        this.runTweaks();
      }, null, 'angular');
    },

    removeNodes(selector, element = document) {
      element.querySelectorAll(selector).forEach(node => {
        node.parentNode.removeChild(node);
      });
    },

    log(...args) {
      console.log('YouTrack Tweaks:', ...args);
    }
  };
})();