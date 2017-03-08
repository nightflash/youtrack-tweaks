import storage from '@/utils/storage'

export default {
  reloadTweaks ({commit}) {
    return storage.get('tweaks').then((tweaks = []) => {
      commit('setTweaks', tweaks)
    })
  },

  addTweak ({commit, state}, tweak) {
    commit('addTweak', tweak)
    return storage.set('tweaks', state.tweaks)
  },

  updateTweak ({commit, state}, tweakId, updatedTweak) {
    commit('updateTweak', tweakId, updatedTweak)
    return storage.set('tweaks', state.tweaks)
  }
}
