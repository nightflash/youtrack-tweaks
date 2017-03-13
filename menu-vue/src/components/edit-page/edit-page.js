import Vue from 'vue'
import { Component, Inject, Model, Prop, Watch } from 'vue-property-decorator'


import TweakComponent from '../tweak/tweak.vue'

import {UPDATE_TWEAK} from '../../vuex/actions'

@Component({
  components: {
    'tweak': TweakComponent
  }
})
export default class extends Vue {
  url = ''

  get tweak() {
    const index = this.$route.params.index
    const tweak = this.$store.state.tweaks[index]

    if (tweak) {
      this.url = tweak.url
    }

    return tweak
  }

  save(config, navigateAfterSave) {
    this.$store.dispatch(UPDATE_TWEAK, {
      index: this.$store.state.tweaks.indexOf(this.tweak),
      url: this.url,
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
