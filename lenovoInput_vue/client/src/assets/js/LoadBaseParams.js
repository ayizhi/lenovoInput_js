
//loading department(both noroot and root)
const loadDepartmentStructure = ($store) => {
    $store.dispatch('loadDepartmentList')
}



const LoadBaseParams = ($store) => {
    loadDepartmentStructure($store);
}
    
export {
    LoadBaseParams
}

