// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// axios
import axios from 'axios'
Vue.prototype.$axios = axios;
import 'bootstrap';
import 'jquery';
import 'popper.js'
import 'bootstrap/dist/css/bootstrap.min.css';

// style
import './style/index.scss';
import './style/jsplumb-demo.scss';
// jsplumb
import 'jsplumb/dist/js/jsplumb.min.js';
// import '@/js/jsplumb.js';

import 'jsplumb/css/jsplumbtoolkit-defaults.css';
import SlideOut from '@hyjiacan/vue-slideout'
import '@hyjiacan/vue-slideout/lib/slideout.css'

// import SlideOut component, and set the defaults props
Vue.use(SlideOut, {
  // set props here
})  
// html2canvas
import html2canvas from 'html2canvas';

import { v4 as uuidv4 } from 'uuid';
Vue.use(uuidv4);


import Notifications from 'vue-notification'
Vue.use(Notifications)
import VueSlideoutPanel from 'vue2-slideout-panel';
// import * as VueSlideoutPanel  from 'vue2-slideout-panel/dist/vue-slideout-panel';
Vue.use(VueSlideoutPanel);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
