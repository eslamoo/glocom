import Vue from 'vue'
import Router from 'vue-router'


// DragToWorkplace
import DragToWorkplace from '@/views/DragToWorkplace'



Vue.use(Router)

export default new Router({
  routes: [
 
    {
      path: '/',
      name: 'DragToWorkplace',
      component: DragToWorkplace
    },
    
  ]
})
