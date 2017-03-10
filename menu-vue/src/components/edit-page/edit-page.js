import Vue from 'vue'
import Component from 'vue-class-component'

import TweakComponent from '../tweak/tweak.vue'

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
}
