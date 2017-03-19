import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: Array,
    i18n: {
      type: Object,
      default: {}
    },
    options: {
      type: Object,
      default: {}
    }
  }
})
export default class extends Vue {
  emitUpdate () {
    this.$emit('input', this.value)
  }
}
