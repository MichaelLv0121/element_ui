<template>
    <el-container class="home_container">
        <el-header>
            <div class="title">
                <img src="../assets/logo.png" alt="头像">
                <span>电商管理系统</span>
            </div>
            <el-button type="info" @click="logout" round>退出</el-button>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-col :span="12" style="width: 100%">
                    <el-menu
                            class="sideMenu"
                            background-color="#f8f9fa"
                            text-color="#333"
                            active-text-color="#007bff">
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
                            <template slot="title">
                                <i class="el-icon-circle-plus"></i>
                                <span>{{item['authName']}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="subItem.id+''" v-for="subItem in item.children" :key="subItem.id">
                                <template slot="title">
                                    <i class="el-icon-ship"></i>
                                    <span>{{subItem['authName']}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-col>
            </el-aside>
            <el-main>Main</el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menuList: []
            }
        },
        created() {
            //初始化后立刻向后台获取菜单列表
            this.getMenuList()
        },
        methods: {
            //退出登录原理：清空sessionStorage中的token，并手动跳转到 /login 界面
            logout() {
                window.sessionStorage.clear();
                this.$router.push('/login');
            },
            //获取左侧菜单列表
            async getMenuList() {
                const {data: res} = await this.$http.get('menus');
                if (res['meta']['status'] !== 200) return this.$message.error(res['meta']['msg']);
                this.menuList = res['data'];

                console.log(JSON.stringify(this.menuList));
            }
        }
    }
</script>

<style lang="less" scoped>
    .home_container {
        height: 100%;
    }

    .el-header {
        background-color: #343a40;

        > div {
            img {
                max-width: 50px;
                height: auto;
                margin-right: 10px;
                border-radius: 3px;
                box-shadow: 0 0 10px #555555;
            }

            display: flex;
            align-items: center;
            color: white;
        }

        align-items: center;
        display: flex;
        justify-content: space-between;
        padding-left: 10px;
    }

    .el-aside {
        background-color: #f8f9fa;
    }

    .el-main {
        background-color: #ffffff;
    }

    .sideMenu {
        font-weight: 600;
    }

</style>
