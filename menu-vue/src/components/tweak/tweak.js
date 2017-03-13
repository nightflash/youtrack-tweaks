import Vue from 'vue'
import Component from 'vue-class-component'

import tweaks from './library/index'

@Component({
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    tweak: {
      type: Object,
      required: true
    }
  }
})
export default class extends Vue {
  render(h) {
    if (tweaks.has(this.tweak.type)) {
      const TweakExports = tweaks.get(this.tweak.type);
      const TweakComponent = TweakExports[this.edit ? 'Edit' : 'View'];

      return (
          <TweakComponent tweak={this.tweak} schema={TweakExports.schema}>
            {this.$scopedSlots.default}
            {this.$slots.default}
          </TweakComponent>
      )
    } else {
      return (<div>non registered tweak type</div>)
    }
  }
}
