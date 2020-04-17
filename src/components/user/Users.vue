<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-input v-model="searchName" placeholder="请输入用户名">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary">添加用户</el-button>
                </el-col>
            </el-row>

            <!-- 用户列表 -->
            <el-table :data="userList" style="width: 100%" stripe border>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row['mg_state']"
                                @change="userStatusChange(scope.row)"
                                active-color="#13ce66">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <!--                        {{scope.row}}-->

                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="info" icon="el-icon-setting" circle></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParam.pagenum"
                    :page-sizes="[1,2,5,10]"
                    :page-size="queryParam.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            return {
                searchName: '',
                //查询用户列表所需参数
                queryParam: {
                    query: '',
                    pagenum: 1,
                    pagesize: 1
                },
                userList: [],
                total: 0
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryParam});
                if (res['meta']['status'] === 200) {
                    this.userList = res['data']['users'];
                    this.total = res['data']['total'];
                } else {
                    this.$message.error('获取用户列表失败');
                }
            },
            //每页条数
            handleSizeChange(size) {
                this.queryParam.pagesize = size;
                this.getUserList();
            },
            //当前页改变
            handleCurrentChange(newPage) {
                this.queryParam.pagenum = newPage;
                this.getUserList();
            },
            //用户状态改变
            async userStatusChange(newInfo) {
                const {data: res} = await this.$http.put(`users/${newInfo['id']}/state/${newInfo['mg_state']}`);
                if (res['meta']['status'] !== 200) {
                    return this.$message.error('用户状态修改失败！');
                }
                this.$message.success('用户状态修改成功！');
            }
        }
    }
</script>

<style scoped>

</style>
