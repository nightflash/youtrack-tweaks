import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import TagsInput from '@/components/editor/tags-input/tags-input.vue'
import SortedList from '@/components/editor/sorted-list/sorted-list.vue'
import Toggle from '@/components/editor/toggle/toggle.vue'

import Toolbar from './toolbar.vue'
import ItemView from './view.vue'

import * as i18n from './i18n'

export const type = 'agile-board/card-fields'

export const name = 'Agile Board Card Fields'

const tagsEditor = {
  component: TagsInput,
  default: [],
  options: {}
}

const fieldsEditor = {
  component: SortedList,
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
  component: Toggle,
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
