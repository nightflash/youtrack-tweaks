import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  props: {
    left: Object,
    center: Object,
    right: Object
  }
})
export default class extends Vue {
}
