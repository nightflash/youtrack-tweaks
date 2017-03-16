import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  template: require('./tweak-view-mixin.html'),
  props: {
    tweak: {
      type: Object,
      required: true
    },
    schema: Object
  }
})
export default class extends Vue {
  constructor () {
    super()

    this.config = {}
    this.schemaKeys = Object.keys(this.schema)

    this.schemaKeys.forEach(key => {
      this.config[key] = ''
    })
  }

  mounted () {
    this.schemaKeys.forEach(key => {
      this.config[key] = this.tweak.config[key]
    })
  }

  getLabel (key) {
    return this.i18n && this.i18n.en[key].label
  }
}