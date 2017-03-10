import Vue from 'vue'
import Component from 'vue-class-component'

import {ADD_TWEAK, UPDATE_TWEAK, REMOVE_ALL_TWEAKS} from '../../vuex/actions'

import TweakComponent from '../tweak/tweak.vue'

@Component({
  components: {
    'tweak': TweakComponent
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

  saveHandler() {
    console.log('list save handler');
  }

  get tweaks () {
    return this.$store.state.tweaks
  }
}
