// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import VueRouter from 'vue-router'
import Detail from './component/Detail'
import AddOne from './component/AddOne'
import List from './component/List'
import store from './store/index'
import {LoadBaseParams} from 'assets/js/LoadBaseParams'
import 'assets/css/base.css'
import 'assets/icon/icon.css'


Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/insurance',
  routes: [
    {
      path: '/detail',
      component: Detail,
    },
    {
      path: '/index',
      component: List,
    },{
      path: '/.html',
      redirect: '/index'
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  router: router,
  store: store,
  created(){
    //加载所有基础参数
    LoadBaseParams(this.$store)
    
  },

}).$mount('#insurance')


