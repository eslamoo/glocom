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
import 'jsplumb/css/jsplumbtoolkit-defaults.css';

// html2canvas
import html2canvas from 'html2canvas';



Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
