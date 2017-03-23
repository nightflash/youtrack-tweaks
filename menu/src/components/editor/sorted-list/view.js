import Component from 'vue-class-component'

import EditorMixin from '../editor-mixin/edit-mixin'

@Component({
  props: {
    value: Array
  }
})
export default class extends EditorMixin {
  get items() {
    return this.value;
  }
}
