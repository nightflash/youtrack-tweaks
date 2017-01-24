(function () {
  const ytTweaks = window.ytTweaks = {
    injector: null,

    tweakGroups: {
      'agile-board': []
    },

    registerTweak(tweak) {
      this.tweakGroups[tweak.group].push(tweak);
    },
    
    runTweaks() {
      Object.keys(this.tweakGroups).forEach(groupName => {
        const groupTweaks = this.tweakGroups[groupName];

        groupTweaks.forEach(tweak => {
          if (tweak.wait) {
            this.log('wait to run tweak', tweak.name);
            tweak.wait(() => {
              this.log('wait finished, running tweak', tweak.name);
              tweak.run();
            });
          } else {
            this.log('no wait, running tweak', tweak.name);
            tweak.run();
          }
        });
      });
    },

    waitForAngularAndRun() {
      this.log('running');
      
      const interval = window.setInterval(() => {
        this.log('waiting for angular');
        
        if (window.angular) {
          this.log('angular ready');
          
          window.clearInterval(interval);
          this.injector = angular.element(document.body).injector();

          this.runTweaks();
        }
      }, 500);
    },

    log(...args) {
      console.log('YouTrack Tweaks:', ...args);
    }
  };

  ytTweaks.waitForAngularAndRun();
})();