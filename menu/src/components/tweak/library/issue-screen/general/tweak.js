import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin.vue'
import TweakViewMixin from '../../../mixins/tweak-view-mixin.vue'

import TextEdit from '@/components/editor/text/edit.vue'
import TextView from '@/components/editor/text/view.vue'

import * as i18n from './i18n'

export const type = 'issue-screen/general'

export const name = 'Issue screen'

import genericScheme from '../../generic/schema'

const textEditor = {
  edit: TextEdit,
  view: TextView,
  simple: true,
  options: {}
}

export const schema = {
  ...genericScheme(name),
  tabTitle: {
    ...textEditor,
    default: '%id%: %summary%'
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
