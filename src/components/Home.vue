<template>
    <el-container class="home_container">
        <!-- 头部区域 -->
        <el-header>
            <div class="title">
                <img src="../assets/logo.png" alt="头像">
                <span>电商管理系统</span>
            </div>
            <el-button type="danger" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 缩放侧边栏按钮 -->
                <div class="collapseBtn" @click="collapseMenu">
                    <i :class="isCollapse?'el-icon-caret-right':'el-icon-caret-left'"></i>
                </div>
                <el-col :span="12" style="width: 100%">
                    <el-menu
                            class="sideMenu"
                            background-color="#f8f9fa"
                            text-color="#333"
                            active-text-color="#007bff"
                            unique-opened
                            router
                            :collapse="isCollapse"
                            :collapse-transition="false">
                        <!-- 一级菜单 -->
                        <el-submenu :index="item.path" v-for="item in menuList" :key="item.id">
                            <template slot="title">
                                <i class="el-icon-circle-plus"></i>
                                <span>{{item['authName']}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
                                <template slot="title">
                                    <i class="el-icon-ship"></i>
                                    <span>{{subItem['authName']}}</span>
                                </template>
                            </el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-col>
            </el-aside>
            <!-- 主要内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                menuList: [],
                isCollapse: false
            }
        },
        created() {
            //初始化后立刻向后台获取菜单列表
            this.getMenuList()
        },
        methods: {
            //退出登录原理：清空sessionStorage中的token，并手动跳转到 /login 界面
            logout() {
                this.$confirm('确定要退出系统吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    window.sessionStorage.clear();
                    this.$router.push('/login');
                }).catch(() => {

                });
            },
            //获取左侧菜单列表
            async getMenuList() {
                const {data: res} = await this.$http.get('menus');
                if (res['meta']['status'] !== 200) return this.$message.error(res['meta']['msg']);
                this.menuList = res['data'];
            },
            //缩放侧边栏菜单
            collapseMenu() {
                this.isCollapse = !this.isCollapse;
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

        .el-menu {
            border-right: 0;
        }
    }

    .el-main {
        background-color: #ffffff;
    }

    .sideMenu {
        font-weight: 600;
    }

    .collapseBtn {
        text-align: center;
        background-color: #c6c6c6;
        font-size: 12px;
        line-height: 17px;
        letter-spacing: 0.1em;
        cursor: pointer;
    }
</style>
