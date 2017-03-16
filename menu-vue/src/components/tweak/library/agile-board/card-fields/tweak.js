import Component from 'vue-class-component'

import TweakEditMixin from '../../../mixins/tweak-edit-mixin'
import TweakViewMixin from '../../../mixins/tweak-view-mixin'

import * as i18n from './i18n'

export const type = 'agile-board/card-fields'

export const name = 'Agile Board Card Fields'

export const schema = {
  boardName: {
    type: [String],
    decoder: string => string.split(','),
    encoder: arr => arr.join(',')
  },
  sprintName: String,
  sizeParams0: String,
  sizeParams1: String,
  sizeParams2: String,
  sizeParams3: String
}

@Component
export class View extends TweakViewMixin {
  i18n = i18n
}

@Component
export class Edit extends TweakEditMixin {
  i18n = i18n
}
