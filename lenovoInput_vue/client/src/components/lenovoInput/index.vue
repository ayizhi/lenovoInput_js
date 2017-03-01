<template>
  <div class="lenovo-body"  @click="lenovoVisible=true">
    <div class="lenovo-mask" @click.stop="lenovoVisible=false" v-if="lenovoVisible"></div>
    <slot name="fire-lenovo"></slot>
    <div class="lenovo-box" :class="{'display-none': !lenovoVisible }">
      <i class="icon icon-search"></i>
      <i class="icon icon-close" @click="closeSearchInput"></i>
      <input class="lenovo-input" :placeholder="placeholder" type="text" @input="searchInputing($event)" v-model="searchKeyword">
      <div class="tree-list" :class="{'display-none': isSearching}" >
        <ul>
          <tree-li 
          v-for="(node,index) in departmentList" :index="index" 
          :paLength="departmentList.length" :hasRoot="hasRoot" 
          :ifDepartmentAble="ifDepartmentAble" :ifLittleMenIcon="ifLittleMenIcon" 
          :node="node" 
          @afterSelectLenovoLi="afterSelectLenovoLi" 
          @openEmployeeListOfThisDepartment="openEmployeeListOfThisDepartment"></tree-li>
        </ul>
      </div>


      <ul class="lenovo-list" :class="{'display-none': !isSearching}">
        <li><em v-show="searchEmployeeList.length == 0 && searchDepartmentList.length == 0" class="clearfix">暂无部门...</em></li>
        <employee-li 
        v-for="employee in searchEmployeeList" 
        :employee="employee" :searchKeyword="searchKeyword" 
        @afterSelectLenovoLi="afterSelectLenovoLi" 
        ></employee-li>

        <department-li 
        v-for="department in searchDepartmentList" 
        :department="department" :ifLittleMenIcon="ifLittleMenIcon" 
        :ifDepartmentAble="ifDepartmentAble" 
        :searchKeyword="searchKeyword" 
        @afterSelectLenovoLi="afterSelectLenovoLi"
        @openEmployeeListOfThisDepartment="openEmployeeListOfThisDepartment"
        ></department-li>
      </ul>
    </div>
     <employeeList-dialog 
      :employeeListDialogIsOpen="employeeListDialogIsOpen" 
      :employeeListDialogTitle="employeeListDialogTitle" 
      :employeeListDialogDepartmentId="employeeListDialogDepartmentId" 
      :onlyForShow="false"
      :singleSelect="singleSelect"
      @closeEmployeeListDialog="closeEmployeeListDialog"
      @afterSelectEmployee="afterSelectEmployee"
      ></employeeList-dialog>
  </div>
  


</template>

<script>
import treeLi from './treeLi';
import employeeLi from './searchEmployeeLi';
import departmentLi from './searchDepartmentLi';
import employeeListDialog from './employeeListDialog';
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);



export default {
  props:[
    "lenovoType",//联想输入种类 employee department all
    "departmentRoot",//是否含有跟部门
    "singleSelect",//是否单选
  ],
  mounted: function () {
    this.$nextTick(function () {
      // 代码保证 this.$el 在 document 中
      console.log(this.$el)
    })
  },
  
  data(){
    //需要针对lenovoType来判定属性：ifDepartmentAble，ifLittleMenIcon，departmentRoot，singleSelect
    //还需要针对其定义的属性
    var ifDepartmentAble,ifLittleMenIcon,placeholder,hasRoot,ifSingleSelect,searchType;
    switch (this.lenovoType){
      case 'employee':
        ifDepartmentAble = 0;
        ifLittleMenIcon = 1;
        placeholder = '请输入部门名称／员工的姓名或手机号';        
        hasRoot = this.departmentRoot || 0;
        ifSingleSelect = this.singleSelect || 0;
        searchType = 1;
        break
      case 'department':
        ifDepartmentAble = 1;
        ifLittleMenIcon = 0;
        placeholder = "请输入部门名称"                
        hasRoot = this.departmentRoot || 0;
        ifSingleSelect = this.singleSelect || 0;
        searchType = 2;
        break
      case 'all':
        ifDepartmentAble = 1;
        ifLittleMenIcon = 1;
        placeholder = '请输入部门名称／员工的姓名或手机号';
        hasRoot = this.departmentRoot || 1;
        ifSingleSelect = this.singleSelect || 0;
        searchType = 3        
        break;
    }

    return {
      placeholder,
      ifDepartmentAble,//是否部门可选
      ifLittleMenIcon, //是否有小人图标（是否小人可选）
      hasRoot, //是否为跟节点0/1
      ifSingleSelect,//是否单选0/1
      searchType,//搜索类型，1:只搜员工，2：只搜部门，3：部门和员工
      excludeEmployeeIds: [],//搜索到的员工
      excludeDepartmentIds: [],//搜索到的部门
      searchEmployeeList: [],//搜索到的员工
      searchDepartmentList: [],//搜索到的部门
      keyUpSpacetime: 0,//监测搜索频率的参数
      isSearching: false,//是否正在搜索
      searchAjaxController: true,//是否能搜索
      searchKeyword: '',//搜索关键词

      employeeListDialogIsOpen: false,//员工列表弹窗是否打开
      employeeListDialogTitle: '',//员工列表弹窗的title
      employeeListDialogDepartmentId: '',//员工列表弹窗针对的部门id

      lenovoVisible: false,//控制显示隐藏
    }
  },

  computed: {
    //获取部门列表传给子组件
    departmentList(){  
      var t = this;
      var departmentList;

      if(t.hasRoot == 1){//需求需要把root节点放到与其它平级
        var departmentListRoot =  JSON.parse(JSON.stringify(this.$store.state.Base.departmentListRoot[0]))
        var fixDepartmentList = departmentListRoot.children.splice(0);
        departmentListRoot.children = [];
        departmentListRoot.isRoot = 1;
        fixDepartmentList.unshift(departmentListRoot);
        departmentList = fixDepartmentList
      }else{
        departmentList = this.$store.state.Base.departmentList
      }
      return departmentList
    }
  },

  methods: {
    //点击选择lenovo－li
    afterSelectLenovoLi(type,id,name){
      var t = this;
      t.$emit('afterSelectLenovoLi',type,id,name)
    },

    //点击选择employeeList 
    openEmployeeListOfThisDepartment(departmentName,departmentId,dialogStatus){
      var t = this;
      if(departmentName && departmentId && (dialogStatus != undefined)){
        t.employeeListDialogIsOpen = dialogStatus;
        t.employeeListDialogDepartmentId = departmentId;
        t.employeeListDialogTitle = departmentName.indexOf('的员工') == -1 ? departmentName + '的员工' : departmentName
      };
    },

    //得到选择员工的结果
    afterSelectEmployee(employeeList){
      var t = this;
      t.$emit('afterSelectEmployee',employeeList)
    },

    //点击关闭employeeList弹窗回调
    closeEmployeeListDialog(){
      var t = this;
      t.employeeListDialogIsOpen = false;
    },

    //清空搜索
    closeSearchInput(){
      var t = this;
      t.searchKeyword = '';
      t.isSearching = false;
      t.searchAjaxController = false;
    },

    //搜索输入中
    searchInputing(e){
      var t = this;
      t.searchKeyword = e.target.value;

      //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
      t.searchAjaxController = true; 
   
      //如果结果为空,渲染部门列表
      if(t.searchKeyword == ''){
          //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
          t.searchAjaxController = false;
          t.isSearching = false;
          t.searchKeyword = ''
          return;
      }

      t.isSearching = true;
      
      //延时200ms
      t.timerDelay(100,function(){
        Vue.http({
          method: 'post',
          url: '/employee/ajax-search-department-or-employee',
          params:{
            keyword: t.searchKeyword,
            type: t.searchType,
            excludeEmployeeIds: t.excludeEmployeeIds.join(','),
            excludeDepartmentIds: t.excludeDepartmentIds.join(','),
            isNeedRoot: t.hasRoot
          }
        }).then(function(reply){
          if(!reply.status){
              return
          }

          //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
          if(!t.searchAjaxController){
              return
          }

          var searchList = reply.data.data;
          var replyKeyword = searchList.keyword;
          if(replyKeyword != t.searchKeyword){
              return;
          }
          t.searchEmployeeList = searchList.employees;
          t.searchDepartmentList = searchList.departments;
        })
      })

    },

    //搜索输入延迟响应
    timerDelay(timer,callback){
      var t = this;
      function fn() {
          t.timer = setTimeout(function () {
              t.keyUpSpacetime += 100;
              if(t.keyUpSpacetime > 200){
                  t.keyUpSpacetime = 0;
                  clearTimeout(t.timer);
                  if(callback){
                      callback.call(t);
                  }
                  return;
              }else{
                  fn()
              }
          },timer)
      }
      fn();
    }
  },

  components: {
    'tree-li': treeLi,
    'employee-li': employeeLi,
    'department-li': departmentLi,
    'employeeList-dialog': employeeListDialog
  }



}


</script>

<style lang="scss">
@import '../../assets/scss/baseParams.scss';
@import '../../assets/scss/skin/skin0.scss';
@import '../../assets/scss/baseSetting.scss';
.lenovo-mask{
  position:fixed;
  top: 0;
  left: 0;
  width:100%;
  height: 100%;
  z-index:1;
  opacity:0;
  filter:alpha(opacity=0);
}
.lenovo-box {
  width: 320px;
  box-shadow: 0 0 3px #cccccc;
  max-height: 440px;
  z-index: 9999999;
  background: white;
  position: absolute;
  box-sizing: border-box;
  top: 10px;
  left: 10px;
  margin-bottom: 10px;
  z-index: 2;

  .lenovo-input {
    display: block!important;
    position: relative!important;
    top: 0!important;
    left: 0!important;
    width: 100%!important;
    outline: none;
    height: 40px;
    width: 100%;
    border: none;
    border-bottom: 1px solid #eeeeee;
    color: #555;
    font-size: 14px;
    box-sizing: border-box;
    text-indent: 38px;


  }
  .icon-search {
    position: absolute;
    top: 12px;
    left: 15px;
    z-index: 999;
    color: #d5d5d5;
    font-size: 18px;

  }
  .icon-close{
    position: absolute;
    top: 10px;
    right: 15px;
    z-index: 999;
    color: #d5d5d5;
    font-size: 18px;
    cursor: pointer;
  }
  .icon-close:hover{
    color: $errorRed !important;
  }

  .tree-list > ul > li.root:nth-of-type(1) > p{
    font-size: 14px;
  }
  .tree-list > ul > li:nth-of-type(1)> p span:before{
    border: none!important;
  }
  .tree-list > ul > li:nth-of-type(1).no-child> p span i.line{
    top: 16px;
    &:before{
      top: 0px;
    }
  }

  .tree-list{
    padding-top: 6px;
    overflow-y:auto;
    overflow-x:hidden;
    max-height: 300px;
    padding-bottom: 10px;
    ul{
      float: none;
      width: 100%;
      position: relative;
      cursor: default
    }

    ul > li.no-child:last-child p span .line{height: 6px;}
    ul > li:last-child > p span:after{
      border: none!important;
    }

    li p:hover .icon-people{display: block;}
    li.disabled > p span{color: #d5d5d5}
    li:hover{background: none!important;}
    li{
      line-height: 36px!important;
      width: 100%;
      height: auto;
      border-radius: inherit;
      padding: 0;
      background: inherit;
      margin: 0;
      position: static;
      p{
        position: relative;
        box-sizing:border-box;
        font-size: 12px;
        border: none!important;
        height: 36px;

        span{
          position: relative;
          margin: 0!important;
          margin-left: 0!important;
          padding-left: 18px;
          width: 75%;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          i{
            position: absolute;
            left: 0;
            font-size: 14px!important;
            top: 10px;
            color: #d5d5d5;
            cursor:pointer;
            line-height: normal!important;
          }
          i.icon-framework{
            font-size: 16px!important;
            left: -1px;
          }
        }
        .icon-people{
          display: none;
          position: absolute;
          right: 12px;
          font-size: 22px!important;
          top: 6px;
          cursor: pointer;
          color: #D5D5D5;
        }
      }
      p span:before,p span:after{
        content: '';
        border-left:#eee solid 1px!important;
        position: absolute;
        height: 13px;
        left: 6px;
        z-index: -1;
      }
      p span:after{bottom: 0;}
      p span:before{top: 0;}
    }


    li.no-child p i.line{
      position: absolute;
      border-left: #eee solid 1px;
      left: 6px;
      height: 16px;
      top: 10px;
      z-index: -1;
    }
    li.no-child p i.line:before{
      content: '';
      position: absolute;
      border-top: #eee solid 1px;
      width: 8px;
      top: 6px;
    }
  }
  .lenovo-list{
    overflow-y:auto;
    overflow-x:hidden;
    max-height: 300px;
    padding-bottom: 10px;
    width: 100%;
    li:hover,li.disabled.department:hover,li.department:hover{
      .icon-people{display: block;}
    }
    li.disabled:hover{background: #fff;}
    li.disabled{
      .tit-head{background: rgba(153,153,153,0.2)}
    }
    li.lenovo-department-li.disabled{
      p{
        color:#d5d5d5!important;
        span{color:#d5d5d5!important;}
      }
    }

    li{
      background-color: #fff;
      width: 100%;
      height: auto;
      border-radius: inherit;
      padding: 0;
      color: #555;

      .tit-head{
        display: inline-block;
        width: 36px;
        height: 36px;
        line-height: 36px;
        color: #fff;
        font-size: 16px;
        text-align: center;
        border-radius: 40px;
        margin-left: 10px !important;
        margin: 6px 10px;
        padding: 0px;
      }
      .tit-text{
        p{
          padding: 0!important;
          width: 220px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          line-height: 18px;
          height: 18px;
          text-align: left;
          border: none!important;
          span{
            color: #64b734;
            margin-left: 0px !important;
          }
        }
        p:first-child{margin-top: 6px;}
        p:last-child{color: #999;}
      }
      em{
        color: #999;
        font-size: 14px;
        text-align: center;
        margin: auto;
        display: block;
        font-style: normal;
      }
    }
    li.department{
      position: relative;
      .icon-people{
        display: none;
        position: absolute;
        cursor: pointer;
        font-size: 22px!important;
        right: 15px;
        top: 11px;
      }
      .tit-text p{
        width: 190px;
      }
    }
  }

  .tree-list{
    ul > li > p {
      padding-left: 10px!important;
    }
    ul > li > ul > li > p {
      padding-left: 35px!important;
    }
    ul > li > ul > li > ul > li > p {
      padding-left: 60px!important;
    }
    ul > li > ul > li > ul > li > ul > li > p {
      padding-left: 85px!important;
    }
    ul > li > ul > li > ul > li > ul > li > ul > li > p {
      padding-left: 110px!important;
    }
    ul > li > ul > li > ul > li > ul > li > ul > li > ul > li > p {
      padding-left: 135px!important;
    }

    ul.before:before{
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      height: 100%;
      border-left: #eee solid 1px!important;
    }
    ul > li > ul:before{
      left: 16px!important;
    }
    ul > li > ul > li > ul:before{
      left: 41px!important;
    }
    ul > li > ul > li > ul > li > ul:before{
      left: 66px!important;
    }
    ul > li > ul > li > ul > li > ul> li > ul:before{
      left: 91px!important;
    }
    ul > li > ul > li > ul > li > ul> li > ul> li > ul:before{
      left: 116px!important;
    }
    ul > li > ul > li > ul > li > ul> li > ul> li > ul> li > ul:before{
      left: 141px!important;
    }
  }

}



.input-search-lenovo{

  li:hover,li.disabled.department:hover,li.department:hover{
    .icon-people{display: block;}
  }
  li.disabled:hover{background: #fff;}
  li.disabled{
    .tit-head{background: rgba(153,153,153,0.2)}
    p{
      color:#d5d5d5!important;
      span{color:#d5d5d5!important;}
    }
  }
  li{
    background-color: #fff;
    width: 100%;
    height: auto;
    border-radius: inherit;
    padding: 0;
    color: #555;

    .tit-head{
      display: inline-block;
      width: 36px;
      height: 36px;
      line-height: 36px;
      color: #fff;
      font-size: 16px;
      text-align: center;
      border-radius: 40px;
      margin: 6px 10px;
    }
    .tit-text{
      p{
        width: 244px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 18px;
        height: 18px;
        text-align: left;
        span{
          color: #64b734;
        }
      }
      p:first-child{margin-top: 6px;}
      p:last-child{color: #999;}
    }
  }
  li.department{
    position: relative;
    .icon-people{
      display: none;
      position: absolute;
      cursor: pointer;
      font-size: 26px;
      right: 15px;
      top: 11px;
    }
    .tit-text p{width: 204px;}
  }
}

</style>