import Vue from 'vue'
import Component from 'vue-class-component'

import {ADD_TWEAK, UPDATE_TWEAK, REMOVE_ALL_TWEAKS, REMOVE_TWEAK} from '../../vuex/actions'

import tweaksLibrary from '../tweak/library/index'

@Component()
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

  edit(index) {
    this.$router.push(`/edit/${index}`)
  }

  remove(index) {
    this.$store.dispatch(REMOVE_TWEAK, {
      index
    })
  }

  get tweaks () {
    return this.$store.state.tweaks
  }

  getTweakExports(tweak) {
    return tweaksLibrary.get(tweak.type)
  }
}
