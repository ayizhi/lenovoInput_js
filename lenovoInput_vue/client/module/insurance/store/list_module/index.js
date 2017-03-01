import Vue from 'vue';
import Vuex from 'vuex';
import * as list_actions from './actions';
import * as list_getters from './getters';
import * as list_mutations from './mutations';

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'


export const moduleList = {
    state: {
        tableList: {},
        nowShowList: [],
        selectedEmployeeId: '',
        selectedEmployeeDetail: {},
    },
    mutations: list_mutations,
    getters: list_getters,
    actions: list_actions
}


