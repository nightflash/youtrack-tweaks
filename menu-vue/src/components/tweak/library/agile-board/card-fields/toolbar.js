import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    value: Object
  },
  template: `
<div>
  <select>
    <option v-for="option in conversionOptions" v-model="value.conversion">{{option}}</option>
  </select>
  Ignore color<input type="checkbox" ></input>
</div>
`
})
export default class extends Vue {
  conversionOptions = ['no', 'letter']

  mounted () {
    this.$watch('value.conversion', () => {
      console.log(this.value)
    })
  }
}
