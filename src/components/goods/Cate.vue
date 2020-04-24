<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button type="primary" @click="handleAddCate">添加分类</el-button>
                </el-col>
            </el-row>

            <!-- 商品分类table -->
            <tree-table class="treeTable"
                        :data="cateList"
                        :columns="columns"
                        :selection-type="false"
                        :expand-type="false"
                        show-index
                        index-text
                        border>
                <!-- 是否有效 -->
                <template slot="isOk" slot-scope="scope">
                    <i v-if="scope.row['cat_deleted']" class="el-icon-success" style="color: green"></i>
                    <i v-else class="el-icon-error" style="color: red"></i>
                </template>

                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row['cat_level']===0">一级</el-tag>
                    <el-tag v-else-if="scope.row['cat_level']===1" type="success">二级</el-tag>
                    <el-tag v-else type="danger">三级</el-tag>
                </template>

                <!-- 操作 -->
                <template slot="operation" slot-scope="scope">
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEditCate(scope.row)">编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDelCate(scope.row)">删除
                    </el-button>
                </template>
            </tree-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParam.pagenum"
                    :page-sizes="[3, 5, 10, 15]"
                    :page-size="queryParam.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

            <!-- 添加分类的对话框 -->
            <el-dialog
                    title="添加分类"
                    :visible.sync="addCateVisible"
                    @closed="handleAddCateClosed('addCateFormRef')"
                    :close-on-click-modal="false"
                    width="50%">
                <!-- 添加分类的表单 -->
                <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="addCateForm.cat_name"></el-input>
                    </el-form-item>
                    <el-form-item label="父级分类：">
                        <!-- options为源数据 -->
                        <el-cascader
                                :props="parentProps"
                                v-model="selectedCate"
                                :options="parentList"
                                @change="handleParentCateChange"
                                @getCheckedNodes="true"
                                clearable>
                        </el-cascader>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addCateVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClickAddCateButton('addCateFormRef')">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 编辑分类的对话框 -->
            <el-dialog
                    title="修改分类"
                    :visible.sync="editCateVisible"
                    @closed="handleEditCateClosed('editCateFormRef')"
                    :close-on-click-modal="false"
                    width="50%">
                <!-- 添加分类的表单 -->
                <el-form :model="editCateForm" :rules="editCateFormRules" ref="editCateFormRef" label-width="100px">
                    <el-form-item label="分类名称：" prop="cat_name">
                        <el-input v-model="editCateForm.cat_name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editCateVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClickEditCateButton('editCateFormRef')">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "cate",
        data() {
            return {
                queryParam: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 5
                },
                //商品分类列表
                cateList: [],
                //商品分类总条数
                total: 0,
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        label: '是否有效',
                        //表示将当前列定义为模板列
                        type: 'template',
                        //表示当前这一列使用的模板名称
                        template: 'isOk'
                    },
                    {
                        label: '排序',
                        //表示将当前列定义为模板列
                        type: 'template',
                        //表示当前这一列使用的模板名称
                        template: 'order'
                    },
                    {
                        label: '操作',
                        //表示将当前列定义为模板列
                        type: 'template',
                        //表示当前这一列使用的模板名称
                        template: 'operation'
                    },
                ],
                //添加分类的对话框显示与否
                addCateVisible: false,
                //添加分类绑定的数据对象
                addCateForm: {
                    //分类父 ID
                    cat_pid: 0,
                    //分类名称
                    cat_name: '',
                    //分类层级
                    cat_level: 0
                },
                //添加分类绑定的数据对象校验
                addCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                },
                //父级分类数据
                parentList: [],
                //父级分类绑定的数据
                parentProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                    checkStrictly: true
                },
                //被选中的父级分类
                selectedCate: [],

                //编辑分类的对话框显示与否
                editCateVisible: false,
                //编辑分类绑定的数据对象
                editCateForm: {
                    cat_name: '',
                    cat_id: 0
                },
                //编辑分类绑定的数据对象校验
                editCateFormRules: {
                    cat_name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ]
                },
            };
        },
        created() {
            this.getCateList();
        },
        methods: {
            //获取商品分类列表
            async getCateList() {
                const {data: res} = await this.$http.get('categories', {params: this.queryParam});
                if (res['meta']['status'] !== 200) return this.$message.error('获取商品分类列表失败！');
                this.cateList = res['data']['result'];
                this.total = res['data']['total'];
            },
            //监听每页条数变化
            handleSizeChange(newNum) {
                this.queryParam.pagesize = newNum;
                this.getCateList();
            },
            //监听当前页变化
            handleCurrentChange(newCurrent) {
                this.queryParam.pagenum = newCurrent;
                this.getCateList();
            },
            //点击“添加分类”按钮
            handleAddCate() {
                //先获取“父级分类”中的数据
                this.getParentCateList()
                this.addCateVisible = true;
            },
            //获取“父级分类”中的数据
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {params: {type: 2}});
                if (res['meta']['status'] !== 200) return this.$message.error('获取父级分类失败！');
                this.parentList = res['data'];
            },
            //关闭添加分类对话框
            handleAddCateClosed(formName) {
                this.selectedCate = [];
                this.$refs[formName].resetFields();
                this.addCateForm.cat_pid = 0;
                this.addCateForm.cat_level = 0;
            },
            //“父级分类”选择框变化时
            handleParentCateChange() {
                if (this.selectedCate.length > 0) {
                    this.addCateForm.cat_pid = this.selectedCate[this.selectedCate.length - 1];
                    this.addCateForm.cat_level = this.selectedCate.length;
                } else {
                    this.addCateForm.cat_pid = 0;
                    this.addCateForm.cat_level = 0;
                }
            },
            //点击“添加分类对话框”确定按钮
            handleClickAddCateButton(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    //去除添加分类的前后空格
                    this.addCateForm.cat_name = this.addCateForm.cat_name.trim();
                    const {data: res} = await this.$http.post('categories', this.addCateForm);
                    if (res['meta']['status'] !== 201) return this.$message.error('添加分类失败！');
                    this.$message.success('添加分类成功！');
                    this.addCateVisible = false;
                    await this.getCateList();
                });
            },
            //点击“编辑”按钮
            async handleEditCate(cate) {
                const {data: res} = await this.$http.get(`categories/${cate['cat_id']}`);
                if (res['meta']['status'] !== 200) return this.$message.error('获取要编辑的分类失败！');
                this.editCateForm.cat_id = res['data']['cat_id'];
                this.editCateForm.cat_name = res['data']['cat_name'];
                this.editCateVisible = true;
            },
            //点击“编辑分类对话框”确定按钮
            handleClickEditCateButton(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return;
                    const {data: res} = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {
                        cat_name: this.editCateForm.cat_name.trim()
                    });
                    if (res['meta']['status'] !== 200) return this.$message.error('修改分类失败！');
                    this.$message.success('修改分类成功！');
                    this.editCateVisible = false;
                    await this.getCateList();
                });
            },
            //关闭编辑分类对话框
            handleEditCateClosed(formName) {
                this.$refs[formName].resetFields();
            },
            //点击“删除”按钮
            async handleDelCate(cate) {
                const flag = await this.$confirm(`是否要删除「${cate['cat_name']}」?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (flag !== 'confirm') return;
                const {data: res} = await this.$http.delete(`categories/${cate['cat_id']}`);
                if (res['meta']['status'] !== 200) return this.$message.error('删除分类失败！');
                this.$message.success(`「${cate['cat_name']}」删除成功！`);
                await this.getCateList();
            },
        },

    }
</script>

<style lang="less" scoped>
    .treeTable {
        margin-top: 20px;
    }

    .el-cascader {
        width: 100%;
    }
</style>
