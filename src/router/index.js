import Vue from 'vue'
import Router from 'vue-router'


// DragToWorkplace
import Main from '@/views/main'
import Load from '@/views/loadChart'




Vue.use(Router)

export default new Router({
  routes: [
 
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/load',
      name: 'load',
      component: Load
    },
  
  ]
})
