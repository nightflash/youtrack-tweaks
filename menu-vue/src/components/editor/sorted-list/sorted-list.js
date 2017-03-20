import Vue from 'vue'
import Component from 'vue-class-component'
import EditorMixin from '../editor-mixin'

import Sortable from 'sortablejs'

Vue.directive('sortable', {
  inserted: function (el, binding) {
    if (binding.value) {
      new Sortable(el, binding.value instanceof Object ? binding.value : {})
    }
  }
})

@Component({
  props: {
    value: Array
  }
})export default class extends EditorMixin {
  newItem = {...(this.options.item || {})}

  clear () {
    this.newItem = {...(this.options.item || {})}
  }

  getItemRef (index) {
    return `item${index}`
  }

  add () {
    if (this.newItem.label.trim()) {
      this.value.push(this.newItem)
      this.$emit('input', this.value)
      this.clear()
    }
  }

  remove (index) {
    this.value.splice(index, 1)
    this.$emit('input', this.value)
  }
}
