import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin.vue'
import TweakViewMixin from '../../../mixins/tweak-view-mixin.vue'

import ToggleEdit from '@/components/editor/toggle/edit.vue'

import * as i18n from './i18n'

export const type = 'agile-board/layout'

export const name = 'Agile board layout (Darcula & more) BETA'

export const editDescription = `This tweak is based on the Andrey Cheptsov gist https://gist.github.com/cheptsov/349041fe06f953f22aaff1ef41e0d266/revisions.  It is under deep BETA development.`

import genericScheme from '../generic/schema'

const toggleEditor = {
  simple: true,
  edit: ToggleEdit,
  default: true,
  options: {}
}

export const schema = {
  ...genericScheme(name),
  darculaMode: toggleEditor,
  stickyHeader: toggleEditor,
  oneLineSwimlane: toggleEditor,
  stickyFooter: {
    ...toggleEditor,
    default: false
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
