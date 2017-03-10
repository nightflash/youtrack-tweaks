import Vue from 'vue'
import Component from 'vue-class-component'

import {ADD_TWEAK, UPDATE_TWEAK} from '../../vuex/actions'

import tweaks from '../tweaks/index'

@Component({
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    onSave: {
      type: Function,
      default: () => {}
    },
    tweak: {
      type: Object,
      required: true
    }
  }
})
export default class extends Vue {
  get name () {
    return 'Type: ' + this.tweak.type
  }

  save({url, config}) {
    this.$store.dispatch(UPDATE_TWEAK, {
      index: this.$store.state.tweaks.indexOf(this.tweak),
      url,
      config
    })

    this.onSave()
  }

  render(h) {
    if (tweaks.has(this.tweak.type)) {
      const TweakExports = tweaks.get(this.tweak.type);
      const TweakComponent = TweakExports[this.edit ? 'Edit' : 'View'];

      return (
          <div>
            <div>{TweakExports.name}</div>
            <TweakComponent tweak={this.tweak} onSave={this.save}>
              {this.$slots.default}
            </TweakComponent>
          </div>
      )
    } else {
      return (<div>non registered tweak type</div>)
    }
  }
}
