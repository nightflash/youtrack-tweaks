import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import TagsInput from '@/components/editor/tags-input/tags-input.vue'
import SortedList from '@/components/editor/sorted-list/sorted-list.vue'

import Toolbar from './toolbar'

import * as i18n from './i18n'

export const type = 'agile-board/card-fields'

export const name = 'Agile Board Card Fields'

const simpleDecoder = (string = '') => string.split(',').filter(s => s)
const simpleEncoder = (arr = []) => arr.join(',')

const fieldsDecoder = (string = '') => string.split(',').filter(s => s).map(i => {
  const itemData = i.split(';')
  return {
    label: itemData[0],
    conversion: itemData.length > 1 ? itemData[1] : 'no',
    ignoreColors: itemData.length > 2 ? !!itemData[2] : false
  }
})
const fieldsEncoder = (arr = []) => arr.map(i => {
  return `${i.label};${i.conversion}${i.ignoreColors ? ';yes' : ''}`
}).join(',')

const tagsEditor = {
  component: TagsInput,
  default: [],
  options: {},
  decoder: simpleDecoder,
  encoder: simpleEncoder
}

const fieldsEditor = {
  component: SortedList,
  default: [],
  options: {
    addLabel: 'Add',
    toolbar: Toolbar,
    item: {
      label: '',
      conversion: 'no',
      ignoreColors: false
    }
  },
  decoder: fieldsDecoder,
  encoder: fieldsEncoder
}

export const schema = {
  boardName: tagsEditor,
  sprintName: tagsEditor,
  sizeParams0: fieldsEditor,
  sizeParams1: fieldsEditor,
  sizeParams2: fieldsEditor,
  sizeParams3: fieldsEditor
}

@Component
export class View extends TweakViewMixin {
  i18n = i18n
}

@Component
export class Edit extends TweakEditMixin {
  i18n = i18n
}
