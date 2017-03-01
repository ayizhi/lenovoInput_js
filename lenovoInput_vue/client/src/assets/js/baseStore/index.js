import Vue from 'vue';
import Vuex from 'vuex';
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export const moduleBase = {
    state: {
        departmentList: [],
        departmentListRoot: [],
    },
    mutations,
    actions,
    getters
}
