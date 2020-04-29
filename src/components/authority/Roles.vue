<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 添加角色按钮区域 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="handleAddRole">添加角色</el-button>
                </el-col>
            </el-row>

            <!-- 角色列表区域 -->
            <el-table :data="roleList" border stripe>
                <!-- 展开栏 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,index1) in scope.row.children"
                                :key="item1.id"
                                :class="['bdBottom',index1===0?'bdTop':'','vCenter']">
                            <!-- 一级权限 -->
                            <el-col :span="5">
                                <el-tag closable
                                        @close="handleDelThirdRightById(scope.row,item1.id)">{{item1['authName']}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 二、三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[index2===0?'':'bdTop','vCenter']"
                                        v-for="(item2,index2) in item1.children"
                                        :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success"
                                                closable
                                                @close="handleDelThirdRightById(scope.row,item2.id)">
                                            {{item2['authName']}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="item3 in item2.children"
                                                :key="item3.id"
                                                closable
                                                @close="handleDelThirdRightById(scope.row,item3.id)">
                                            {{item3['authName']}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引栏 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleEditRole(scope.row)">
                            编辑
                        </el-button>
                        <el-button size="mini" type="danger" icon="el-icon-delete" @click="handleDelRole(scope.row)">
                            删除
                        </el-button>
                        <el-button size="mini" type="info" icon="el-icon-setting"
                                   @click="handleRightsDeliver(scope.row)">分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 分配权限对话框 -->
        <el-dialog
                title="分配权限"
                :visible.sync="rightsDeliverVisible"
                @closed="handleClearDefaultCheckedTree"
                width="50%">
            <span>
                <!-- 树形控件 -->
                <el-tree ref="rightsTree"
                         :data="rightsList"
                         :props="treeProps"
                         show-checkbox
                         default-expand-all
                         node-key="id"
                         :default-checked-keys="defaultCheckedTree"></el-tree>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="rightsDeliverVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSetCheckedTree">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加角色对话框 -->
        <el-dialog
                title="添加角色"
                :visible.sync="addRoleDialogVisible"
                @closed="handleAddRoleDialogClosed"
                width="50%">
            <el-form label-width="80px" :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddRoleSureButton">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑角色对话框 -->
        <el-dialog
                title="编辑角色"
                :visible.sync="editRoleDialogVisible"
                @closed="handleEditRoleDialogClosed"
                width="50%">
            <el-form label-width="80px" :model="editRoleForm" :rules="editRoleFormRules" ref="editRoleFormRef">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEditRoleSureButton">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Roles",
        data() {
            return {
                roleList: [],
                //显示分配权限对话框显示与否
                rightsDeliverVisible: false,
                //权限树数据
                rightsList: [],
                //树形控件绑定的属性
                treeProps: {
                    children: 'children',
                    label: 'authName'
                },
                //默认被选中的tree
                defaultCheckedTree: [],
                //当前行的角色id
                currentLineRoleId: '',
                //“添加角色”对话框显示与否
                addRoleDialogVisible: false,
                //“添加角色”对话框绑定的数据对象
                addRoleForm: {
                    roleName: '',
                    roleDesc: ''
                },
                //“添加角色”对话框表单校验规则
                addRoleFormRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    roleDesc: []
                },
                //“编辑角色”对话框显示与否
                editRoleDialogVisible: false,
                //“编辑角色”对话框绑定的数据对象
                editRoleForm: {},
                //“编辑角色”对话框表单校验规则
                editRoleFormRules: {
                    roleName: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ],
                    roleDesc: []
                },
            }
        },
        created() {
            this.getRoleList();
        },
        methods: {
            //获取角色列表
            async getRoleList() {
                const {data: res} = await this.$http.get('roles');
                if (res['meta']['status'] !== 200) return this.$message.error('获取角色列表失败！');
                this.roleList = res['data'];
            },
            //根据id删除权限
            async handleDelThirdRightById(role, rightId) {
                let flag = await this.$confirm(`是否要删除权限?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (flag !== 'confirm') return;
                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                if (res['meta']['status'] !== 200) return this.$message.error('删除权限失败！');
                this.$message.success('删除权限成功！');
                role['children'] = res['data'];
            },
            //点击“分配权限”按钮
            async handleRightsDeliver(role) {
                //获取当前行的角色id
                this.currentLineRoleId = role.id;
                //获取“权限”数据
                const {data: res} = await this.$http.get('rights/tree');
                if (res['meta']['status'] !== 200) return this.$message.error('获取权限失败！');
                this.rightsList = res['data'];
                //获取“三级权限”的id
                this.getLeafKeys(role, this.defaultCheckedTree);
                this.rightsDeliverVisible = true;
            },
            //通过递归的方法，取出数据中所有的“三级权限”的id
            getLeafKeys(node, arr) {
                if (!node.children) {
                    //说明为“三级权限”
                    arr.push(node.id);
                } else {
                    node.children.forEach(item => this.getLeafKeys(item, arr));
                }
            },
            //关闭“分配权限”对话框时，清除已选中的tree
            handleClearDefaultCheckedTree() {
                this.defaultCheckedTree = [];
            },
            //点击“分配权限”对话框中的“确定”按钮
            async handleSetCheckedTree() {
                //获取被选中和半选中的tree
                let checkedKeys = this.$refs['rightsTree'].getCheckedKeys();
                let halfCheckedKeys = this.$refs['rightsTree'].getHalfCheckedKeys();
                const allCheckedKeys = [...checkedKeys, ...halfCheckedKeys];
                const {data: res} = await this.$http.post(`roles/${this.currentLineRoleId}/rights`, {rids: allCheckedKeys.join(',')});
                if (res['meta']['status'] !== 200) return this.$message.error('分配权限失败!');
                this.$message.success('分配权限成功!');
                this.rightsDeliverVisible = false;
                await this.getRoleList();
            },
            //点击“添加角色”按钮
            handleAddRole() {
                this.addRoleDialogVisible = true;
            },
            //点击“添加角色”对话框“确定”按钮
            handleAddRoleSureButton() {
                this.$refs['addRoleFormRef'].validate(async valid => {
                    if (!valid) {
                        return;
                    }
                    const {data: res} = await this.$http.post('roles', this.addRoleForm);
                    if (res['meta']['status'] !== 201) return this.$message.error('添加角色失败!');
                    this.$message.success('添加角色成功!');
                    this.addRoleDialogVisible = false;
                    await this.getRoleList();
                });
            },
            //“添加角色”对话框关闭时
            handleAddRoleDialogClosed() {
                this.$refs['addRoleFormRef'].resetFields();
            },
            //点击“编辑角色”按钮
            async handleEditRole(role) {
                //先获取要编辑角色的信息
                const {data: res} = await this.$http.get(`roles/${role.id}`);
                if (res['meta']['status'] !== 200) return this.$message.error('获取要编辑的角色失败!');
                this.editRoleForm = res['data'];
                this.editRoleDialogVisible = true;
            },
            //点击“编辑角色”对话框“确定”按钮
            handleEditRoleSureButton() {
                this.$refs['editRoleFormRef'].validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put(`roles/${this.editRoleForm['roleId']}`, {
                        roleName: this.editRoleForm['roleName'],
                        roleDesc: this.editRoleForm['roleDesc']
                    });
                    if (res['meta']['status'] !== 200) return this.$message.error('编辑角色失败!');
                    this.$message.success('编辑角色成功!');
                    this.editRoleDialogVisible = false;
                    await this.getRoleList();
                });
            },
            //“添加角色”对话框关闭时
            handleEditRoleDialogClosed() {
                this.$refs['editRoleFormRef'].resetFields();
            },
            //点击“删除”按钮
            async handleDelRole(role) {
                const flag = await this.$confirm(`是否要删除「${role['roleName']}」?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (flag !== 'confirm') return;
                const {data: res} = await this.$http.delete(`roles/${role['id']}`);
                if (res['meta']['status'] !== 200) return this.$message.error('删除角色失败!');
                this.$message.success('删除角色成功!');
                await this.getRoleList();
            },
        }
    }
</script>

<style lang="less" scoped>
    .el-tag {
        margin: 7px;
    }

    .bdBottom {
        border-bottom: 1px solid #eeeeee;
    }

    .bdTop {
        border-top: 1px solid #eeeeee;
    }

    .vCenter {
        display: flex;
        align-items: center;
    }
</style>
