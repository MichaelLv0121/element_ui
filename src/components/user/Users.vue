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
                    <el-input placeholder="请输入用户名"
                              v-model.trim="searchName"
                              @change="handleSearchName"
                              @clear="getUserList"
                              clearable>
                        <el-button slot="append" icon="el-icon-search"
                                   @click="handleSearchName"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" @click="addUserVisible=true">添加用户</el-button>
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
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" circle
                                       @click="handleOpenEditUserDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                            <el-button type="danger" icon="el-icon-delete" circle
                                       @click="handleDelUser(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                            <el-button type="info" icon="el-icon-setting" circle
                                       @click="handleDeliverRole(scope.row)"></el-button>
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

            <!-- add用户对话框 -->
            <el-dialog
                    title="添加用户"
                    :visible.sync="addUserVisible"
                    @close="handleCloseAddUserDialog('addUserFormRef')"
                    width="50%">
                <el-form :model="addUserForm" :rules="addUserFormRules" ref="addUserFormRef" label-width="70px"
                         status-icon>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="addUserForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addUserForm.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="addUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="addUserForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addUserVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleAddUser('addUserFormRef')">确 定</el-button>
                </span>
            </el-dialog>

            <!-- edit用户对话框 -->
            <el-dialog
                    title="修改用户"
                    :visible.sync="editUserVisible"
                    @closed="handleCloseEditUserDialog('editUserFormRef')"
                    :close-on-click-modal="false"
                    width="50%">
                <el-form :model="editUserForm" :rules="editUserFormRules" ref="editUserFormRef" label-width="70px"
                         status-icon>
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="editUserForm.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input v-model="editUserForm.email"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="mobile">
                        <el-input v-model="editUserForm.mobile"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editUserVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleEditUser('editUserFormRef')">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 分配角色对话框 -->
            <el-dialog
                    title="分配角色"
                    :visible.sync="deliverRoleVisible"
                    @closed="handleCloseDeliverRoleDialog"
                    width="50%">
                <div>
                    <p>当前用户：{{currentLineUserInfo['username']}}</p>
                    <p>当前角色：{{currentLineUserInfo['role_name']}}</p>
                    <el-form label-position="left"
                             :model="setUserForm"
                             :rules="userFormRules"
                             ref="userFormRef"
                             label-width="110px">
                        <el-form-item label="分配新角色：" prop="selectedRoleId">
                            <el-select v-model="setUserForm.selectedRoleId" placeholder="请选择">
                                <el-option
                                        v-for="item in allRoleList"
                                        :key="item['id']"
                                        :label="item['roleName']"
                                        :value="item['id']">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="deliverRoleVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleSetNewRole(currentLineUserInfo)">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Users",
        data() {
            //email校验规则
            let checkEmail = (rule, value, callback) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
                if (regEmail.test(value)) {
                    return callback();
                }
                callback(new Error('请填写合法的邮箱！'));
            }
            //手机号校验规则
            let checkPhoneNum = (rule, value, callback) => {
                const regPhoneNum = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if (regPhoneNum.test(value)) {
                    return callback();
                }
                callback(new Error('请填写合法的手机号！'));
            }
            return {
                searchName: '',
                //查询用户列表所需参数
                queryParam: {
                    query: '',
                    pagenum: 1,
                    pagesize: 5
                },
                userList: [],
                total: 0,
                //add用户对话框的显示与否
                addUserVisible: false,
                //add用户对话框绑定的数据对象
                addUserForm: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                //add用户对话框绑定的数据对象校验规则
                addUserFormRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkPhoneNum, trigger: 'blur'}
                    ]
                },

                //edit用户对话框的显示与否
                editUserVisible: false,
                //edit用户对话框绑定的数据对象
                editUserForm: {},
                //edit用户对话框绑定的数据对象校验规则
                editUserFormRules: {
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkPhoneNum, trigger: 'blur'}
                    ]
                },
                //分配角色对话框显示与否
                deliverRoleVisible: false,
                //当前行的用户信息
                currentLineUserInfo: [],
                //所有可分配的角色
                allRoleList: [],
                //分配角色表单
                setUserForm: {
                    //被选中的角色id
                    selectedRoleId: ''
                },
                //分配角色表单对话框绑定的数据对象校验规则
                userFormRules: {
                    selectedRoleId: [
                        {required: true, message: '请选择角色', trigger: 'change'}
                    ]
                },
            }
        },
        created() {
            this.getUserList();
        },
        methods: {
            //获得用户列表
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.queryParam});
                if (res['meta']['status'] === 200) {
                    //专门用于处理删除某一页（此页页码 >= 2）的最后一条数据时，手动获取前一页的数据
                    if (res['data']['users'].length === 0 && res['data']['pagenum'] > 1) {
                        this.queryParam.pagenum--;
                        await this.getUserList();
                    } else {
                        this.userList = res['data']['users'];
                        this.total = res['data']['total'];
                    }
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
                    newInfo['mg_state'] = !newInfo['mg_state'];
                    return this.$message.error('用户状态修改失败！');
                }
                this.$message.success('用户状态修改成功！');
            },
            //查询用户
            handleSearchName() {
                this.queryParam.query = this.searchName;
                this.getUserList();
            },
            //处理add用户对话框关闭
            handleCloseAddUserDialog(formName) {
                this.$refs[formName].resetFields();
            },
            //点击按钮，添加新用户
            handleAddUser(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post('users', this.addUserForm);
                    if (res['meta']['status'] !== 201) {
                        return this.$message.error('添加用户失败！');
                    }
                    this.$message.success('添加用户成功！');
                    this.addUserVisible = false;
                    await this.getUserList();
                });
            },
            //点击“修改”按钮打开修改用户对话框，并查询此用户的数据
            async handleOpenEditUserDialog(id) {
                const {data: res} = await this.$http.get(`users/${id}`);
                if (res['meta']['status'] !== 200) {
                    this.$message.error('查询此用户信息时出现错误！');
                }
                this.editUserVisible = true;
                this.editUserForm = res['data'];
            },
            //处理edit用户对话框关闭
            handleCloseEditUserDialog(formName) {
                this.$refs[formName].resetFields();
            },
            //点击按钮，修改用户
            handleEditUser(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put(`users/${this.editUserForm.id}`,
                        {
                            id: this.editUserForm.id,
                            email: this.editUserForm.email,
                            mobile: this.editUserForm.mobile
                        });
                    if (res['meta']['status'] !== 200) {
                        return this.$message.error('修改用户失败！');
                    }
                    this.$message.success('修改用户成功！');
                    this.editUserVisible = false;
                    await this.getUserList();
                });
            },
            //点击删除按钮，删除用户
            async handleDelUser(delData) {
                const flag = await this.$confirm(`是否要删除用户 ${delData['username']} ?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                //当$confirm改写为async和await时，“取消”的返回值为字符串'cancel'，“确定”的返回值为字符串'confirm'
                if (flag !== 'confirm') return;
                const {data: res} = await this.$http.delete(`users/${delData['id']}`);
                if (res['meta']['status'] !== 200) {
                    return this.$message.error('删除用户失败！' + res['meta']['msg']);
                }
                this.$message.success('删除用户成功！');
                await this.getUserList();
            },
            //点击“分配角色”按钮
            async handleDeliverRole(role) {
                this.currentLineUserInfo = role;
                //获取所有可分配的角色
                const {data: res} = await this.$http.get('roles');
                if (res['meta']['status'] !== 200) return this.$message.error('获取可分配的角色失败！');
                this.allRoleList = res['data'];
                this.deliverRoleVisible = true;
            },
            //关闭“分配角色”对话框
            handleCloseDeliverRoleDialog() {
                this.$refs['userFormRef'].resetFields();
            },
            //点击“分配角色”对话框“确定”按钮
            handleSetNewRole(role) {
                //表单预验证
                this.$refs['userFormRef'].validate(async (valid) => {
                    if (valid) {
                        const {data: res} = await this.$http.put(`users/${role.id}/role`, {rid: this.setUserForm.selectedRoleId});
                        if (res['meta']['status'] !== 200) return this.$message.error('分配角色失败！' + res['meta']['msg']);
                        this.$message.success('分配角色成功！');
                        this.deliverRoleVisible = false;
                        await this.getUserList();
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
