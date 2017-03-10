import Vue from 'vue'
import Component from 'vue-class-component'

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
    tweak: Object,
    onSave: {
      type: Function
    }
  },
  template: require('./edit.html')
})
export class Edit extends Vue {
  url = ''
  name = name
  type = type

  config = {}

  save () {
    // prepare data for save

    this.onSave({
      url: this.url,
      config: this.config
    })
  }

  mounted () {
    this.url = this.tweak.url

    Object.keys(schema).forEach(fieldName => {
      this.config[fieldName] = (this.tweak.config && this.tweak.config[fieldName]) || ''
    })
  }
}
