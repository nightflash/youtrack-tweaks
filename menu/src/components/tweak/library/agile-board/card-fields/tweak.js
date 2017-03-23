import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import TagsInputEdit from '@/components/editor/tags-input/edit.vue'
import SortedListEdit from '@/components/editor/sorted-list/edit.vue'
import ToggleEdit from '@/components/editor/toggle/edit.vue'

import TagsInputView from '@/components/editor/tags-input/view.vue'
import SortedListView from '@/components/editor/sorted-list/view.vue'

import Toolbar from './toolbar.vue'
import ItemView from './view.vue'

import * as i18n from './i18n'

export const type = 'agile-board/card-fields'

export const name = 'Agile Board Card Fields'

const tagsEditor = {
  edit: TagsInputEdit,
  view: TagsInputView,
  default: [],
  options: {}
}

const fieldsEditor = {
  edit: SortedListEdit,
  view: SortedListView,
  depends: config => !config.singleMode,
  default: [],
  options: {
    toolbar: Toolbar,
    view: ItemView,
    item: {
      name: '',
      conversion: 'no',
      ignoreColors: false
    },
    check: item => item.name.trim() !== '',
    sortable: true
  }
}

const toggleEditor = {
  edit: ToggleEdit,
  default: true,
  options: {}
}

export const schema = {
  boardName: tagsEditor,
  sprintName: tagsEditor,
  singleMode: toggleEditor,
  sizeParams0: fieldsEditor,
  sizeParams1: fieldsEditor,
  sizeParams2: fieldsEditor,
  sizeParams3: fieldsEditor,
  sizeParams: {
    ...fieldsEditor,
    depends: config => config.singleMode
  }
}

@Component
export class View extends TweakViewMixin {
  i18n = i18n
}

@Component
export class Edit extends TweakEditMixin {
  i18n = i18n
}
