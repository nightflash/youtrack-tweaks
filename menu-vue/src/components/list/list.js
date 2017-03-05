import Vue from 'vue'
import Component from 'vue-class-component'

import store from '@/vuex/store'

@Component()
export default class extends Vue {
  addNewTweak () {
      store.commit('addTweak', {
        name: 'new tweak111'
      })
  }

  updateTweak() {
    store.commit('updateTweak', 0)
  }

  get tweaks () {
    return store.state.tweaks
  }
}
