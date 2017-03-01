//获取当前的list
export const getNowTableData = function(state,getters,rootState){
    var nowShowList = state.nowShowList
    return nowShowList
}


//获取当前的employeeId
export const employeeDetail = function(state,getters,rooteState){
    var selectedEmployeeDetail = state.selectedEmployeeDetail || {};
    return state.selectedEmployeeDetail || {}
}


