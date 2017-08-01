import Vue from 'vue'
import Component from 'vue-class-component'

import {SET_TWEAKS} from '../../vuex/actions'
import footer from '../footer/footer.vue'

@Component({
  components: {
    footerToolbar: footer
  }
})
export default class extends Vue {
  mounted () {
    this.watch = this.$store.watch(() => this.$store.state.tweaks, newTweaks => {
      this.tweaks = newTweaks.slice()

      this.configText = JSON.stringify(this.tweaks)
    }, {immediate: true})
  }

  save() {
    const tweaks = JSON.parse(this.configText)

    this.$store.dispatch(SET_TWEAKS, { tweaks })

    this.cancel()
  }

  cancel() {
    this.$router.push('/')
  }

  get configText() {
    return this.$refs.editTextarea.value
  }

  set configText(value) {
    this.$refs.editTextarea.value = value
  }
}
