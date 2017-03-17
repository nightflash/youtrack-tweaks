import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: Array,
    placeholder: {
      type: String,
      default: ''
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
