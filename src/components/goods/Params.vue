<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <el-alert
                    title="注意：只允许为第三级分类设置参数！"
                    type="warning"
                    show-icon
                    :closable="false">
            </el-alert>
            <!-- 选择商品分类 -->
            <el-row class="cateSort">
                <el-col>
                    选择商品分类：
                    <el-cascader
                            ref="tree"
                            v-model="selectedAllCate"
                            :options="allCateList"
                            :props="allCateProps"
                            @change="handleChange">
                    </el-cascader>
                </el-col>
            </el-row>
            <!-- Tabs 标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick" type="border-card">
                <el-tab-pane label="动态参数" name="many">
                    <el-button :disabled="isDisable" type="primary" size="mini" @click="handleAddParam">添加参数</el-button>

                    <!-- 动态参数 table -->
                    <el-table
                            :data="manyTableData"
                            stripe
                            border
                            style="width: 100%">

                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环输出的所有标签 -->
                                <transition-group name="el-zoom-in-center">
                                    <el-tag closable
                                            v-for="(item,index) in scope.row['attr_vals']"
                                            @close="handleTagClose(scope.row,index)"
                                            :key="index">{{item}}
                                    </el-tag>
                                </transition-group>
                                <!-- + 新标签 input -->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model.trim="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- + 新标签 button -->
                                <el-button v-else class="button-new-tag" size="small"
                                           @click="showInput(scope.row)">+ 新标签
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引行 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                           @click="handleEditParam(scope.row)">编辑
                                </el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                           @click="handleDelParam(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="静态属性" name="only">
                    <el-button :disabled="isDisable" type="primary" size="mini" @click="handleAddParam">添加属性</el-button>
                    <!-- 静态属性 table -->
                    <el-table
                            :data="onlyTableData"
                            stripe
                            border
                            style="width: 100%">

                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <!-- 循环输出的所有标签 -->
                                <el-tag closable
                                        v-for="(item,index) in scope.row['attr_vals']"
                                        @close="handleTagClose(scope.row,index)"
                                        :key="index">{{item}}
                                </el-tag>
                                <!-- + 新标签 input -->
                                <el-input
                                        class="input-new-tag"
                                        v-if="scope.row.inputVisible"
                                        v-model.trim="scope.row.inputValue"
                                        ref="saveTagInput"
                                        size="small"
                                        @keyup.enter.native="handleInputConfirm(scope.row)"
                                        @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <!-- + 新标签 button -->
                                <el-button v-else class="button-new-tag" size="small"
                                           @click="showInput(scope.row)">+ 新标签
                                </el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引行 -->
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column
                                prop="attr_name"
                                label="参数名称">
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" icon="el-icon-edit"
                                           @click="handleEditParam(scope.row)">编辑
                                </el-button>
                                <el-button type="danger" size="mini" icon="el-icon-delete"
                                           @click="handleDelParam(scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--  添加“动态参数”和“静态属性”公用的对话框 -->
        <el-dialog
                :title="'添加'+title"
                :visible.sync="addParamDialogVisible"
                @closed="handleAddParamDialogClosed('addParamFormRef')"
                width="50%">
            <el-form :model="addParamForm" :rules="addParamFormRules" ref="addParamFormRef" label-width="100px">
                <el-form-item :label="title" prop="param">
                    <el-input v-model.trim="addParamForm.param"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleClickAddParamDialog('addParamFormRef')">确 定</el-button>
            </span>
        </el-dialog>

        <!--  编辑“动态参数”和“静态属性”公用的对话框 -->
        <el-dialog
                :title="'编辑'+title"
                :visible.sync="editParamDialogVisible"
                @closed="handleEditParamDialogClosed('editParamFormRef')"
                width="50%">
            <el-form :model="editParamForm" :rules="editParamFormRules" ref="editParamFormRef" label-width="100px">
                <el-form-item :label="title" prop="param">
                    <el-input v-model.trim="editParamForm.param"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleClickEditParamDialog('editParamFormRef')">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    export default {
        name: "Params",
        data() {
            return {
                //所有的商品分类
                allCateList: [],
                //被选中的商品分类id
                selectedAllCate: [],
                //所有商品级联框的属性
                allCateProps: {
                    expandTrigger: 'hover',
                    label: 'cat_name',
                    value: 'cat_id'
                },
                //显示某个tab的绑定值
                activeName: 'many',
                //“动态参数”table的数据
                manyTableData: [],
                //“静态”table的数据
                onlyTableData: [],
                //添加“动态参数”和“静态属性”公用的对话框的显示与否
                addParamDialogVisible: false,
                //添加“动态参数”和“静态属性”公用表单绑定的模型数据对象
                addParamForm: {
                    param: ''
                },
                //添加“动态参数”和“静态属性”公用表单绑定的模型数据对象验证
                addParamFormRules: {
                    param: [
                        {required: true, message: '请输入参数', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ]
                },
                //编辑“动态参数”和“静态属性”公用的对话框的显示与否
                editParamDialogVisible: false,
                //编辑“动态参数”和“静态属性”公用表单绑定的模型数据对象
                editParamForm: {
                    param: ''
                },
                //编辑“动态参数”和“静态属性”公用表单绑定的模型数据对象验证
                editParamFormRules: {
                    param: [
                        {required: true, message: '请输入参数', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ]
                },
                //当前行的参数id
                currentLineParamId: [],
                //当前行的标签
                currentLineTags: ''
            };
        },
        created() {
            this.getAllCateList();
        },
        methods: {
            //获取三级商品分类数据列表
            async getAllCateList() {
                const {data: res} = await this.$http.get('categories');
                if (res['meta']['status'] !== 200) return this.$message.error('获取商品分类数据失败！');
                this.allCateList = res['data'];
            },
            //“选择商品分类”级联选择变化时
            handleChange() {
                this.getParameters();
            },
            //点击tabs触发的函数
            handleTabClick() {
                this.getParameters();
            },
            //获取动态参数或静态属性
            async getParameters() {
                if (this.selectedAllCate.length !== 3) {
                    this.manyTableData = [];
                    this.onlyTableData = [];
                    return this.selectedAllCate = [];
                }
                const {data: res} = await this.$http.get(`categories/${this.thirdSortParam}/attributes`, {
                    params: {sel: this.activeName}
                });
                if (res['meta']['status'] !== 200) return this.$message.error('商品数据失败！');
                res['data'].forEach(item => {
                    item['attr_vals'] = item['attr_vals'] ? item['attr_vals'].split(' ') : [];
                    item.inputVisible = false;
                    item.inputValue = '';
                });

                if (this.activeName === 'many') {
                    this.manyTableData = res['data'];
                } else {
                    this.onlyTableData = res['data'];
                }
            },
            //“动态参数”or“静态属性”点击“添加参数”按钮
            handleAddParam() {
                this.addParamDialogVisible = true;
            },
            //添加对话框关闭触发的函数
            handleAddParamDialogClosed(formName) {
                this.$refs[formName].resetFields();
            },
            //点击添加对话框的“确定”按钮
            handleClickAddParamDialog(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.post(`categories/${this.thirdSortParam}/attributes`, {
                        attr_name: this.addParamForm.param,
                        attr_sel: this.activeName
                    });
                    if (res['meta']['status'] !== 201) return this.$message.error('添加失败！');
                    this.$message.success('添加成功！');
                    this.addParamDialogVisible = false;
                    await this.getParameters();
                });
            },
            //点击“编辑”按钮
            async handleEditParam(row) {
                this.currentLineParamId = row['attr_id'];
                this.currentLineTags = row['attr_vals'].join(' ');
                const {data: res} = await this.$http.get(`categories/${this.thirdSortParam}/attributes/${row['attr_id']}`,
                    {params: {attr_sel: this.activeName}});
                if (res['meta']['status'] !== 200) return this.$message.error('查询此参数数据失败！');
                this.editParamForm.param = res['data']['attr_name']
                this.editParamDialogVisible = true;
            },
            //编辑对话框关闭触发的函数
            handleEditParamDialogClosed(formName) {
                this.$refs[formName].resetFields();
            },
            //点击编辑对话框的“确定”按钮
            handleClickEditParamDialog(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put(`categories/${this.thirdSortParam}/attributes/${this.currentLineParamId}`,
                        {
                            attr_name: this.editParamForm.param,
                            attr_sel: this.activeName,
                            attr_vals: this.currentLineTags
                        });
                    if (res['meta']['status'] !== 200) return this.$message.error('编辑失败！');
                    this.$message.success('编辑成功！');
                    this.editParamDialogVisible = false;
                    await this.getParameters();
                });
            },
            //点击“删除”按钮
            async handleDelParam(row) {
                const flag = await this.$confirm(`是否要删除 「${row['attr_name']}」?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (flag !== 'confirm') return;
                const {data: res} = await this.$http.delete(`categories/${this.thirdSortParam}/attributes/${row['attr_id']}`);
                if (res['meta']['status'] !== 200) return this.$message.error('删除失败！');
                this.$message.success('删除成功！');
                await this.getParameters();
            },
            //new tag中的input失去焦点或按下回车触发的事件
            async handleInputConfirm(row) {
                if (row.inputValue.length > 0) {
                    //数组的浅拷贝
                    const attrVal = row.attr_vals.slice(0);
                    attrVal.push(row.inputValue);
                    const {data: res} = await this.$http.put(`categories/${this.thirdSortParam}/attributes/${row['attr_id']}`, {
                        attr_name: row.attr_name,
                        attr_sel: row.attr_sel,
                        attr_vals: attrVal.join(' ')
                    });
                    if (res['meta']['status'] !== 200) return this.$message.error('添加标签失败！');
                    this.$message.success('添加标签成功！');
                    row.attr_vals.push(row.inputValue);
                    row.inputValue = '';
                    row.inputVisible = false;
                } else {
                    row.inputValue = '';
                    row.inputVisible = false;
                }
            },
            //new tag中的button的点击事件
            showInput(row) {
                row.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            //删除tag触发的事件
            async handleTagClose(row, index) {
                row.attr_vals.splice(index, 1);
                const {data: res} = await this.$http.put(`categories/${this.thirdSortParam}/attributes/${row['attr_id']}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                });
                if (res['meta']['status'] !== 200) return this.$message.error('删除标签失败！');
                this.$message.success('删除标签成功！');
                row.inputValue = '';
                row.inputVisible = false;
            },
        },
        computed: {
            //tabs中的按钮是否禁用
            isDisable() {
                return this.selectedAllCate.length !== 3;
            },
            //“动态参数”or“静态属性”显示值
            title() {
                return this.activeName === 'many' ? '动态参数' : '静态属性';
            },
            //被选中的第三级分类商品的id
            thirdSortParam() {
                return this.selectedAllCate[this.selectedAllCate.length - 1];
            }
        }
    }
</script>

<style lang="less" scoped>
    .cateSort {
        margin: 20px 0;
    }

    .el-tag {
        margin: 10px 5px;
    }

    .button-new-tag {
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 5px;
    }

    .input-new-tag {
        width: 100px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-left: 5px;
    }
</style>
