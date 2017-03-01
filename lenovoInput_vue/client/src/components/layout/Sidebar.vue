<template>
    <div class="sidebar">
        this is sidebar
        <ul>
            <li><a :class="{ 'router-link-active': type == 'index' }" href="/" data-type="index"> index </a></li>
            <li><a :class="{ 'router-link-active': type == 'insurance' }" href="/insurance.html" data-type="insurance"> insurance </a></li>
        </ul>
    </div>
</template>
<script>
    export default {
        data: function() {
            return {}
        },
        props: ['type']
    }
</script>
<style lang="scss">
    .sidebar {
        width: 150px;
        position: fixed;
        top: 100px;
        left: 0;
        border-right: 1px solid #999;
        height: 100%;
        z-index: 99;
        background-color: grey;
    }
</style>