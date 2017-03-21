import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import TagsInput from '@/components/editor/tags-input/tags-input.vue'
import SortedList from '@/components/editor/sorted-list/sorted-list.vue'

import Toolbar from './toolbar.vue'
import ItemView from './view.vue'

import * as i18n from './i18n'

export const type = 'agile-board/desktop-notifications'

export const name = 'Agile Board Desktop Notifications'

const tagsEditor = {
  component: TagsInput,
  default: [],
  options: {}
}

const conditionsEditor = {
  component: SortedList,
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

export const schema = {
  boardName: tagsEditor,
  sprintName: tagsEditor,
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
