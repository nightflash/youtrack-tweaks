import Vue from 'vue'
import Component from 'vue-class-component'

@Component()
export default class extends Vue {
  addNewTweak () {
    this.$store.dispatch('addTweak', {
      name: 'new tweak111'
    })
  }

  updateTweak() {
    this.$store.commit('updateTweak', 0)
  }

  get tweaks () {
    return this.$store.state.tweaks
  }
}
