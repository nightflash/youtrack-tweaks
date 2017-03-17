import Vue from 'vue'
import Component from 'vue-class-component'
import EditorMixin from '../editor-mixin'

import Sortable from 'sortablejs'

Vue.directive('sortable', {
  inserted: function (el, binding) {
    new Sortable(el, binding.value || {})
  }
})

@Component()
export default class extends EditorMixin {
  newItem = {label: '', ...(this.options.item || {})}

  clear () {
    this.newItem = {label: '', ...(this.options.item || {})}
  }

  getItemRef (index) {
    return `item${index}`
  }

  add () {
    if (this.newItem.label.trim()) {
      this.value.push(this.newItem)
      this.emitUpdate()
      this.clear()
    }
  }

  remove (index) {
    this.value.splice(index, 1)
    this.emitUpdate()
  }
}
