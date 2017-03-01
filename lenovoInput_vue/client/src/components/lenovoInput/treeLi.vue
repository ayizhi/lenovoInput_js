<template>
    <li class="lenovo-department-li" :class="{'disabled': !isAuth , 'no-child': !children.length , 'root': ifRoot} "  @click.stop="afterSelectLenovoLi">
        <p class="clearfix lenovo-department-content" :title="node.name">
            <span class="fl" :class="{disabled: !isAuth}">
                <i v-if="ifRoot" class="icon-framework"></i>
                <i v-if="!ifRoot && children.length" class='fl icon' :class="{'icon-add4': !showChildren, 'icon-subtracter':showChildren}" @click.stop="toggleChildrenVisible($event)"></i>
                <i v-if="!children.length" class='line'></i>
                {{node.name}}       
            </span>
            <i v-if="ifLittleMenIcon == 1 && node.isAuth == 1" class='icon icon-people' @click.stop="openEmployeeListOfThisDepartment"></i>
        </p>
        <ul v-if="node.children.length" :class="{'before': !ifHasBefore , 'display-none': !showChildren}">
            <tree-li v-for="(item,index) in children" :index="index" :paLength="children.length" :hasRoot="hasRoot" :ifDepartmentAble="ifDepartmentAble" :ifLittleMenIcon="ifLittleMenIcon" :node="item" @afterSelectLenovoLi="afterSelectLenovoLi" @openEmployeeListOfThisDepartment="openEmployeeListOfThisDepartment"></tree-li>
        </ul>
    </li>
</template>
<script>


    
    export default {
        name: 'treeLi',
        props: [
            "node",
            "ifDepartmentAble",
            "ifLittleMenIcon",
            "hasRoot",
            "index",
            "paLength"
        ],

        data(){
            var t = this;
            var children = t.node.children;            
            var isAuth = t.node.isAuth && t.ifDepartmentAble        
            var ifRoot = t.hasRoot && t.node.isRoot
            var ifHasBefore = (t.index == t.paLength - 1)

            return {
                children,
                ifRoot,
                isAuth,
                ifHasBefore,
                showChildren: false,
            }
        },
        
        computed: {
        },
        methods: {
            //选择lenovoli
            afterSelectLenovoLi(type,id,name){
                var t = this;
                if(type && id && name){
                    t.$emit('afterSelectLenovoLi',type,id,name)
                    return
                }
                t.$emit('afterSelectLenovoLi','department',t.node.id,t.node.name);
            },

            //打开employeeList弹窗
            openEmployeeListOfThisDepartment(departmentName,departmentId,dialogStatus){
                var t = this;
                if(departmentName && departmentId && (dialogStatus != undefined)){
                    t.$emit('openEmployeeListOfThisDepartment',departmentName,departmentId,dialogStatus);
                    return 
                }
                t.$emit('openEmployeeListOfThisDepartment',t.node.name,t.node.id,true);
            },

            //子部门的显示与因此（加号减号）
            toggleChildrenVisible(e){
                this.showChildren = !this.showChildren;
                return false;
            }
        }
    }
</script>