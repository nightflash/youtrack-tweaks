import Vue from 'vue'
import Component from 'vue-class-component'

import tweaksLibrary from '../tweak/library/index'

import {UPDATE_TWEAK, REMOVE_TWEAK} from '../../vuex/actions'

@Component()
export default class extends Vue {
  url = ''
  config = {}
  expertView = false

  get tweak() {
    const index = this.$route.params.index
    return this.$store.state.tweaks[index]
  }

  get tweakExports() {
    return this.tweak && tweaksLibrary.get(this.tweak.type)
  }

  changed (newConfig) {
    this.config = newConfig
  }

  save(config) {
    this.$store.dispatch(UPDATE_TWEAK, {
      index: this.$store.state.tweaks.indexOf(this.tweak),
      config
    })
  }

  cancel() {
    this.$router.push('/')
  }

  remove(index) {
    this.$store.dispatch(REMOVE_TWEAK, {
      index: this.$route.params.index
    })

    this.cancel()
  }

  get simpleView () {
    return !this.expertView
  }

  toggleViewMode () {
    this.expertView = !this.expertView
  }
}
