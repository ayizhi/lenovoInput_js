<template>
    <el-form ref="employeeDetail" :model="employeeDetail" :rules="rules" label-width="100px">
        <el-form-item label="员工姓名" prop="name">
        <el-col :span="8">
            <el-input v-model="employeeDetail.name" placeholder="请输入员工姓名"></el-input>
        </el-col>
        </el-form-item>
        
        <el-form-item label="聘用形势" required>
            <el-col :span="6">
                <el-form-item prop="hireType">
                    <el-select v-model="employeeDetail.hireType">
                        <el-option v-for="item in employeeDetail.hireTypeOptions" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-form-item>

       <!-- 
       <el-form-item label="员工联想输入">
            <el-col :span="8">
                <el-button icon="plus" type="primary"></el-button>
                <lenovo-input lenovoType="employee" :lenovoVisible="isEmployeeLenovoVisible" ></lenovo-input>
            </el-col>
        </el-form-item>

        <el-form-item label="员工联想输入">
            <el-col :span="8">
                <el-button icon="plus" type="primary"></el-button>
                <lenovo-input lenovoType="employee" :lenovoVisible="isEmployeeLenovoVisible" ></lenovo-input>
            </el-col>
        </el-form-item>

        <el-form-item label="部门联想输入">
            <el-col :span="8">
                <el-button icon="plus" type="primary"></el-button>
                <lenovo-input lenovoType="department" :lenovoVisible="isDepartmentLenovoVisible" ></lenovo-input>
            </el-col>
        </el-form-item>
        -->

        <el-form-item label="员工和部门联想">
            <el-col :span="8">
                <lenovo-input 
                lenovoType="all" 
                :lenovoVisible="isBothLenovoVisible"
                :singleSelect="false"
                @siblingLenovoOpen="isBothLenovoVisible=true"
                @afterSelectLenovoLi="afterSelectLenovoLi" 
                @afterSelectEmployee="afterSelectEmployee">
                    <el-button slot="fire-lenovo" icon="plus" type="primary"></el-button>
                </lenovo-input>
            </el-col>
        </el-form-item>
   

        <el-form-item label="活动时间">
            <el-col :span="8">
                <el-form-item>
                    <el-date-picker v-model="employeeDetail.regularDate" type="date" placehoder="选择日期"></el-date-picker>
                </el-form-item>
            </el-col>
        </el-form-item>
        <el-form-item label="员工照片">
            <el-col :span="6">
                <el-form-item :error="uploadError" :show-message="true">
                     <el-upload
                        action="//jsonplaceholder.typicode.com/posts/"
                        type="drag"
                        :thumbnail-mode="true"
                        :default-file-list="employeePicList"
                        :on-success="handlerOnSuccess"
                        :on-preview="handlePreview"
                        >
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                </el-form-item>
               
            </el-col>
            
        </el-form-item>

        

        <el-form-item>
            <el-button type="primary" @click="submitForm('employeeDetail')">提交</el-button>
        </el-form-item>


        

        <el-dialog title="图片裁剪" v-model="dialogTableVisible"  @open="cropImgDialogOpen" >
            
            <div class="image-container">
                <img id="crop-image" :src="employeeDetail.employeePic && employeeDetail.employeePic.fileUrl" />
            </div>
            <div slot="title">alallalala</div>


            <div slot="footer">
                <el-button class="confirm" type="primary" @click="submitCropImage" :loading="dialogLoading">确认</el-button>
                <el-button class="confirm" @click="submitCropImage" >取消</el-button>      
            </div>
        </el-dialog>

    </el-form>


 



</template>
<script>
    import Vue from 'vue';
    import Vuex from 'vuex';
    import {mapGetters} from 'vuex'
    import ElementUI from 'element-ui'
    import 'element-ui/lib/theme-default/index.css'
    
    import * as Verify from 'components/verify'
    import Cropper from 'cropperjs'
    import 'cropperjs/dist/cropper.css'
    import 'assets/img/lala.png'
    import LenovoInput from 'components/lenovoInput/index'




    export default {

        data(){       
            const checkRequiredHireType = (rule,value,callback) => {
                if(value == -1){
                    return callback(new Error('不能为空'))
                }
            };
            return{
                employeeDetail: {},
                rules:{
                    name: [
                        Verify.required,
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    hireType: [
                        // Verify.required,
                        { validator: checkRequiredHireType, trigger: 'change'}

                    ]
                },
                uploadError: '',
                dialogTableVisible: false,
                dialogLoading: false,

                //联想输入
                isEmployeeLenovoVisible: false,
                isDepartmentLenovoVisible: false,
                isBothLenovoVisible: false

            } 
        },
        watch: {
            // '$route': 'getEmployeeDetail'
        },

        computed: {
            // ...mapGetters({
            //     employeeDetail:'employeeDetail',
            // })

            employeePicList(){
                let employeeDetail = this.employeeDetail
                let fileName = employeeDetail.employeePic ? employeeDetail.employeePic.fileName : ''
                let fileUrl = employeeDetail.employeePic ? employeeDetail.employeePic.fileUrl : ''
                let fileList = employeeDetail.employeePic ? [{name: fileName, url: fileUrl}] : []
                return fileList
            }
        },
        methods: {
    
            //联想输入选择
            afterSelectLenovoLi(type,id,name){
                console.log(type,id,name,'=================detail')
            },

            //联想输入选择员工
            afterSelectEmployee(employeeList){
                console.log(employeeList,'==================detail')
            },

            submitCropImage(){
                this.dialogLoading = true;
            },

            cropImgDialogOpen(){
                this.$nextTick(function(){
                    var img = document.getElementById('crop-image')   
                    var cropper = new Cropper(img,{
                    aspectRatio: 1,
                    viewMode: 0,
                    autoCropArea: 0.7,
                    ready(){
                        var t = this;
                        t.cropper.setCropBoxData({
                            width: '400px',
                            height: '300px'
                        })
                    },
                    crop: function(e) {
                        console.log(e.detail.x);
                        console.log(e.detail.y);
                        console.log(e.detail.width);
                        console.log(e.detail.height);
                        console.log(e.detail.rotate);
                        console.log(e.detail.scaleX);
                        console.log(e.detail.scaleY);
                    },
                    
                    })

                    cropper.scaleX = 0.5

                })

              
                            
            },
        
            test: function(event, selection, coordinates) {
                this.coords = coordinates;

            },

            handleRemove(file, fileList) {

            },

            handlePreview(file) {
                let name = file.name;
                let url = file.url;
                let uid = file.uid;
                this.dialogTableVisible = true;
            },

            handlerBeforeUpload(res,file,fileList){
            },

            handlerOnSuccess(res,file,fileList){
                this.employeeDetail.employeePic = {
                    fileUrl: file.url,
                    fileId: file.uid,
                    fileName: file.name,
                }
                this.dialogTableVisible = true;
                
                
            },

            submitForm(formName){
                this.$refs[formName].validate((valid) => {
                    if(valid){
                        alert('submit')
                    }
                })
            },

        },
        components: {
            'lenovo-input': LenovoInput
        },

        activated(){
            const t = this;
            const getEmployeeDetail = function(){
                return new Promise((resolve,reject) => {
                    Vue.http.get('/insurance/employeeDetail').then(function(reply){
                        var data = reply.body.data
                        resolve(data)
                    })
                })
            }

            getEmployeeDetail().then(function(data){
                t.employeeDetail = data
            })
        }
    }

</script>
<style lang="scss">
    .el-dialog{
        .image-container{
            width: 500px;
            text-align: center;
            margin: auto
        }
        footer{
            margin: 20px 0 0 0;
            text-align: center;
        }
        img{
            max-width: 500px;
            max-height: 400px;
        }
    }
</style>