import Vue from 'vue'
import Component from 'vue-class-component'

import TweakComponent from '../tweak/tweak.vue'

import {UPDATE_TWEAK} from '../../vuex/actions'

@Component({
  components: {
    'tweak': TweakComponent
  }
})
export default class extends Vue {
  get tweak() {
    const index = this.$route.params.index;
    return this.$store.state.tweaks[index];
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

  saveHandler() {
    console.log('save handler');
  }
}
