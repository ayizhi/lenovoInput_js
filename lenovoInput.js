define(['jquery','base','scrollbar'],function($){

    //===============================================获取部门信息start====================================================

    //清空
    localStorage.clear('department_list');

    //获取所有部门并放入sessionStorage
    function getDepartmentList(obj){ //obj/{root: 是否包含跟节点，默认为1，ajax: 为1强制请求ajax,默认为0, callback: 回调}
        var callback = obj.callback || 0;
        var ajax = obj.ajax || 0;
        var root = obj.root || 0;

        if(root){
            var departmentList = store('department_list_root');
        }else{
            var departmentList = store('department_list')
        }
        if(departmentList && !$.isEmptyObject(departmentList) && (!ajax)){
            if(callback){
                callback(departmentList)
            }
            return
        }
        //强制清空
        localStorage.clear('department_list');

        $.ajax({
            url:'/company/ajax-get-auth-department',
            type:'POST',
            data:{
                "_csrf": $("meta[name='csrf-token']").attr('content'),
                "isNeedRoot": root
            },
            success:function(reply){
                if(root){
                    store('department_list_root',reply.data)
                }else{
                    store('department_list',reply.data)
                }
                if(callback){
                    callback(reply.data)
                }
            }
        })
    }



    getDepartmentList({ajax: 1});
    getDepartmentList({ajax: 1,root: 1});


    //===============================================获取部门信息en=======================================================



    //===============================================查看部门员工=========================================================
    //由于组织架构也要用到，以及本身的封装问题，将其淡出抽出来
    /*
    * @params singleSelect 是否单选
    * @params showOnly 是否仅展示
    * @params afterSelectEmployee 点击confirm后的实现
    * @params noDepartment 是否为展示待分配
    * */

    function ShowDepartmentEmployee(obj) {
        this.singleSelect = obj.singleSelect || 0;//是否为单选
        this.employeePageNum = 1;//员工弹窗页数
        this.employeePageSize = 50;//每页显示
        this.showOnly = obj.showOnly || 0;//是否不可选择
        this.afterSelectEmployee = obj.afterSelectEmployee || function () {}//选择后的事件
        this.noDepartment  = obj.noDepartment || 0;//是否待分配
        return this;
    }

    ShowDepartmentEmployee.prototype = {

        //加载数据并展示
        showDepartmentEmployee: function(departmentId,departmentName){
            var t = this;
            var bottomBtn = t.showOnly == 0
                ? {bottomBtn: {'confirm':'确认','cancel':"取消"},bute: true,width:'1000px'}
                : {bute: true,width:'1000px'}
            var departmentName = departmentName.indexOf('的员工') == -1 ? departmentName + '的员工' : departmentName
            var showDepartmentEmployeeDialog = new Dialog('show-department-employee-dialog' , departmentName , bottomBtn);
            var height = $(document).height() - 100 + 'px';

            showDepartmentEmployeeDialog.appendDom(
                [
                    '<div class="employee-list-content" style="height: ' + height + '">',
                    '  <div id="loadingList" >',
                    '        <img src="/static/img/loading.gif" class="loadingImg" />',
                    '        <img src="/static/img/loadingText.gif" class="loadingTxt" />',
                    '    </div>',
                    (t.singleSelect == 0 && t.showOnly == 0) ? '<div class="select-all-wrap" style="display: none"><input type="checkbox" class="select-all"/>全选</div>' : '',
                    '<ul class="employee-list" style="display: none"></ul>',
                    '</div>'
                ].join('')
            )
            t.employeePageNum = 1;//员工弹窗页数初始化
            t.loadingEmployeeListOfDialog(departmentId,showDepartmentEmployeeDialog)
            showDepartmentEmployeeDialog.bindEvent(function () {
                t.employeeListDialogEvent(departmentId,showDepartmentEmployeeDialog)
            })


        },

        //加载部门员工列表
        loadingEmployeeListOfDialog: function (departmentId,showDepartmentEmployeeDialog) {
            var t = this;
            var $employeeListContent = $('#' + showDepartmentEmployeeDialog.alertId).find('.employee-list-content');

            //加载控制器
            t.getMoreController = false;

            if(t.noDepartment == 1){
                t.url = '/employee/ajax-get-no-department-employees'
            }else{
                t.url = '/employee/ajax-get-department-employees'
            }

            //加载数据
            $.ajax({
                url: t.url,
                type: 'post',
                data: {
                    departmentId: departmentId,
                    excludeEmployeeIds: t.excludeEmployeeIds && t.excludeEmployeeIds.join(',') || '',
                    pageNum: t.employeePageNum,
                    pageSize: t.employeePageSize,
                },
                success: function (reply) {

                    t.getMoreController = true;

                    if(!reply.status){
                        remind('error',reply.message);
                        return;
                    }
                    //移除加载图标
                    if($employeeListContent.find('#loadingList').length != 0){
                        $employeeListContent.find('#loadingList').remove();
                    }

                    var employeeList = reply.data.queryPageResult.data;
                    var resultSize = reply.data.queryPageResult.resultSize;
                    var totalPageNum = reply.data.queryPageResult.totalPageNum;
                    var eList = [];
                    var $employeeList = $employeeListContent.find('.employee-list');



                    //如果为空
                    if(resultSize == 0 && totalPageNum == 0){
                        $employeeListContent.html([
                            '<div class="empty-list">',
                                '<p class="remind-icon"><i class="icon-report"></i></p>',
                                '<p class="remind-text">该部门无可选择员工</p>',
                            '<div>',

                        ].join(""));
                        $('#' + showDepartmentEmployeeDialog.alertId).find(".bottomBtn.confirm").attr("disabled", "disabled");

                        return;
                    }

                    //全选以及employee－list
                    if($employeeListContent.find('.employee-list').css('display') == 'none'){
                        $employeeListContent.find('.employee-list').show();
                        if(t.singleSelect == 0 && t.showOnly == 0){
                            $employeeListContent.find('.select-all-wrap').show();
                        }
                    }

                    //遍历填充list
                    $.each(employeeList, function(index, item) {
                        var ifSub = item.isSub ? '' : 'direct-child'
                        eList.push([
                            '<li class="' + ifSub + ' fl" data-employeeId="' + item.id + '" data-employeeName="' + item.name + '">',
                            '<span class="t-head fl">' + item.name.substr(0,1) + '</span>',
                            '<p class="fl"><span>' + item.name + '' + (item.title ? ('-' + item.title) : '') + '</span><span>' + item.mobile + '</span></p>',
                            '<i class="icon-choice"></i>',
                            '</li>'].join(''))
                    });

                    var eListHtml = eList.join('');
                    $employeeList.append($(eListHtml))
                }
            })
        },

        //选择员工列表弹窗事件
        employeeListDialogEvent: function (departmentId,showDepartmentEmployeeDialog) {
            var t = this;
            var $winObj = $("#" + showDepartmentEmployeeDialog.alertId);
            // 选中状态toggle
            $winObj.on("click", ".employee-list li.fl", function() {
                //单选时或仅展示时不能继续
                if(t.showOnly != 0){
                    return;
                }
                $(this).toggleClass('active');
                var isAll = ($winObj.find(".employee-list .direct-child:not(.active)").size() == 0) && ($winObj.find('.employee-list .direct-child').length != 0) ? true : false;
                $winObj.find(".select-all").prop('checked', isAll);
                //单选
                if(t.singleSelect != 0){
                    $(this).siblings('.fl').removeClass('active');
                }
            });

            // 全选
            $winObj.on("click", ".select-all", function() {
                //单选时或仅展示时不能继续
                if(t.showOnly != 0 || t.singleSelect != 0){
                    return;
                }
                var isAll = $(this).prop("checked");
                isAll
                    ? $winObj.find(".employee-list li.direct-child").addClass('active')
                    : $winObj.find(".employee-list li.direct-child").removeClass('active')
            });

            //加载更多
            $winObj.find('.employee-list').on('scroll',function () {
                var $t = $(this);
                var scrollTop = $t.scrollTop();
                var liHeight = 72;
                var invisableNum = parseInt(scrollTop / liHeight) + 1;
                var lineNum = $t.children('li').length / 5
                if(lineNum - invisableNum <= 8){
                    if(!t.getMoreController){
                        return
                    }

                    t.employeePageNum++;

                    t.loadingEmployeeListOfDialog(departmentId,showDepartmentEmployeeDialog);
                }
            })

            //点击确认
            $winObj.on('click','.confirm',function () {
                var list = [];
                $winObj.find('.fl.active').each(function () {
                    var $li = $(this);
                    var id = $li.attr('data-employeeId');
                    var name = $li.attr('data-employeeName')
                    list.push({
                        id: id,
                        name: name,
                    })
                });

                t.afterSelectEmployee.call(t,list);
                if(list.length){
                    showDepartmentEmployeeDialog.rmThis();
                }
            });
        },
    }


    //===============================================查看部门员工=========================================================


    //===============================================lenovo总类start=====================================================
    /*
    * 主要负责重复事件／方法的封装
    * @params $pa: 父容器
    * @params obj: {
    *           departmentRoot： 部门是否有根 1/0
    *           ifDepartmentAble:  部门是否可点击
    *           ifLittleMenIcon： 是否有小人图标
    *
    *
    *
    *               }
    * */

    function LenovoInput($pa,obj) {

        this.$pa = $pa || $(document);

        var obj = obj || {};

        this.departmentRoot = obj.departmentRoot || 0;

        this.ifDepartmentAble = obj.ifDepartmentAble || 0;

        this.ifLittleMenIcon = obj.ifLittleMenIcon || 0;//是否有小人图标

        this.placeholder = obj.placeholder || '';

        this.keyUpSpacetime = 0;//搜索延迟
        this.timer = null;//计时器

        this.excludeEmployeeIds = [];

        this.excludeDepartmentIds = [];

        this.searchAjaxController = true;//加载控制器

        // 继承选择部门员工的弹窗
        ShowDepartmentEmployee.apply(this,[obj]);

        //模版
        this.baseHtml = [
            '<div class=\'lenovo-box display-none\' style="display: none">',
            '                   <i class=\'icon icon-search\'></i>',
            '                   <i class=\'icon icon-close\'></i>',
            '                   <input class=\'lenovo-input\' placeholder=\'' + this.placeholder + '\' />',
            '                   <div class=\'tree-list\'></div>',
            '                   <ul class="lenovo-list" style="display: none"></ul>',
        ].join('');

        this.searchEmployeeTmp = [
            '<li class=\'clearfix lenovo-search-li employee \' data-employeeName="@(name)" data-employeeId="@(employeeId)" >',
            '                           <span class=\'fl tit-head\'>@(firstName)</span>',
            '                           <div class=\'fl tit-text\' >',
            '                               <p  title="@(name)" >@(highlightEmployeeName) @(title) - @(highlightMobile)</p>',
            '                               <p title="@(parentDepartmentNames)">@(parentDepartmentNames)</p>',
            '                           </div>',
            '                       </li>'
        ].join('');

        this.searchDepartmentTmp =  [
            '<li class=\'clearfix lenovo-search-li department @(ifDisabled) lenovo-department-content \'  data-departmentName="@(name)" data-departmentId="@(id)" data-parentDepartmentNames="@(parentDepartmentNames)">',
            '                           <span class=\'fl tit-head\'>@(firstName)</span>',
            '                           <div class=\'fl tit-text\' title="@(name)">',
            '                               <p  title="@(name)" >@(highlightDepartmentName)</p>',
            '                               <p title="@(parentDepartmentNames)">@(parentDepartmentNames)</p>',
            '                           </div>',
            this.ifLittleMenIcon == 1 ? '                           <i class=\'icon icon-people\'></i>' : '',
            '                       </li>'
        ].join('');


    }

    inheritExtend(LenovoInput,ShowDepartmentEmployee);

        //初始化部门tree
    LenovoInput.prototype.initLenovo = function () {
            var t = this;

            t.$pa.append($(t.baseHtml));
            //树的容器
            t.$treeContent = t.$pa.find('.lenovo-box .tree-list');
            //搜索结果的容器
            t.$listContent = t.$pa.find('.lenovo-box .lenovo-list');

            //绑定默认事件
            t.bindDefaultEvent();

    };

        //渲染树状图结构
    LenovoInput.prototype.appendTree = function () {
        var t = this;
        getDepartmentList({
            root: t.departmentRoot,
            callback: function (departmentList) {
                t.departmentList = departmentList;
                var treeHtml = t.treeIterator(departmentList);
                //树的容器
                t.$treeContent = t.$pa.find('.lenovo-box .tree-list');
                //搜索结果的容器
                t.$listContent = t.$pa.find('.lenovo-box .lenovo-list');

                t.$treeContent.show();
                t.$listContent.hide();

                //滚动条的处理
                if(t.$treeContent.find('.mCSB_container').length != 0){
                    t.$treeContent.find('.mCSB_container').html(treeHtml);
                }else{
                    t.$treeContent.html(treeHtml);
                }
                t.initTreescrollBar();
            }
        });
    };

        //渲染搜索列表
    LenovoInput.prototype.appendSearchList = function (searchList) {
        var t = this;
        var listHtml = t.listIerator(searchList);
        t.$treeContent.hide();
        t.$listContent.show();
        //滚动条的处理
        if(t.$listContent.find('.mCSB_container').length != 0){
            t.$listContent.find('.mCSB_container').html(listHtml);
        }else{
            t.$listContent.html(listHtml);
        }
        t.initSearchListscrollBar();

    };

        //递归解析树状图结构
    LenovoInput.prototype.treeIterator = function (departmentList) {
            var t = this;
            var tmpHtml = '<ul>';
            var data = departmentList;
            var i,len = data.length;

            //没有部门
            if(!len){
                return '<ul><li><em class="clearfix">暂无部门...</em></li></ul>'
            };

            //因为ui设计中根部门与其它部门位于同一级别
            if(t.departmentRoot){
                var node = JSON.parse(JSON.stringify(data[0]));
                var fixData = node.children;
                node.children = [];
                node.isRoot = 1;
                fixData.unshift(node);
                data = fixData
                len = data.length;
            }

            //递归拼接部门树状图
            (function () {
                for(i = 0 ; i < len ; i++){
                    var node = data[i];
                    var ifLast = 0;
                    if(i == len - 1){
                        ifLast = 1
                    }
                    iter(node,ifLast);
                }
            })();

            //迭代器
            function iter(node,ifLast) {
                var departmentId = node.id;
                var departmentName = node.name;
                var isAuth = node.isAuth && t.ifDepartmentAble ? '' : 'disabled';
                var children = node.children;
                var littleMenIcon = (t.ifLittleMenIcon == 1 && node.isAuth == 1) ? "<i class='icon icon-people'></i>" : '';//是否有小人图标


                var ifChildrenLiClass = children.length ? '' : 'no-child';
                var ifRoot = t.departmentRoot && node.isRoot ? 'root' : '';
                var ifHasBefore = ifLast ? '' : 'before';
                var showAndHideIcon = ifRoot
                    ? '<i class="icon-framework"></i>'
                    : children.length
                        ? "<i class='fl icon icon-add4'></i>"
                        : '<i class="line"></i>';

                //主体
                tmpHtml += ['<li class="lenovo-department-li ' + isAuth + ' ' + ifChildrenLiClass + ' ' + ifRoot + '">',
                                '<p class="clearfix lenovo-department-content" data-departmentId="' + departmentId + '" data-departmentName="' + departmentName + '" title="' + departmentName + '">',
                                    '<span class="fl ' + isAuth + '" data-departmentId="' + departmentId + '" data-departmentName="' + departmentName + '">',
                                        showAndHideIcon + departmentName,
                                    '</span>',
                                    littleMenIcon,
                                '</p>'
                ].join('');

                if(children.length){
                    tmpHtml += '<ul class="display-none ' + ifHasBefore + '">';
                };

                //遍历children递归
                (function () {
                    for(var r = 0 , length = children.length; r < length ; r++){
                        var child = children[r];
                        var ifChildLast = 0;
                        if(r == length - 1){
                            ifChildLast = 1
                        }
                        iter(child,ifChildLast);
                    }
                })();

                if(children.length){
                    tmpHtml += '</ul>';
                }
                tmpHtml += '</li>';
            }

            tmpHtml += '</ul>';

            return tmpHtml
        };

        //解析搜索列表
    LenovoInput.prototype.listIerator = function (searchList) {
            var t = this;
            var employees = searchList.employees;
            var departments = searchList.departments;
            var keyword = searchList.keyword;

            var renderList = [];

            //判断是否为空
            if(employees.length == 0 && departments.length == 0){
                return '<li><em>很抱歉，没有找到相关信息...</em></li>'
            }

            //对员工
            (function () {
                for(var i = 0 , len = employees.length ; i < len ; i++){
                    var employee = employees[i];
                    var employeeName = employee.name;
                    var mobile = employee.mobile;
                    //拆解
                    var firstName = employeeName[0]
                    var highlightEmployeeName = t._getHighlightName(keyword,employeeName);
                    var highlightMobile = t._getHighlightName(keyword,mobile);
                    //填充
                    var html = formString(t.searchEmployeeTmp,$.extend(employee,{
                        highlightEmployeeName: highlightEmployeeName,
                        highlightMobile: highlightMobile,
                        keyword: keyword,
                        firstName: firstName,
                        title: employee.title ? '- ' + employee.title : '',
                        parentDepartmentNames: employee.parentDepartmentNames ? employee.parentDepartmentNames : '待分配...'
                    }))
                    renderList.push(html);
                };
            })();

            //对部门
            (function () {
                for(var r = 0 , len = departments.length; r < len ; r++){
                    var department = departments[r];
                    var departmnetName = department.name;
                    //拆解
                    var firstName = departmnetName[0]
                    var highlightDepartmentName = t._getHighlightName(keyword,departmnetName);
                    //填充
                    var html = formString(t.searchDepartmentTmp,$.extend(department,{
                        highlightDepartmentName: highlightDepartmentName,
                        keyword: keyword,
                        firstName: firstName,
                        ifDisabled: !t.ifDepartmentAble ? 'disabled':'',
                        parentDepartmentNames: department.parentDepartmentNames ? department.parentDepartmentNames : '无父级部门...'
                    }))
                    renderList.push(html);
                }
            })();

            return renderList.join("");
        };

        //绑定默认事件
    LenovoInput.prototype.bindDefaultEvent = function () {
            var t = this;

            //显示隐藏父／子节点
            t.$pa.on('click','.icon-add4',function () {
                var $t = $(this);
                $t.removeClass('icon-add4').addClass('icon-subtracter');
                var $li = $t.parent('span').parent('p').parent('li');
                $li.children('ul').removeClass('display-none');
                return false;
            });
            t.$pa.on('click','.icon-subtracter',function () {
                var $t = $(this);
                $t.addClass('icon-add4').removeClass('icon-subtracter');
                var $li = $t.parent('span').parent('p').parent('li');
                $li.children('ul').addClass('display-none');
                return false;
            });

            //搜索逻辑 keydown
            t.$pa.on('keydown','.lenovo-box .lenovo-input',function () {
                clearTimeout(t.timer);
                t.keyUpSpacetime = 0;
            });

            //搜索逻辑 keyup
            var keyword = '';
            t.$pa.on('keyup','.lenovo-box .lenovo-input',function () {
                var $t = $(this);
                keyword = $t.val();

                //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
                t.searchAjaxController = true;

                //如果结果为空,渲染部门列表
                if($.trim(keyword) == ''){
                    //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
                    t.searchAjaxController = false;
                    t.appendTree();
                    return;
                }

                //延时
               t._timerDelay(100,function(){
                   //搜索
                   $.ajax({
                       url: '/employee/ajax-search-department-or-employee',
                       type: 'post',
                       data: {
                           keyword: keyword,
                           type: t.searchType,
                           excludeEmployeeIds: t.excludeEmployeeIds.join(','),
                           excludeDepartmentIds: t.excludeDepartmentIds.join(','),
                           isNeedRoot: t.departmentRoot
                       },
                       success: function (reply) {

                           //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
                           if(!t.searchAjaxController){
                               return
                           }

                           if(!reply.status){
                               return
                           }

                           var replyKeyword = reply.data.keyword;

                           if(replyKeyword != keyword){
                               return;
                           }

                           t.appendSearchList(reply.data);
                       }
                   })
                   return;
               })
            });


            //点击搜索框差号按钮
            t.$pa.on('click','.lenovo-box .icon-close',function (event) {
                var e = event || window.event
                e.stopPropagation()
                t.$pa.find('.lenovo-input').val('').blur();
                //搜索控制器，为了防止点击差号关闭了搜索之后ajax再返回
                t.searchAjaxController = false;
                t.appendTree();

                return false;
            });


            //点击pa显示
            t.$pa.on('click',function (event) {
                var e = window.event || event;
                var $t = $(this);
                if($t.find('.lenovo-box').css('display') != 'none'){
                    return
                }

                t.showNode();
                //自适应
                t.autoStyle(e);

                return false;
            });

            //点击小人
            t.$pa.on('click','.lenovo-box .icon-people',function () {
                var $t = $(this);
                var $content = $t.parent('.lenovo-department-content')
                var departmentId = $content.attr('data-departmentId');
                var departmentName = $content.attr('data-departmentName');
                //关闭搜索框
                t.hideNode();

                //打开弹窗
                t.showDepartmentEmployee(departmentId,departmentName);
                return false;
            });

            //点击部门树状图，选择部门
            t.$pa.on('click','.lenovo-department-li span',function () {
                var $t = $(this);
                if($t.hasClass('disabled')){
                    return;
                }
                var departmentId = $t.attr('data-departmentId');
                var departmentName = $t.attr('data-departmentName');
                var type = 'department';

                t.afterClickLenovoLi.call(t,type,departmentId,departmentName);

                //单选
                if(t.singleSelect != 0){
                    t.hideNode();
                }
                return false;
            });

            //点击搜索结果，选择部门或员工
            t.$pa.on('click','.lenovo-search-li',function () {
                var $t = $(this);

                if($t.hasClass('disabled')){
                    return;
                }

                var type,id,name;
                //判断type
                if($t.hasClass('department')){
                    type = 'department';
                    id = $t.attr('data-departmentId');
                    name = $t.attr('data-departmentName');
                }else if($t.hasClass('employee')){
                    type = 'employee';
                    id = $t.attr('data-employeeId');
                    name = $t.attr('data-employeeName');
                }

                t.afterClickLenovoLi.call(t,type,id,name);

                //删除节点
                this.remove();

                //单选
                if(t.singleSelect != 0){
                    t.hideNode();
                }
                return false;
            });
        };

        //自适应
    LenovoInput.prototype.autoStyle = function (e) {
        var t = this;
        var $lenovoBox = t.$pa.find('.lenovo-box');
        var $pa = t.$pa;
        var clientY = e.clientY;
        var clientX = e.clientX;
        var defaultH;//lenovo－box的高度
        var defaultW = 320;
        var winX,winY,winH,winW,$winBody;
        var tBottom,tTop,tLeft,tRight;

        //由于获取domH被scroll库影响的原因，我们获取Lenovo box高度需要用这种方法
        if(t.$pa.find('.lenovo-box .mCSB_container').length != 0){
            var len = t.$pa.find('.lenovo-box .mCSB_container').children('ul').children('li').length;
        }else{
            var len = t.$pa.find('.lenovo-box').children('ul').children('li').length;
        }

        defaultH = len * 36;
        defaultH = defaultH > 300 ? 300 : defaultH;
        defaultH += 46;


        //判断大弹窗还是小弹窗
        if($pa.parents('.winBody').hasClass('winBody')){
            $winBody = $pa.parents('.winBody');
            winY = $winBody.offset().top;
        }else if($pa.parents('.alertBody').hasClass('alertBody')){
            $winBody = $pa.parents('.alertBody');
            winY = $winBody.offset().top;
        }

        winX = $winBody.offset().left;
        winH = $winBody.height();
        winW = $winBody.width();

        tBottom = toBottom(winY,winH,clientY)
        tTop = toTop(winY,clientY);

        //判断高度
        if( tBottom < defaultH) {
            if(tTop < defaultH){
                //middle
                var positionTop = tTop - 60 > 160 ? 160 : tTop - 60;
                $lenovoBox.css({
                    top: -positionTop + 'px',
                })

            }else{
                //top
                $lenovoBox.css({
                    bottom: '-10px',
                    top: 'auto',
                })
            }
        }else{
            //bottom(normal)
            $lenovoBox.css({
                top: '10px',
                bottom: 'auto',
            })
        }

        tRight = toRight(winX,winW,clientX);
        tLeft = toLeft(winX,clientX)

        //判断左右
        if( tRight < defaultW ){
            if( tLeft < defaultW ){
                //left
                $lenovoBox.css({
                    left: '-320px'
                })
            }else{
                //middle
                $lenovoBox.css({
                    left: '-100px',
                })
            }
        }else{
            //right(normal)
            $lenovoBox.css({
                left: '10px',
            })
        }


        //需要return距离底部的距离
        function toBottom(winY,winH,ClienY) {
            var bottom = winY + winH - ClienY
            return bottom
        }

        //需要return距离顶部的距离
        function toTop(winY,ClienY){
            var top = ClienY - winY
            return top;
        }

        //需要return距离右边的距离
        function toRight(winX,winW,clientX) {
            var right = winX + winW - clientX
            return right;
        }

        //需要return
        function toLeft(winX,clientX) {
            var left = clientX - winX;
            return left;
        }


    };

    //添加树的滚动条
    LenovoInput.prototype.initTreescrollBar = function () {
        var t = this;
        var $pa = t.$pa;

        if($pa.find('.lenovo-box .tree-list .mCSB_container').length != 0){
            return;
        }

        if($pa.parents('.mCSB_container').hasClass('mCSB_container')){

            if($pa.find('.lenovo-box .tree-list').mCustomScrollbar){
                $pa.find('.lenovo-box .tree-list').mCustomScrollbar({
                    autoHideScrollbar:true,
                    theme:'dark-thin',
                    live: 'true',
                    liveSelector: '.lenovo-box .tree-list'
                });
            }

        }
    };

    //添加搜索list的滚动条
    LenovoInput.prototype.initSearchListscrollBar = function () {
        var t = this;
        var $pa = t.$pa;

        if($pa.find('.lenovo-box .lenovo-list .mCSB_container').length != 0){
            return;
        }

        if($pa.parents('.mCSB_container').hasClass('mCSB_container')){
            if($pa.find('.lenovo-box .lenovo-list').mCustomScrollbar){
                $pa.find('.lenovo-box .lenovo-list').mCustomScrollbar({
                    autoHideScrollbar:true,
                    theme:'dark-thin',
                    live: 'true',
                    liveSelector: '.lenovo-box .lenovo-list'
                });
            }

        }
    }

        //定时器任务，用来处理输出延时
    LenovoInput.prototype._timerDelay = function (timer,callback) {
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
        };

        //拆解关键字
    LenovoInput.prototype._getHighlightName = function (keyword,name) {
            var reg = new RegExp(keyword,'g');
            return name.replace(reg, "<span>" + keyword + "</span>")
        };

        //关闭
    LenovoInput.prototype.hideNode = function () {
            var t = this;
            t.$pa.find('.lenovo-box').hide().find('.lenovo-input').val('');
        };

        //显示
    LenovoInput.prototype.showNode = function () {
        var t = this;
        $('.lenovo-box').hide();
        t.$pa.find('.lenovo-box').show();
        t.$pa.find('.lenovo-input').val('');
        t.appendTree();
    };

        //屏蔽部门id
    LenovoInput.prototype.excludeDepartmentId = function (id) {
            var t = this;
            t.excludeDepartmentIds.push(id);
        };

        //释放部门id
    LenovoInput.prototype.includeDepartmentId = function (id) {
            var t = this;
            var index = t.excludeDepartmentIds.indexOf(id);
            t.excludeDepartmentIds.splice(index,1)
        };

        //屏蔽员工id
    LenovoInput.prototype.excludeEmployeeId = function (id) {
            var t = this;
            t.excludeEmployeeIds.push(id);
        };
        //释放员工id
    LenovoInput.prototype.includeEmployeeId = function (id) {
            var t = this;
            var index = t.excludeEmployeeIds.indexOf(id);
            t.excludeEmployeeIds.splice(index,1)
        };


    //===============================================lenovo总类end=======================================================



    /*
    * @params: singleSelect 是否支持单选
     * @params: afterClickLenovoLi 点击选择lenovo-li
     * @params: afterSelectEmployee 点击选择部门下的员工
    * */

    //=================================================部门联想输入start==================================================


        function DepartmentLenovo($pa,obj){
            var obj = obj || {};
            obj.ifDepartmentAble = 1;
            obj.ifLittleMenIcon = 0;
            obj.departmentRoot = obj.root || 0;
            obj.placeholder = '请输入部门名称';
            obj.singleSelect = obj.singleSelect || 0;

            LenovoInput.call(this,$pa,obj);

            //是否单选
            this.singleSelect = obj.singleSelect;

            //几个事件
            this.afterClickLenovoLi = obj.afterClickLenovoLi || function () {} //点击树状图,type,id,name
            this.afterSelectEmployee = obj.afterSelectEmployee || function () {}//点击选择员工弹窗确认按钮,list==>{id:'',name:''}

            this.searchType = 2;//搜索类型，1:只搜员工，2：只搜部门，3：部门和员工

            //初始化部门tree
            this.initLenovo();

            return this;
        }

        //DepartmentLenovo
        inheritExtend(DepartmentLenovo,LenovoInput);

        DepartmentLenovo.prototype.bindEvent = function (callback) {
            var t = this;
            if(callback){
                callback.call(t);
            }
        }


    //=================================================部门联想输入end====================================================



    //=======================================================员工联想输入start============================================

    function EmployeeLenovo($pa,obj){
        var obj = obj || {};
        obj.ifDepartmentAble = 0;
        obj.ifLittleMenIcon = 1;
        obj.departmentRoot = obj.root || 0;
        obj.placeholder = '请输入部门名称／员工的姓名或手机号';
        obj.singleSelect = obj.singleSelect || 0;

        LenovoInput.call(this,$pa,obj);

        //是否单选
        this.singleSelect = obj.singleSelect;

        //几个事件
        this.afterClickLenovoLi = obj.afterClickLenovoLi || function () {} //点击树状图,type,id,name
        this.afterSelectEmployee = obj.afterSelectEmployee || function () {}//点击选择员工弹窗确认按钮,list==>{id:'',name:''}

        this.searchType = 3;//搜索类型，1:只搜员工，2：只搜部门，3：部门和员工

        //初始化部门tree
        this.initLenovo();

        return this;
    }

    //EmployeeLenovo
    inheritExtend(EmployeeLenovo,LenovoInput);

    EmployeeLenovo.prototype.bindEvent = function (callback) {
        var t = this;
        if(callback){
            callback.call(t);
        }
    }


    //=======================================================员工联想输入end====================================================





    //========================================================员工部门联想输入start==============================================

    function ALLInvolvedLenovo($pa,obj){
        var obj = obj || {};
        obj.ifDepartmentAble = 1;
        obj.ifLittleMenIcon = 1;
        obj.departmentRoot = obj.root || 1;
        obj.placeholder = '请输入部门名称／员工的姓名或手机号'
        obj.singleSelect = obj.singleSelect || 0;

        LenovoInput.call(this,$pa,obj);

        //是否单选
        this.singleSelect = obj.singleSelect;

        //几个事件
        this.afterClickLenovoLi = obj.afterClickLenovoLi || function () {} //点击树状图,type,id,name
        this.afterSelectEmployee = obj.afterSelectEmployee || function () {}//点击选择员工弹窗确认按钮,list==>{id:'',name:''}

        this.searchType = 3;//搜索类型，1:只搜员工，2：只搜部门，3：部门和员工

        //初始化部门tree
        this.initLenovo();

        return this;
    }

    //EmployeeLenovo
    inheritExtend(ALLInvolvedLenovo,LenovoInput);

    ALLInvolvedLenovo.prototype.bindEvent = function (callback) {
        var t = this;
        if(callback){
            callback.call(t);
        }
    }




    //====================================================员工部门联想输入end=============================================




    //=======================================================input搜索==================================================
    function InputSearchLenovo($input,$searchListContent,obj) {
        var obj = obj || {};
        obj.ifDepartmentAble = 0;
        obj.ifLittleMenIcon = 0;
        obj.departmentRoot = obj.root || 0;
        obj.placeholder = '请输入部门名称／员工的姓名或手机号'
        obj.singleSelect = obj.singleSelect || 0;

        LenovoInput.call(this,document,obj);

        this.$input = $input;
        this.$searchListContent = $searchListContent;

        //是否单选
        this.singleSelect = obj.singleSelect;

        //几个事件
        this.afterClickLenovoLi = obj.afterClickLenovoLi || function () {} //点击树状图,type,id,name

        this.searchType = 1;//搜索类型，1:只搜员工，2：只搜部门，3：部门和员工

        this.init();

        return this;
    }

    inheritExtend(InputSearchLenovo,LenovoInput);

    InputSearchLenovo.prototype.init = function () {
        var t = this;
        t.$searchListContent.addClass('input-search-lenovo');
        t.bindDefaultInputSearchLenovoEvent();
    }

    InputSearchLenovo.prototype.bindDefaultInputSearchLenovoEvent = function () {
        var t = this;
        //搜索逻辑 keyup
        var keyword = '';
        t.$input.on('keyup',function () {
            var $t = $(this);
            keyword = $t.val();
            //如果结果为空,渲染部门列表
            if($.trim(keyword) == ''){
                t.$searchListContent.hide();
                return;
            }

            //延时
            t._timerDelay(100,function(){
                //搜索
                $.ajax({
                    url: '/employee/ajax-search-department-or-employee',
                    type: 'post',
                    data: {
                        keyword: keyword,
                        type: t.searchType,
                        excludeEmployeeIds: t.excludeEmployeeIds.join(','),
                        excludeDepartmentIds: t.excludeDepartmentIds.join(','),
                        isNeedRoot: t.departmentRoot
                    },
                    success: function (reply) {
                        if(!reply.status){
                            return
                        }
                        var replyKeyword = reply.data.keyword;
                        var searchList = reply.data;

                        if(keyword != replyKeyword){
                            return;
                        }

                        if(searchList.employees.length ==  0){
                            t.$searchListContent.hide();
                            return;
                        }

                        if(t.$input.val() == ''){
                            return;
                        }

                        var list = t.listIerator(searchList);

                        t.$searchListContent.slideDown('200');
                        t.$searchListContent.html(list);
                    }
                })
                return;
            })
        });


        //点击逻辑
        //点击搜索结果，选择部门或员工
        t.$searchListContent.on('click','.lenovo-search-li',function () {
            var $t = $(this);
            if($t.hasClass('disabled')){
                return;
            }
            var type,id,name;

            //判断type
            if($t.hasClass('department')){
                type = 'department';
                id = $t.attr('data-departmentId');
                name = $t.attr('data-departmentName');
            }else if($t.hasClass('employee')){
                type = 'employee';
                id = $t.attr('data-employeeId');
                name = $t.attr('data-employeeName');
            }

            t.afterClickLenovoLi.call(t,type,id,name);

            //删除节点
            $t.remove();

            //单选
            if(t.singleSelect != 0){
                t.$searchListContent.hide();
            }
            return false;
        });
    }

    InputSearchLenovo.prototype.bindEvent = function (callback) {
        var t = this;
        if(callback){
            callback.call(t);
        }
    }

    //=======================================================input搜索==================================================


//类继承的bridge
    function inheritExtend(Child,Pa) {
        var Bridge = function(){};
        Bridge.prototype = Pa.prototype;
        Child.prototype = new Bridge();
        Child.prototype.constructor = Child;
        Child.uber = Pa.prototype;
    }

    //点击别处消失,联想输入消失
    $(document).on('click',function (event) {
        var e = window.event || event;
        var target = e.target;

        //针对普通联想搜索
        var $lenovoBox = $(target).parents('.lenovo-box');
        if(!$lenovoBox.hasClass('lenovo-box')){
            $('.lenovo-box').hide().find('.lenovo-input').val('');
        }

        //针对输入搜索
        var $inputSearchLenovo = $(target).parents('.input-search-lenovo');
        if(!$inputSearchLenovo.hasClass('input-search-lenovo')){
            $('.input-search-lenovo').hide();
        }
    });




    return{
        DepartmentLenovo: DepartmentLenovo,
        EmployeeLenovo: EmployeeLenovo,
        ALLInvolvedLenovo: ALLInvolvedLenovo,
        getDepartmentList: getDepartmentList,
        ShowDepartmentEmployee: ShowDepartmentEmployee,
        LenovoInput: LenovoInput,
        InputSearchLenovo: InputSearchLenovo,
    }


})