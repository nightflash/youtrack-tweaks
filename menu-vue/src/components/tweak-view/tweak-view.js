import Vue from 'vue'
import Component from 'vue-class-component'

import desktopNotificationsView from '../tweaks/agile-board/desktop-notifications/view.vue'
import cardFieldsView from '../tweaks/agile-board/card-fields/view.vue'

console.log(desktopNotificationsView)

@Component({
  props: [
      'tweak'
  ]
})
export default class extends Vue {
  get name () {
    return 'Type: ' + this.tweak.type
  }

  render(h) {
    if (this.tweak.type === 'agile-board/desktop-notifications') {
      return h(desktopNotificationsView);
    } else {
      return h('div', 'non registered tweak type');
    }
  }
}
