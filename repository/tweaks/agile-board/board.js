const fakeEventSource = {
  _started: false,
  _listeners: [],
  _currentEventSource: null,

  addEventListener(name, cb) {
    if (this._hasListener(name, cb) === false) {
      this._listeners.push({
        name,
        cb
      });
      this._currentEventSource && this._currentEventSource.addEventListener(name, cb);
    }
  },
  removeEventListener(name, cb) {
    const index = this._hasListener(name, cb);
    if (index) {
      this._listeners.splice(index, 1);
      this._currentEventSource && this._currentEventSource.removeEventListener(name, cb);
    }
  },
  _hasListener(name, cb) {
    return this._listeners.some((listener, index) => {
      if (listener.name === name && listener.cb === cb) {
        return index;
      } else {
        return false;
      }
    });
  },
  _rebind(newEventSource) {
    if (this._currentEventSource) {
      this._listeners.forEach(listener => {
        this._currentEventSource.removeEventListener(listener.name, listener.cb);
      });
    }

    this._currentEventSource = newEventSource;
    this._listeners.forEach(listener => {
      this._currentEventSource.addEventListener(listener.name, listener.cb);
    });
  },
  init() {
    if (this._started) {
      return;
    }
    this._started = true;

    setInterval(() => {
      const liveUpdater = ytTweaks.inject('agileBoardLiveUpdater');
      if (liveUpdater) {
        const eventSource = liveUpdater.getEventSource();
        if (eventSource && eventSource._nativeEventSource) {
          if (this._currentEventSource !== eventSource._nativeEventSource) {
            this._rebind(eventSource._nativeEventSource);
          }
        }
      }
    }, 1000);
  }
};

export default {
  agileWait(tweakName, successCb, errorCb) {
    const agileBoardSelector = '[data-test="agileBoard"]';
    let agileBoardNode, agileBoardController;

    const waitFn = () => {
      agileBoardNode = document.querySelector(agileBoardSelector);
      if (agileBoardNode) {
        agileBoardController = angular.element(agileBoardNode).controller();

        return agileBoardController && !agileBoardController.loading;
      }
    };

    const runFn = () => {
      fakeEventSource.init();
      const configs = ytTweaks.getConfigsForTweak(tweakName).filter(config => {
        return ytTweaks.inArray(config.config.sprintName, agileBoardController.sprint.name, true) &&
            ytTweaks.inArray(config.config.boardName, agileBoardController.agile.name, true);
      });

      if (!configs.length) {
        ytTweaks.log(tweakName, 'no suitable config, sorry');
      } else {
        successCb({
          agileBoardNode,
          agileBoardController,
          agileBoardEventSource: fakeEventSource,
          configs,
          alert: ytTweaks.inject('alert')
        })
      }
    };

    return ytTweaks.wait(waitFn, runFn, errorCb, `wait run() ${tweakName}`);
  },

  getFieldValuePresentation(value) {
    return value.name || value.fullName || value.login || value.presentation || value;
  },

  getIssueFieldValue(issue, fieldName, defaultValue = '') {
    for (let i = 0; i < issue.fields.length; i++) {
      const field = issue.fields[i];

      if (field.projectCustomField.field.name === fieldName) {
        return this.getFieldValuePresentation(field.value);
      }
    }

    return defaultValue;
  }
}