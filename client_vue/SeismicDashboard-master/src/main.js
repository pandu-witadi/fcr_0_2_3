// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'core-js/es6/promise'
import 'core-js/es6/string'
import 'core-js/es7/array'

require ("babel-polyfill");
import Vue from 'vue';
import App from './App';
import router from './_constant/_routers';
import store from "./_constant/_store";

import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import VueElementLoading from "MyLibVue/src/views/vue-element-loading";
Vue.component("vue-element-loading", VueElementLoading);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
});
