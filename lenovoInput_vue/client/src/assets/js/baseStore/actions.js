//ajax获取datatable数据
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource)

export const loadDepartmentList = ({commit}) => {
   Vue.http({
        method: 'post',
        url: '/company/department',
        params: {
            hasRoot: 0
        }
    }).then(function(reply){
        var departmentList = reply.data.data;
        commit('updateDepartmentList',departmentList)
    })
    Vue.http({
        method: 'post',
        url: '/company/department',
        params: {
            hasRoot: 1
        }
    }).then(function(reply){
        var departmentListRoot = reply.data.data;
        commit('updateDepartmentListRoot',departmentListRoot)
    })
}
