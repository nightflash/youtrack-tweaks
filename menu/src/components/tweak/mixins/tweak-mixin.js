import Vue from 'vue'
import Component from 'vue-class-component'

function parseSchemaItem (schemaItem) {
  if (schemaItem === String) {
    return {
      type: 'string',
      default: ''
    }
  } else if (schemaItem instanceof Object) {
    return {
      type: 'custom',
      ...schemaItem
    }
  }
}

function getDecoder (schemaItem) {
  return schemaItem.decoder || (from => from)
}

function getEncoder (schemaItem) {
  return schemaItem.encoder || (to => to)
}

@Component({
  props: {
    tweak: {
      type: Object,
      required: true
    },
    schema: Object,
    changed: Function
  }
})
export default class extends Vue {
  constructor () {
    super()

    this.config = {}
    this.info = {}

    this.schemaKeys = Object.keys(this.schema)

    this.schemaKeys.forEach(key => {
      const schemaItem = parseSchemaItem(this.schema[key])
      this.info[key] = schemaItem
      this.config[key] = schemaItem.default
    })
  }

  beforeMount () {
    this.schemaKeys.forEach(key => {
      if (this.tweak.config[key] !== undefined) {
        this.config[key] = getDecoder(this.schema[key])(this.tweak.config[key])
      }
    })

    this.changed && this.$watch('config', () => {
      const updatedConfig = {}

      this.schemaKeys.forEach(key => {
        updatedConfig[key] = getEncoder(this.schema[key])(this.config[key])
      })

      this.changed(updatedConfig)
    }, {deep: true, immediate: true})
  }

  getI18n (key) {
    return this.i18n['en'][key]
  }

  checkDependency (key) {
    const dep = this.schema[key].depends
    if (!dep) {
      return true
    } else {
      return dep(this.config)
    }
  }
}
