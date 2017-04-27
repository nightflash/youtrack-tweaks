import Vue from 'vue'
import Component from 'vue-class-component'
import draggable from 'vuedraggable'

import {ADD_TWEAK, SET_TWEAKS, TOGGLE_TWEAK} from '../../vuex/actions'

import tweaksLibrary from '../tweak/library/index'

@Component({
  components: {
    draggable
  }
})
export default class extends Vue {
  watch = null
  tweaks = []

  created () {
    this.watch = this.$store.watch(() => this.$store.state.tweaks, newTweaks => {
      this.tweaks = newTweaks.slice()
    }, {immediate: true})
  }

  destroyed () {
    this.watch()
  }

  get addOptions() {
    return Array.from(tweaksLibrary.entries()).map(entity => {
      return {
        type: entity[0],
        name: entity[1].name
      }
    })
  }

  dragEnd () {
    this.$store.dispatch(SET_TWEAKS, {
      tweaks: this.tweaks
    })
  }

  toggleTweak (index) {
    this.$store.dispatch(TOGGLE_TWEAK, {
      index
    })
  }

  addNewTweak (type = this.$refs.addSelect.value) {
    this.$refs.addSelect.value = ''

    const tweakExports = tweaksLibrary.get(type)
    const config = {}

    Object.keys(tweakExports.schema).forEach(schemaKey => {
      config[schemaKey] = tweakExports.schema[schemaKey].default
    })

    const newIndex = this.tweaks.length

    this.$store.dispatch(ADD_TWEAK, {
      type: type,
      disabled: false,
      config
    })

    this.edit(newIndex)
  }

  edit(index) {
    this.$router.push(`/edit/${index}`)
  }

  getTweakExports(tweak) {
    return tweaksLibrary.get(tweak.type)
  }
}
