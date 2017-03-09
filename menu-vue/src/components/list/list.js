import Vue from 'vue'
import Component from 'vue-class-component'

import {ADD_TWEAK, UPDATE_TWEAK, REMOVE_ALL_TWEAKS} from '../../vuex/actions'

import TweakViewComponent from '../tweak-view/tweak-view.vue'

@Component({
  components: {
    'tweak-view': TweakViewComponent
  }
})
export default class extends Vue {
  addNewTweak (type) {
    this.$store.dispatch(ADD_TWEAK, {
      type: type
    })
  }

  updateTweak() {
    this.$store.dispatch(UPDATE_TWEAK, {
      index: 0,
      tweak: {
        name: 'updated'
      }
    })
  }

  removeAllTweaks() {
    this.$store.dispatch(REMOVE_ALL_TWEAKS)
  }

  get tweaks () {
    return this.$store.state.tweaks
  }
}
