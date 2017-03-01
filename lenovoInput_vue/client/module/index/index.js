// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from 'components/Index'
import Note from './Note'
import Home from './Home'
import Try from './Try'



Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: '/index',
  routes: [
    {
      path: '/home',
      name: 'Home',
      component: Index,
      alias: '/'
    },
    {
      path: '/note',
      name: 'Note',
      component: Note
    },
    {
      path: '/try',
      component: Try
      
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  router: router,
  template: '<Home/>',
  components: { Home }
}).$mount('#index')
