import Vue from 'vue'
import Component from 'vue-class-component'

import TagsInput from '../../editor/tags-input/tags-input.vue'

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
  template: require('./tweak-edit-mixin.html'),
  components: {
    'tags-input': TagsInput
  },
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
      this.config[key] = getDecoder(this.schema[key])(this.tweak.config[key])
    })

    this.$watch('config', () => {
      const updatedConfig = {}

      this.schemaKeys.forEach(key => {
        updatedConfig[key] = getEncoder(this.schema[key])(this.config[key])
      })

      this.changed(updatedConfig)
    }, {deep: true, immediate: true})
  }

  getConfig () {
    return this.config
  }

  getLabel (key) {
    return this.i18n && this.i18n.en[key].label
  }
}
