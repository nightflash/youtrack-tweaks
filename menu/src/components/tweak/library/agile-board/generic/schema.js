import genericScheme from '../../generic/schema'

import TagsInputEdit from '@/components/editor/tags-input/edit.vue'
import TagsInputView from '@/components/editor/tags-input/view.vue'

const tagsEditor = {
  edit: TagsInputEdit,
  view: TagsInputView,
  default: [],
  options: {}
}

export default name => ({
  ...genericScheme(name),
  boardName: tagsEditor,
  sprintName: tagsEditor
})
