import Vue from 'vue'
import Component from 'vue-class-component'

import tweaksLibrary from '../tweak/library/index'

import {UPDATE_TWEAK} from '../../vuex/actions'

@Component()
export default class extends Vue {
  url = ''
  config = {}

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

  save(url, config, navigateAfterSave) {
    this.$store.dispatch(UPDATE_TWEAK, {
      index: this.$store.state.tweaks.indexOf(this.tweak),
      url,
      config
    })

    if (navigateAfterSave) {
      this.$router.push('/')
    }
  }

  cancel() {
    this.$router.push('/')
  }
}
