//ajax获取datatable数据
export const getDataAndSaveIntoState = (state, param) => {
    state['tableList'] = param['tableList']
}

export const setDataForNowShow = (state,conditions) => {
    var pageNum = conditions.pageNum;
    var pageMaxAmount = conditions.pageMaxAmount || '10'
    var nowShowList = state['tableList'][pageNum]
    var index = pageMaxAmount * pageNum;
    for(var i = 0 , len = nowShowList.length ; i < len ; i++){
        var li = nowShowList[i];
        li['index'] = +index + 1 + +i;
    }
    state['nowShowList'] = nowShowList
}

//设置当前被选择的员工id
export const setSelectedEmployeeId = (state,employeeId) => {
    var employeeId = employeeId.employeeId;
    state.selectedEmployeeId = employeeId
}

//重置员工详情
export const clearSelectedEmployeeDetail = (state) => {
    state['selectedEmployeeDetail'] = {}    
}

//设置员工详情
export const setSelectedEmployeeDetail = (state,employeeDetail) => {
    var employeeDetail = employeeDetail.employeeDetail
    state['selectedEmployeeDetail'] = employeeDetail
}

//修改员工详情字段input
export const updateDetail = (state,kv) => {
    var key = kv.key;
    var val = kv.val;
    state.selectedEmployeeDetail[key] = val;
    console.log(state,'=-----')
}
