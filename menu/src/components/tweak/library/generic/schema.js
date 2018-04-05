import TextEdit from '@/components/editor/text/edit.vue'
import TextView from '@/components/editor/text/view.vue'

const textEditor = {
  edit: TextEdit,
  view: TextView,
  default: '',
  options: {}
}

export default name => ({
  title: {
    ...textEditor,
    default: name
  },
  url: textEditor
})
