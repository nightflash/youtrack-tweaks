import Vue from 'vue'
import Component from 'vue-class-component'

import TweakMixin from '../../tweak-mixin'

export const type = 'agile-board/card-fields'

export const name = 'Agile Board Card Fields'

export const schema = {
  boardName: String,
  sprintName: String,
  sizeParams0: String,
  sizeParams1: String,
  sizeParams2: String,
  sizeParams3: String
}

@Component({
  props: {
    tweak: Object
  },
  template: require('./view.html')
})
export class View extends Vue {
  name = name
  type = type

}

@Component({
  props: {
    tweak: Object
  },
  mixins: [TweakMixin],
  template: require('./edit.html')
})
export class Edit extends Vue {
  name = name
  type = type
  schema = schema
}
