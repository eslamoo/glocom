import Vue from 'vue'
import Router from 'vue-router'


// DragToWorkplace
import Main from '@/views/main'
import Try from '@/views/try'


import Load from '@/views/loadChart'
import Save from '@/views/saveChart'


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
    {
      path: '/save',
      name: 'save',
      component: Save
    }, 
     {
      path: '/try',
      name: 'try',
      component: Try
    },
  
  ]
})
