import Vue from 'vue'
import Component from 'vue-class-component'

export const type = 'agile-board/card-fields'

@Component({
  props: {
    tweak: Object
  },
  template: '<div>View {{tweak.type}}</div>'
})
export class View extends Vue {

}

@Component({
  props: {
    tweak: Object
  },
  template: '<div>Edit {{tweak.type}} <input v-model="data.url"> <button @click="save()"></button></div>'
})
export class Edit extends Vue {
  data = {}

  save () {
    console.log(this.data)
  }

  mounted () {
    this.data = Vue.util.extend({}, this.tweak)
  }
}
