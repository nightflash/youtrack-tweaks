import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import TagsInputEdit from '@/components/editor/tags-input/edit.vue'
import TagsInputView from '@/components/editor/tags-input/view.vue'

import SortedListEdit from '@/components/editor/sorted-list/edit.vue'
import SortedListView from '@/components/editor/sorted-list/view.vue'

import TextEdit from '@/components/editor/text/edit.vue'
import TextView from '@/components/editor/text/view.vue'

import Toolbar from './toolbar.vue'
import ItemView from './view.vue'

import * as i18n from './i18n'

export const type = 'agile-board/desktop-notifications'

export const name = 'Agile board desktop notifications'

const tagsEditor = {
  edit: TagsInputEdit,
  view: TagsInputView,
  default: [],
  options: {}
}

const conditionsEditor = {
  simple: true,
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
  message: textEditor,
  ttl: {
    ...textEditor,
    default: '',
    options: {
      type: 'number'
    }
  },
  icon: {
    ...textEditor,
    options: {
      multiline: true
    }
  },
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
