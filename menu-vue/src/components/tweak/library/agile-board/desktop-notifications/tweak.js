import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import TagsInputEdit from '@/components/editor/tags-input/edit.vue'
import SortedListEdit from '@/components/editor/sorted-list/edit.vue'

import TagsInputView from '@/components/editor/tags-input/view.vue'
import SortedListView from '@/components/editor/sorted-list/view.vue'

import Toolbar from './toolbar.vue'
import ItemView from './view.vue'

import * as i18n from './i18n'

export const type = 'agile-board/desktop-notifications'

export const name = 'Agile Board Desktop Notifications'

const tagsEditor = {
  edit: TagsInputEdit,
  view: TagsInputView,
  default: [],
  options: {}
}

const conditionsEditor = {
  edit: SortedListEdit,
  view: SortedListView,
  default: [],
  options: {
    toolbar: Toolbar,
    view: ItemView,
    item: {
      fieldName: '',
      fieldValue: '',
      mode: 'contains'
    },
    check: item => item.fieldName.trim() !== '' && item.fieldValue.trim() !== '',
    sortable: true
  }
}

const toggleEditor = {
  default: true,
  options: {}
}

export const schema = {
  boardName: tagsEditor,
  sprintName: tagsEditor,
  comparingMode: toggleEditor,
  conditions: conditionsEditor
}

@Component
export class View extends TweakViewMixin {
  i18n = i18n
}

@Component
export class Edit extends TweakEditMixin {
  i18n = i18n
}
