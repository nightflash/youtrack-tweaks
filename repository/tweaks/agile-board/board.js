export default {
  agileWait(tweakName, successCb, errorCb) {
    const agileBoardSelector = '[data-test="agileBoard"]';
    let agileBoardNode, agileBoardController, agileBoardEventSource;

    const waitFn = () => {
      agileBoardNode = document.querySelector(agileBoardSelector);
      if (agileBoardNode) {
        agileBoardController = angular.element(agileBoardNode).controller();
        agileBoardEventSource = ytTweaks.inject('agileBoardLiveUpdater').getEventSource();
        agileBoardEventSource = agileBoardEventSource && agileBoardEventSource._nativeEventSource;
        return agileBoardEventSource && agileBoardController && !agileBoardController.loading;
      }
    };

    const runFn = () => {
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
          agileBoardEventSource,
          configs
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