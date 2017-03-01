<template>
<li class="clearfix lenovo-search-li department lenovo-department-content" :class="{disabled: !ifDepartmentAble}">
    <span class="fl tit-head">{{firstName}}</span>
    <div class="fl tit-text" :title="name">
        <p :title="name" v-html="highlightDepartmentName"></p>
        <p :title="parentDepartmentNames">{{parentDepartmentNames}}</p>
    </div>
    <i class="icon icon-people" v-show="ifLittleMenIcon == 1" @click.stop="openEmployeeListOfThisDepartment" ></i>
</li>
</template>
<script>
export default {
    props: [
        'department',
        'ifLittleMenIcon',
        'ifDepartmentAble',
        'searchKeyword'
    ],
    data(){
        var t = this;
        var name = t.department.name;
        var firstName = name[0];
        var parentDepartmentNames = t.department.parentDepartmentNames ? t.department.parentDepartmentNames : '无父级部门...';
        var highlightDepartmentName = t.getHighlightName(t.searchKeyword,name)
        return {
            firstName,
            name,
            parentDepartmentNames,
            highlightDepartmentName
        }
    },
    methods: {
        //选择部门
        selectDepartmentLenovoLi(){
            var t = this;
            t.$emit('afterSelectLenovoLi','department',t.department.id,t.name)
        },
        
        //高亮名称 
        getHighlightName(keyword,name){
            var reg = new RegExp(keyword,'g');
            return name.replace(reg, "<span>" + keyword + "</span>")
        },

        //打开employeeList弹窗
        openEmployeeListOfThisDepartment(){
            var t = this;
            t.$emit('openEmployeeListOfThisDepartment',t.department.name,t.department.id,true);
        },
    }
    
}
    
</script>