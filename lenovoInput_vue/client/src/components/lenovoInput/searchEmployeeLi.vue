<template>
    <li class="clearfix lenovo-search-li employee" @click="selectEmployeeLenovoLi">
        <span class="fl tit-head">{{firstName}}</span>
        <div class="fl tit-text">
            <p :title="name" v-html="employeeNameSpace"></p>
            <p :title="parentDepartmentNames">{{parentDepartmentNames}}</p>
        </div>
    </li>
</template>
<script>
    export default {
        props: [
            "employee",
            "searchKeyword"
        ],
        data(){
            var t = this;
            var name = t.employee.name;
            var mobile = t.employee.mobile;
            var firstName = name[0];
            var highlightEmployeeName = t.getHighlightName(t.searchKeyword,name);
            var highlightMobile = t.getHighlightName(t.searchKeyword,mobile);
            var title = t.employee.title ? '- ' + t.employee.title : '';
            var parentDepartmentNames = t.employee.parentDepartmentNames ? t.employee.parentDepartmentNames : '待分配...'
            var employeeNameSpace = highlightEmployeeName + title + '-' + highlightMobile
            return {
                parentDepartmentNames,
                firstName,
                name,
                employeeNameSpace
            }
        },
        methods: {
            //选择员工
            selectEmployeeLenovoLi(){
                var t = this;
                t.$emit('afterSelectLenovoLi','employee',t.employee.employeeId,t.name)
            },

            //高亮名称
            getHighlightName(keyword,name){
                var reg = new RegExp(keyword,'g');
                return name.replace(reg, "<span>" + keyword + "</span>")
            }
        }
    }
    
</script>