import Vue from 'vue'

export const SET_TWEAKS_MUT = 'setTweaks'
export const ADD_TWEAK_MUT = 'addTweak'
export const UPDATE_TWEAK_MUT = 'updateTweak'
export const REMOVE_TWEAK_MUT = 'removeTweak'
export const REMOVE_ALL_TWEAKS_MUT = 'removeAllTweaks'

export default {
  [SET_TWEAKS_MUT] (state, {tweaks = []}) {
    state.tweaks = tweaks
  },

  [ADD_TWEAK_MUT] (state, {tweak}) {
    state.tweaks.push(tweak)
  },

  [UPDATE_TWEAK_MUT] (state, {index, tweak}) {
    Vue.set(state.tweaks, index, tweak)
  },

  [REMOVE_TWEAK_MUT] (state, {index}) {
    state.tweaks.splice(index, 1)
  },

  [REMOVE_ALL_TWEAKS_MUT] (state) {
    state.tweaks = []
  }
}
