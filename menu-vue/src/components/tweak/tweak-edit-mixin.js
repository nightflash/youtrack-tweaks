import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    tweak: {
      type: Object,
      required: true
    },
    schema: Object
  }
})
export default class extends Vue {
  constructor (...args) {
    super()

    Object.keys(this.schema).forEach(key => {
      this[key] = ''
    })
  }

  mounted () {
    Object.keys(this.schema).forEach(key => {
      this[key] = this.tweak.config[key]
    })
  }

  getConfig () {
    const config = {}

    Object.keys(this.schema).forEach(key => {
      config[key] = this[key]
    })

    return config
  }
}
