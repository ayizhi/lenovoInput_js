<template>
     <el-dialog :title="employeeListDialogTitle" size='large' v-model="openStatus" @close="closeThisDialog" @open="openThisDialog" >
        <div class="employee-list-content employee-of-department-list" >
            
            <div id="loadingList" v-show="employeeList.length == 0">
                <img :src="loadingGif" class="loadingImg" />    
                <img :src="loadingTextGif" class="loadingTxt" />
            </div>

            <div class="empty-list" v-show="noEmployee">
                <p class="remind-icon"><i class="icon-report"></i></p>
                <p class="remind-text">该部门无可选择员工</p>
            </div>

            <el-checkbox v-show="!singleSelect && !onlyForShow && employeeList.length != 0" v-model="toggleAll" @change="toggleSelectAll">备选项</el-checkbox>
            <ul class="employee-list" v-show="employeeList.length != 0" @scroll="handleScrollList($event)">
                <li v-for="(employee,index) in employeeList" class="fl" :class="{'direct-child': !employee.isSub,'active': employee.active}" @click="toggleStatusOfSelected(employee,index)">
                    <span class="t-head fl">{{employee.name.substr(0,1)}}</span>
                    <p class="fl"><span>{{employee.name}}{{employee.title && '-' + employee.title }}</span><span>{{employee.mobile}}</span></p>
                    <i class="icon-choice"></i>
                </li>
            </ul>
        </div>

      <div slot="footer" v-show="!onlyForShow" >
        <el-button type="primary" @click="confirm" >确认</el-button>
        <el-button @click="openStatus = false">取消</el>
      </div>
    </el-dialog>


</template>
<script>
import Vue from 'vue';
import VueResource from 'vue-resource';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
    
Vue.use(VueResource);
Vue.use(ElementUI)

    export default {
        props: [
            "employeeListDialogIsOpen",
            "employeeListDialogTitle",
            "employeeListDialogDepartmentId",
            "onlyForShow",
            "singleSelect",
        ],

        data(){
            var t = this;
            var openStatus = t.employeeListDialogIsOpen;
            return {
                employeeList: [],//员工列表
                openStatus,//开关状态
                pageNum: 1,
                pageSize: 50,
                noEmployee: false,//是否有员工
                getMoreController: true,//滚动加载更多控制器
                loadingGif: require('assets/img/loading.gif'),
                loadingTextGif: require('assets/img/loadingText.gif'),
                toggleAll: false,
            }
        },
        
        watch: {
            employeeListDialogIsOpen: function(val){
                var t = this;
                t.openStatus = val;
            }
        },
        methods: {
            //点击全选
            toggleSelectAll(){
                //所有!issub的active都为true
                var t = this;
                var employeeList = t.employeeList;
                var i,len = employeeList.length;
                var employee;           
                t.employeeList.map((employee) => {
                    if(!employee.isSub){
                        employee['active'] = t.toggleAll;
                    }
                })
            },

            //点击员工
            toggleStatusOfSelected(employee,index){
                var t = this;
                employee['active'] = !employee['active']
            },

            //滚动加载
            handleScrollList(e){
                var t = this;
                var target = e.target;
                var scrollTop = target.scrollTop;
                var liHeight = 74;
                var invisibleNum = parseInt(scrollTop / liHeight) + 1;
                var lineNum = t.employeeList.length / 5;

                if(lineNum  - invisibleNum <= 8){
                    if(!t.getMoreController){
                        return;
                    }
                    t.pageNum++
                    t.loadingEmployeeListOfDialog();
                }
            },


            //打开弹窗的回调
            openThisDialog(){
                var t = this;
                t.loadingEmployeeListOfDialog();          
            },

            //加载员工list
            loadingEmployeeListOfDialog(){
                var t = this;
                t.getMoreController = false;
                Vue.http({
                    method: 'post',
                    url: '/employee/ajax-get-department-employees',
                    params:{
                        departmentId: t.employeeListDialogDepartmentId,
                        pageNum: t.pageNum,
                        pageSize: t.pageSize,
                    }
                }).then(function(reply){
                    t.getMoreController = true;
                    var employeeList = reply.data.data.queryPageResult.data;
                    
                    //进行是否为空的判断
                    if(t.pageNum == 0 && employeeList.length == 0){
                        t.noEmployee = true;
                        return;
                    }

                    //进行重组加上active属性                    
                    employeeList.map((employee) => {
                        employee['active'] = false;
                        t.employeeList.push(employee)
                    })                    
                })
            },

            //点击关闭按钮，需要把上级open状态置为false
            closeThisDialog(){
                var t = this;
                t.$emit('closeEmployeeListDialog')
            },

            //点击提交传递给上级
            confirm(){
                var t = this;
                var selectedEmployeeList = [];
                var employeeList = t.employeeList;
                employeeList.map((employee) => {
                    if(employee.active){
                        selectedEmployeeList.push({
                            id: employee.id,
                            name: employee.name
                        })
                    }
                })

                t.$emit('afterSelectEmployee',selectedEmployeeList)
                t.openStatus = false;
            },
        },
    }
</script>

<style lang="scss">
.select-all-wrap {
    height: 30px;
    line-height: 30px;
    background: #fff;
    margin: -20px 0 0 10px;
    .select-all {
      margin-right: 5px;
    }
  }
  .empty-list-remind {
    width: 100%;
    text-align: center;
    margin: 50px auto;
    .icon-report {
      font-size: 50px;
    }
    .remind-text {
      margin-top: 10px;
    }
  }


.employee-list {
    max-height: 400px;
    overflow-y: scroll;
    li{
    height: 42px;
    margin: 10px;
    padding: 10px;
    width: 156px;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid transparent;
    .t-head{
        margin-right: 10px;
        width: 36px;
        height: 36px;
        border-radius: 50px;
        line-height: 36px;
        font-size: 18px;
        color: #fff;
        text-align: center;
        background-color: #EEEEEE;
    }
    p{
        line-height: 20px;
        span{
        width: 106px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
        }
        span:nth-of-type(1){
        color: #333;
        }
        span:nth-of-type(2){
        color: #999;
        }
    }
    &.no-direct-child{
        border: #eee solid 1px;
        .t-head{
        background: #d5d5d5!important;
        }
        p{
        span:nth-of-type(1){
            color: #999;
        }
        }
    }
    .icon-choice {
        position: absolute;
        top: 0px;
        right: 0px;
        font-size: 10px;
        color: #ffffff;
        font-weight: bold;
    }
    &.active {
        &:before {
        content: '';
        width: 0;
        height: 0;
        border-left: 20px solid transparent;
        position: absolute;
        top: 0;
        right: 0;
        }
    }
    }

    li.direct-child{
    border: #d5d5d5 solid 1px;
    }
}

.empty-list{
    margin: 100px auto 10px;
    text-align: center;
    .remind-icon {
    .icon-report {
        font-size: 50px;
    }
    }
    .remind-text {
    margin-top: 10px;
    }
}
</style>