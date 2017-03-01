<template>
    <div class="container">
        <header-component></header-component>
        <sidebar-component :type="'index'"></sidebar-component>
        <div class="content">
            <Button>abc</Button>
            <ul>
                <li><router-link to="note">note</router-link></li>
                <li><router-link to="home">index</router-link></li>
                <li><router-link to="/try">try</router-link></li>
            </ul>
            <router-view class="view"></router-view>
            {{ name }}
        </div>
        <footer-component></footer-component>
    </div>
</template>
<script>
    import Vue from 'vue';
    import VueResource from 'vue-resource';
    import ElementUI from 'element-ui'
    import { Button, Select } from 'element-ui'
    Vue.use(VueResource);
    Vue.use(ElementUI)

    Vue.component(Button.name, Button)
    Vue.component(Select.name, Select)

    import HeaderComponent from 'components/layout/Header'
    import SidebarComponent from 'components/layout/Sidebar'
    import FooterComponent from 'components/layout/Footer'
    require('assets/css/base.css')


    export default {
        data: function() {
            return {
                name: ''
            }
        },
        components: {
            'header-component': HeaderComponent,
            'sidebar-component': SidebarComponent,
            'footer-component': FooterComponent
        },
        beforeCreate: function() {
            const $this = this
                Vue.http.post('/test/hello').then((response) => {
                    const result = response.data;
                    if(result.status) {
                        $this.name = result.data.name
                    }
                },function (response) {
                    console.log(response)
            })
        },
        methods: {
            getDepartment: function() {
                const $this = this
                Vue.http.post('/test/hello').then((response) => {
                    const result = response.data;
                    if(result.status) {
                        $this.name = result.data.name
                    }
                },function (response) {
                    console.log(response)
                })
            }
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