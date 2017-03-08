import Vue from 'vue'
import Component from 'vue-class-component'

import {ADD_TWEAK, UPDATE_TWEAK, REMOVE_ALL_TWEAKS} from '../../vuex/actions'

@Component()
export default class extends Vue {
  addNewTweak () {
    this.$store.dispatch(ADD_TWEAK, {
      tweak: {
        name: 'new tweak111'
      }
    })
  }

  updateTweak() {
    this.$store.dispatch(UPDATE_TWEAK, {
      id: 0,
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
