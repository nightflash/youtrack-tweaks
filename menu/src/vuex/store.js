import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'

import actions from './actions'

import bus from '@/utils/bus'
import storage from '@/utils/storage'

Vue.use(Vuex)

const syncStoreToBgScriptPlugin = store => {
  store.subscribe(({payload = {}}, state) => {
    if (!payload.doNotSync) {
      storage.set('tweaks', state.tweaks).then(() => bus.send({
        tweaks: state.tweaks
      }))
    }
  })
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    tweaks: []
  },
  mutations,
  actions,
  plugins: [syncStoreToBgScriptPlugin]
})
