import Vue from 'vue'
import Component from 'vue-class-component'

import tweaks from '../tweaks/index'

@Component({
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    tweak: Object
  }
})
export default class extends Vue {
  get name () {
    return 'Type: ' + this.tweak.type
  }

  render(h) {
    if (tweaks.has(this.tweak.type)) {
      return h(tweaks.get(this.tweak.type)[this.edit ? 'Edit' : 'View'], {
        props: {
          tweak: this.tweak
        }
      })
    } else {
      return h('div', 'non registered tweak type')
    }
  }
}
