import Component from 'vue-class-component'
import EditorMixin from '../editor-mixin/edit-mixin'

@Component({
  props: {
    value: String
  }
})
export default class extends EditorMixin {
  inputHandler (event) {
    this.$emit('input', event.target.value)
  }
}
