import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin.vue'
import TweakViewMixin from '../../../mixins/tweak-view-mixin.vue'

import TagsInputEdit from '@/components/editor/tags-input/edit.vue'
import TagsInputView from '@/components/editor/tags-input/view.vue'

import TextEdit from '@/components/editor/text/edit.vue'
import TextView from '@/components/editor/text/view.vue'

import * as i18n from './i18n'

export const type = 'agile-board/layout'

export const name = 'Agile board layout (Darcula & more) BETA'

export const editDescription = `This tweaks is based on the Andrey Cheptsov gist https://gist.github.com/cheptsov/349041fe06f953f22aaff1ef41e0d266/revisions. 
This tweak has no specific controls yet. It is under deep BETA development.`

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

export const schema = {
  title: {
    ...textEditor,
    default: name
  },
  url: textEditor,
  boardName: tagsEditor,
  sprintName: tagsEditor
}

@Component
export class View extends TweakViewMixin {
  i18n = i18n
}

@Component
export class Edit extends TweakEditMixin {
  i18n = i18n
}
