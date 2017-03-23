import TweakMixin from './tweak-mixin'
import Component from 'vue-class-component'

@Component({
  template: require('./tweak-view-mixin.html')
})
export default class extends TweakMixin {}
