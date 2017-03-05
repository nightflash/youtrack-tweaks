import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const state = {
  tweaks: [
    {
      name: 'first tweak'
    },
    {
      name: 'second tweak'
    }
  ]
}

export default new Vuex.Store({
  state,
  mutations,
  actions
})
