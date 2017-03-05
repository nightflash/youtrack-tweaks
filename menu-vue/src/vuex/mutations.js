export default {
  addTweak (state, tweak) {
    state.tweaks.push(tweak)
  },

  updateTweak (state, tweakId, newName = 'new name') {
    state.tweaks[tweakId].name = newName
  }
}
