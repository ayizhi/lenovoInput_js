define(['jquery','base'],function($){


    //获取所有部门并放入localStorage
    function getDepartment(type,callback){ //type = 1强制获取然后存
        var args = arguments;
        var tCallback;
        var tType;
        if(args.length == 1){
            if(typeof type != 'string' && typeof type != 'number'){
                tCallback = args[0]
                tType = undefined
            }else{
                tType =  args[0];
                tCallback = undefined
            }
        }else if(args.length == 2){
            tType =  args[0];
            tCallback =  args[1]
        }


        var localStorage = window.localStorage;
        var departmentData = JSON.parse(localStorage.getItem('departmentData'));
        if(departmentData && tType != 1){
            if(tCallback){
                tCallback(departmentData)
            }
            return
        }
        $.ajax({
            url:'departments.json',
            type:'POST',
            data:{
                "_csrf": $("meta[name='csrf-token']").attr('content'),
                'format':'tree'
            },
            success:function(reply){
                localStorage.setItem('departmentData',JSON.stringify(reply.data.departments));
                if(tCallback){
                    tCallback(reply.data.department)
                }
            }
        })
    }

    getDepartment(1);

    //=================================================部门联想输入start=====================================================
    function DepartmentLenovo($pa){
        this.$pa = $pa;
        this.tmp = [
            '<div class="lenovo-content">',
                '<ul class="lenovo-list"></ul>',
            '</div>'
        ].join("");
        this.init();

        return this
    }

    DepartmentLenovo.prototype = {
        //初始化
        init: function(){
            var t = this;
            //添加dom
            t.$pa.append($(t.tmp));
            //判断localStore里是否存在
            var localStorage = window.localStorage;
            var departmentData = {};
            if(localStorage.getItem('departmentData') != null){
                t.departmentData = JSON.parse(localStorage.getItem('departmentData'));
                t.appendList();
                t.bindDefaultEvent();
            }else{
                $.ajax({
                    url:'departments.json',
                    type:'POST',
                    data:{
                        "_csrf": $("meta[name='csrf-token']").attr('content'),
                        'format':'tree'
                    },
                    success:function(reply){
                        t.departmentData = reply.data.departments;
                        localStorage.setItem('departmentData',JSON.encode(t.departmentData));
                        t.appendList();
                        t.bindDefaultEvent();

                    }
                })
            }
        },


        //生成联想输入的list
        appendList: function(){
            var t = this;
            var $list = $(t.treeIterator(t.departmentData));
            var $ul = t.$pa.find('.lenovo-content .lenovo-list')
            $ul.append($list);
        },

        //添加默认事件
        bindDefaultEvent:function(){
            var t = this;
            //点击父显示
            t.$pa.click(function(){
                var $self = $(this);
                $self.find('.lenovo-content').slideDown(200);
            })

            //鼠标移开消失
            t.$pa.find('.lenovo-content').on('mouseleave',function(){
                var $self = $(this);
                $self.slideUp(200)
            })
        },


        //迭代器
        treeIterator:function(data){
            var t = this;
            var name = data.name;
            var id = data.id;
            var children = data.children;
            var tmpHtml = ''
            tmpHtml += '<li class="lenovo-li" data-id="' + id + '" data-type="department" title="' + name + '"><p>' + name + '</p><ul>'
            if(children && children.length != 0){
                for(var i=0,len=children.length;i<len;i++){
                    tmpHtml +=  t.treeIterator(children[i])
                }
                return tmpHtml + '</ul></li>'
            }else{
                return '<li class="lenovo-li" data-id="' + id + '" data-type="department"><p>' + name + '</p></li>'
            }
        },


        //添加事件
        bindEvent:function(callback) {
            var t = this;
            if (callback) {
                callback.call(t);
            }
        }
    }
    //=======================================================部门联想输入end====================================================



    //=======================================================员工联想输入start====================================================
    function EmployeeLenovo($pa,excludeIds){
        this.$pa = $pa;
        this.excludeIds = (excludeIds && ( typeof excludeIds === 'string'
            ? excludeIds
            : excludeIds.join(',')
            )) || '';
        this.tmp = [
            '<div class="lenovo-content display-none">',
            '<i class="icon icon-search"></i>',
            '<input type="text" class="lenovo-input" placeholder="请输入员工姓名或手机号">',
            '<ul class="lenovo-list"></ul>',
            '</div>'
        ].join("");
        this.ajaxController = false;
        this.init();

        return this
    }

    EmployeeLenovo.prototype = {
        //初始化
        init: function(){
            var t = this;
            //添加dom
            t.$pa.append($(t.tmp));
            //绑定事件
            t.bindDefaultEvent();

        },

        //添加默认事件
        bindDefaultEvent:function(){
            var t = this;
            //点击父显示
            t.$pa.click(function(){
                var $self = $(this);
                $self.find('.lenovo-content').slideDown(200);
            })

            //鼠标移开消失
            t.$pa.find('.lenovo-content').on('mouseleave',function(){
                var $self = $(this);
                $self.find('.lenovo-list').html("");
                $self.find('input').val("")
                $self.slideUp(200);
            })

            t.$pa.find('.lenovo-content input').keyup(function(){
                var $self = $(this);
                var val = $.trim($self.val())
                if(val === ''){
                    t.$pa.find('.lenovo-list').html("")
                }

                if(t.ajaxController == true){
                    return
                }

                t.ajaxController == true;

                $.ajax({
                    url: 'employee.json',
                    type: 'post',
                    data: {
                        'keyword':val,
                        'exclude':t.excludeIds,
                    },
                    success:function(reply){
                        t.ajaxController = false;
                        if(!reply.status){
                            return
                        }
                        t.appendList(reply.data)
                    }
                })
            })
        },

        //生成员工list
        appendList:function(employeelist){
            var t = this;
            var listHtml = t.listIterator(employeelist)
            t.$pa.find('.lenovo-list').html($(listHtml))
        },

        //迭代器
        listIterator:function(employeelist){
            var listHtml = ''
            for(var i=0,len=employeelist.length;i<len;i++){
                var employee = employeelist[i];
                var id = employee.employeeId;
                var name = employee.name;
                var mobile = employee.mobile;
                listHtml += '<li class="lenovo-li" data-id="' + id + '" data-type="employee" title="' + name + '"><span class="name">' + name + '</span><span class="mobile">' + mobile + '</span></li>'
            }
            return listHtml;
        },

        //绑定事件
        bindEvent:function(callback){
            var t = this;
            if (callback) {
                callback.call(t);
            }
        }
    }



    return{
        DepartmentLenovo:DepartmentLenovo,
        EmployeeLenovo: EmployeeLenovo,
        getDepartment:getDepartment,
    }


})