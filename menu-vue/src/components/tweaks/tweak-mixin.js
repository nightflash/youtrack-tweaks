import Vue from 'vue'
import Component from 'vue-class-component'

@Component()
export default class extends Vue {
  url = ''
  config = {}

  save (navigateToList) {
    this.saveHandler({
      url: this.url,
      config: this.config
    })

    navigateToList && this.$router.push('/')
  }

  mounted () {
    this.url = this.tweak.url

    Object.keys(this.schema).forEach(fieldName => {
      this.config[fieldName] = (this.tweak.config && this.tweak.config[fieldName]) || ''
    })
  }
}
