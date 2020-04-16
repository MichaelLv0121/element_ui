<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
    export default {
        name: "Home",
        methods:{
            //退出登录原理：清空sessionStorage中的token，并手动跳转到 /login 界面
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        }
    }
</script>

<style scoped>

</style>
