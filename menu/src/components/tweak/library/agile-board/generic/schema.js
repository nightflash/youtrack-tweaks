import TagsInputEdit from '@/components/editor/tags-input/edit.vue'
import TagsInputView from '@/components/editor/tags-input/view.vue'

import TextEdit from '@/components/editor/text/edit.vue'
import TextView from '@/components/editor/text/view.vue'

const tagsEditor = {
  edit: TagsInputEdit,
  view: TagsInputView,
  default: [],
  options: {}
}

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
  url: textEditor,
  boardName: tagsEditor,
  sprintName: tagsEditor
})
