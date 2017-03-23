import Component from 'vue-class-component'

import EditorMixin from '../editor-mixin/edit-mixin'

@Component({
  props: {
    value: Boolean
  }
})
export default class extends EditorMixin {
  get left () {
    return this.options.left !== undefined ? this.options.left : true
  }

  get right () {
    return this.options.right !== undefined ? this.options.right : false
  }
}
