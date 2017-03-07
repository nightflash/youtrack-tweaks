import Vue from 'vue'
import Component from 'vue-class-component'

import store from '@/vuex/store'

@Component()
export default class extends Vue {
  mounted () {
    store.dispatch('reloadTweaks');
  }
}
