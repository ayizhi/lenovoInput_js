import Vue from 'vue';
import Vuex from 'vuex';
import {moduleList} from './list_module/index'
import {moduleBase} from 'assets/js/baseStore/index';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const Store = new Vuex.Store({
    strict: debug,
    state: {
        tryData: '55555'
    },
    modules:{
        List: moduleList,
        Base: moduleBase
    },
})


export default Store