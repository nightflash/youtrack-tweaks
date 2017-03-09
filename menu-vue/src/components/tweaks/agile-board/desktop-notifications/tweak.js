import Vue from 'vue'
import Component from 'vue-class-component'

export const type = 'agile-board/desktop-notifications'

@Component({
  props: {
    tweak: Object
  },
  template: '<div>{{tweak.type}}</div>'
})
export class View extends Vue {
}
