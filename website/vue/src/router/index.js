import Vue from 'vue'
import Router from 'vue-router'
import Install from '@/components/Install'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Install',
      component: Install
    }
  ]
})
