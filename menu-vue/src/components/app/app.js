import Vue from 'vue'
import Component from 'vue-class-component'

import {RELOAD_TWEAKS} from '@/vuex/actions'

@Component()
export default class extends Vue {
  mounted () {
    this.$store.dispatch(RELOAD_TWEAKS);
  }
}
