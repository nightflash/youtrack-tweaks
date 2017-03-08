export const SET_TWEAKS_MUT = 'setTweaks'
export const ADD_TWEAK_MUT = 'addTweak'
export const UPDATE_TWEAK_MUT = 'updateTweak'

export default {
  [SET_TWEAKS_MUT] (state, tweaks = []) {
    state.tweaks = tweaks
  },

  [ADD_TWEAK_MUT] (state, tweak) {
    state.tweaks.push(tweak)
  },

  [UPDATE_TWEAK_MUT] (state, tweakId, newData) {
    state.tweaks[tweakId] = newData
  }
}
