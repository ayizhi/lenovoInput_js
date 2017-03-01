
<template>

        <div class="container">
            <header-component></header-component>
            <sidebar-component :type="'insurance'"></sidebar-component>
            <div class="content">
            
                <el-table :data="getTableData" style="width: 100%" :default-sort="{prop: 'date', order: 'descending'}" @row-click="rowClick">
                    <el-table-column
                        prop="index"
                        label="序号"
                        sortable
                        :formatter="indexFormatter"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="name"
                        label="姓名"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="手机号"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="departmentName"
                        label="部门"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="entryTime"
                        label="入职时间"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="entryTime"
                        label="入职时间"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="dismissionTime"
                        label="离职时间"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="socialInsuranceCityName"
                        label="社保城市"
                        sortable
                        :formatter="socialInsuranceCityNameFormatter"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="houseFundCityName"
                        label="公积金城市"
                        sortable
                        :formatter="houseFundCityNameFormatter"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="socialInsuranceBase"
                        label="社保基数"
                        sortable
                    >
                    </el-table-column>
                    <el-table-column
                        prop="houseFundBase"
                        label="公积金基数"
                        sortable
                    >
                    </el-table-column>
                </el-table>
            </div>
            <footer-component></footer-component>
        </div>
</template>
    </keep-alive>

<script>
    import Vue from 'vue'
    import {mapGetters} from 'vuex'
    import HeaderComponent from 'components/layout/Header'
    import SidebarComponent from 'components/layout/Sidebar'
    import FooterComponent from 'components/layout/Footer'
    import ElementUI from 'element-ui'
    import 'element-ui/lib/theme-default/index.css'
    
    

    Vue.use(ElementUI)


    export default {
        created(){
            var t = this;
            async function getDataAndSetNowShow(){
                await t.$store.dispatch('getDataAndSaveIntoState');                
                await t.$store.dispatch('setDataForNowShow',{pageNum: 0});
            }
            getDataAndSetNowShow()

        },
      
        computed: {
            ...mapGetters({
                'getTableData': 'getNowTableData'
             })
        },
        methods: {
           
            formatter(row, column) {
                return row.date;
            },
            socialInsuranceCityNameFormatter(row,column){
                return row.socialInsuranceCityName.province;
            },
            houseFundCityNameFormatter(row,column){
                return row.houseFundCityName.province;
            },
            indexFormatter(row,column){
                return row.index;
            },
            rowClick(row, event, column){
                var employeeId = row.employeeId;
                var e = event;
                var employeeId = row.employeeId
                this.$store.dispatch('setSelectedEmployeeId',{employeeId: employeeId})
                this.$router.push({path: '/detail'})
            },
            
            
        },

        components: {
            'header-component': HeaderComponent,
            'sidebar-component': SidebarComponent,
            'footer-component': FooterComponent
        }
    }
</script>
<style lang="scss">
.container {
    a {
        color: #45b6af;
        border-radius: 4px;
        padding: 0 10px;
        &.router-link-active {
            background-color: #eeeeee;
        }
    }
    .content {
        padding: 20px;
        margin-left: 150px;
        margin-top: 100px;
        position: relative;
    }
}
</style>