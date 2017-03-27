import Component from 'vue-class-component'
import EditorMixin from '../editor-mixin/edit-mixin'

@Component({
  props: {
    value: String
  }
})
export default class extends EditorMixin {
  get type () {
    return this.options.type ? this.options.type : 'text'
  }

  inputHandler (event) {
    this.$emit('input', event.target.value)
  }
}
