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

  get index () {
    return this.$route.params.index
  }

  changed (newConfig) {
    this.config = newConfig
  }

  save(config, navigateAfterSave) {
    this.$store.dispatch(UPDATE_TWEAK, {
      index: this.$store.state.tweaks.indexOf(this.tweak),
      config
    })

    if (navigateAfterSave) {
      this.$router.push('/')
    }
  }

  cancel() {
    this.$router.push('/')
  }

  remove(index) {
    this.$store.dispatch(REMOVE_TWEAK, {
      index
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
