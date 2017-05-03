import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin.vue'
import TweakViewMixin from '../../../mixins/tweak-view-mixin.vue'

import TextEdit from '@/components/editor/text/edit.vue'
import TextView from '@/components/editor/text/view.vue'

import ToggleEdit from '@/components/editor/toggle/edit.vue'

import genericScheme from '../generic/schema'

import * as i18n from './i18n'

export const type = 'agile-board/report'

export const editDescription = 'Press Cmd/Ctrl + C to copy the list of selected issues to the clipboard.'

export const name = 'Agile board super-copy hotkey'

const textEditor = {
  edit: TextEdit,
  view: TextView,
  simple: true,
  options: {}
}

const toggleEditor = {
  simple: true,
  edit: ToggleEdit,
  default: true,
  options: {}
}

export const schema = {
  ...genericScheme(name),
  groupByField: {
    ...textEditor,
    default: 'State'
  },
  messageFormat: {
    ...textEditor,
    default: '%id%: %group%; %summary%'
  },
  useForSingleIssue: toggleEditor,
  addNewlineAfterGroup: toggleEditor
}

@Component
export class View extends TweakViewMixin {
  i18n = i18n
}

@Component
export class Edit extends TweakEditMixin {
  i18n = i18n
}
