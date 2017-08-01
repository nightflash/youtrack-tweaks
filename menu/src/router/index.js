import Vue from 'vue'
import Router from 'vue-router'

import List from '../components/list-page/list.vue'
import EditPage from '../components/edit-page/edit-page.vue'
import ImportExportPage from '../components/import-export-page/import-export-page.vue'

Vue.use(Router)

export default new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/',
      name: 'list',
      component: List
    },
    {
      path: '/edit/:index',
      name: 'edit',
      component: EditPage
    },
    {
      path: '/import-export',
      name: 'importExport',
      component: ImportExportPage
    }
  ]
})
