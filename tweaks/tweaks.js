(function () {
  const ytTweaks = window.ytTweaks = {
    injector: null,
    tweaksConfiguration: [],

    tweakGroups: {
      'agile-board': []
    },

    configure(config) {
      this.log('recieve configuration', config);
      this.tweaksConfiguration = config;
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
      this.tweakGroups[tweak.group].push(tweak);
    },
    
    runTweaks() {
      Object.keys(this.tweakGroups).forEach(groupName => {
        const groupTweaks = this.tweakGroups[groupName];

        groupTweaks.forEach(tweak => {
          if (tweak.wait) {
            tweak.wait(() => this.runTweak(tweak));
          } else {
            this.runTweak(tweak)
          }
        });
      });
    },

    runTweak(tweak) {
      this.log('running tweak', tweak.name);
      tweak.run();
    },

    mockMethod(object, propertyName, mockFn) {
      const original = object[propertyName];
      object[propertyName] = (...args) => {
        original(...args);
        mockFn(...args);
      };
    },

    wait(waitFn, successFn, errorFn) {
      this.log('wait created');

      const interval = window.setInterval(() => {
        this.log('wait iteration');
        const result = waitFn();

        if (result) {
          this.log('wait successfully finished');
          window.clearInterval(interval);
          successFn(result);
        } else {
          errorFn && errorFn();
        }
      }, 500);
    },

    waitForAngularAndRun() {
      this.log('waiting for angular');

      this.wait(() => window.angular, angular => {
        this.log('angular ready');

        this.injector = angular.element(document.body).injector();
        this.runTweaks();
      });
    },

    log(...args) {
      console.log('YouTrack Tweaks:', ...args);
    }
  };

  ytTweaks.waitForAngularAndRun();
})();