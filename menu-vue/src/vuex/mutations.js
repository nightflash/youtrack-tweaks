export default {
  setTweaks (state, tweaks = []) {
    state.tweaks = tweaks
  },

  addTweak (state, tweak) {
    state.tweaks.push(tweak)
  },

  updateTweak (state, tweakId, newData) {
    state.tweaks[tweakId] = newData
  }
}
