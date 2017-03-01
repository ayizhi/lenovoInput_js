//ajax获取datatable数据
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource)

//获取整体的数据
export const getDataAndSaveIntoState = ({commit}) => {
    return new Promise(function(resolve){
        Vue.http.get('/insurance/tableList').then(function(reply){
            var data = reply.body.data
            commit('getDataAndSaveIntoState',{
                tableList: data
            })

            resolve(data)
        })
    })
}

//根据条件设置当前展示页的数据
export const setDataForNowShow = ({commit},condition) => {
    commit('setDataForNowShow',condition)
}


//选择当前员工后在vue中设置当前被选择的员工id
export const setSelectedEmployeeId = ({commit},employeeId) => {
    commit('setSelectedEmployeeId',employeeId)
}


//发送请求获取员工详情，并放入state中的selectedEmployeeDetail中取
export const getSelectedEmployeeDetail = ({commit}) => {
    commit('clearSelectedEmployeeDetail')
    return new Promise((resolve,reject) => {
        Vue.http.get('/insurance/employeeDetail').then(function(reply){
            var data = reply.body.data
            commit('setSelectedEmployeeDetail',{
                employeeDetail: data
            })
            resolve(data)
        })
    })
}

//input填写修改employeeDetail
export const updateDetailInput = ({commit},kv) => {
    commit('updateDetail',kv)
}