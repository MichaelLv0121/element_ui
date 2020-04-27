<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <el-alert
                    title="消息提示的文案"
                    :closable="false"
                    show-icon
                    center
                    type="info">
            </el-alert>

            <!-- 步骤条 -->
            <el-steps :space="300"
                      :active="Number(stepIndex)"
                      align-center
                      finish-status="success">
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <!-- 表单信息 -->
            <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-position="left">
                <!-- 菜单栏 -->
                <el-tabs :tab-position="'left'"
                         v-model="stepIndex"
                         :before-leave="tabsBeforeLeave"
                         @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model.trim="addGoodsForm.goods_name" style="width: 50%"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addGoodsForm.goods_price" style="width: 50%"
                                      type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addGoodsForm.goods_weight" style="width: 50%"
                                      type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addGoodsForm.goods_number" style="width: 50%"
                                      type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader
                                    v-model="addGoodsForm.goods_cat"
                                    :options="cateList"
                                    @change="handleCascaderChange"
                                    :props="cateProps">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item['attr_name']" v-for="(item,index) in manyCateParamData" :key="index">
                            <el-checkbox-group v-model="item['attr_vals']">
                                <el-checkbox :label="boxItem" v-for="(boxItem,i) in item['attr_vals']" :key="i" border>
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item['attr_name']" v-for="(item) in onlyCateParamData"
                                      :key="item['attr_id']">
                            <el-input v-model="item['attr_vals']"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                                :action="uploadUrl"
                                :headers="uploadHeaders"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :file-list="fileList"
                                :on-success="uploadSuccess"
                                list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本组件 -->
                        <quill-editor v-model="addGoodsForm.goods_introduce"></quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="addCateBtn"
                                   @click="handleClickAddCateButton('addGoodsFormRef')">添加商品
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>

            <!-- 图片预览对话框 -->
            <el-dialog
                    title="图片预览"
                    :visible.sync="picVisible"
                    width="50%">
                <img :src="imgSrc" alt="图片预览" class="pic">
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    //导入lodash库
    import _ from 'lodash';

    export default {
        name: "Add",
        data() {
            return {
                //步骤当前的索引
                stepIndex: '0',
                //表单绑定的数据对象
                addGoodsForm: {
                    //商品名称
                    goods_name: '',
                    //商品价格
                    goods_price: 0,
                    //商品重量
                    goods_weight: 0,
                    //商品数量
                    goods_number: 0,
                    //商品分类被选中的值
                    goods_cat: [],
                    //上传的图片临时路径数组
                    pics: [],
                    //富文本输入的内容
                    goods_introduce: '',
                    //商品的参数（数组），包含 `动态参数` 和 `静态属性`
                    attrs: []
                },
                //表单绑定的数据对象校验
                addGoodsFormRules: {
                    //商品名称
                    goods_name: [
                        {required: true, message: '请输入商品名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    //商品价格
                    goods_price: [
                        {required: true, message: '请输入商品价格', trigger: 'blur'},
                    ],
                    //商品重量
                    goods_weight: [
                        {required: true, message: '请输入商品重量', trigger: 'blur'},
                    ],
                    //商品数量
                    goods_number: [
                        {required: true, message: '请输入商品数量', trigger: 'blur'},
                    ],
                    //商品分类被选中的值
                    goods_cat: [
                        {required: true, message: '请选择商品分类', trigger: 'blur'},
                    ],
                },
                //所有商品分类数据列表
                cateList: [],
                //级联选择框属性配置
                cateProps: {
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                //商品参数数据
                manyCateParamData: [],
                //商品属性数据
                onlyCateParamData: [],
                //图片上传的地址
                uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
                //将要上传的文件列表
                fileList: [],
                //图片上传的请求头
                uploadHeaders: {
                    Authorization: window.sessionStorage.getItem('token')
                },
                //预览图片对话框的显示与否
                picVisible: false,
                //预览图片的路径
                imgSrc: ''
            }
        },
        created() {
            this.getAddCateList();
        },
        methods: {
            //获取所有商品分类数据列表
            async getAddCateList() {
                const {data: res} = await this.$http.get('categories');
                if (res['meta']['status'] !== 200) return this.$message.error('获取商品分类数据级联选择数据失败！');
                this.cateList = res['data'];
            },
            //级联选择框变化时触发的事件
            handleCascaderChange() {
                if (this.addGoodsForm.goods_cat.length !== 3) return this.addGoodsForm.goods_cat = [];
            },
            //tabs离开前后触发的事件
            tabsBeforeLeave(activeName, oldActiveName) {
                if (oldActiveName === '0' && this.addGoodsForm.goods_cat.length !== 3) {
                    this.$message.error('请先选择商品分类！');
                    return false;
                }
            },
            //tabs被点击
            async tabClicked() {
                switch (Number(this.stepIndex)) {
                    case 1:  //获取商品参数数据
                        const {data: manyRes} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                            params:
                                {sel: 'many'}
                        });
                        if (manyRes['meta']['status'] !== 200) return this.$message.error('商品参数获取失败！');
                        manyRes['data'].forEach(item => {
                            item['attr_vals'] = item['attr_vals'] ? item['attr_vals'].split(' ') : [];
                        })
                        this.manyCateParamData = manyRes['data'];
                        break;
                    case 2:  //获取商品属性数据
                        const {data: onlyRes} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                            params:
                                {sel: 'only'}
                        });
                        if (onlyRes['meta']['status'] !== 200) return this.$message.error('商品属性获取失败！');
                        this.onlyCateParamData = onlyRes['data'];
                        break;
                }
            },
            //处理图片预览效果
            handlePreview(file) {
                this.imgSrc = file['response']['data']['url'];
                this.picVisible = true;
            },
            //处理图片移除事件
            handleRemove(file) {
                const filePath = file['response']['data']['tmp_path'];
                const i = this.addGoodsForm.pics.findIndex(item => item.pic === filePath);
                this.addGoodsForm.pics.splice(i, 1);
            },
            //文件上传时调用的事件
            uploadSuccess(response) {
                const path = {pic: response['data']['tmp_path']};
                this.addGoodsForm.pics.push(path);
            },
            //点击“添加商品”按钮触发的事件
            handleClickAddCateButton(formName) {
                this.$refs[formName].validate(async valid => {
                    if (!valid) return this.$message.error('请填写表单的必填项！');
                    this.manyCateParamData.forEach(item => {
                        const attr = {
                            attr_id: item['attr_id'],
                            attr_value: item['attr_vals'].join(' ')
                        };
                        this.addGoodsForm.attrs.push(attr);
                    });

                    this.onlyCateParamData.forEach(item => {
                        const attr = {
                            attr_id: item['attr_id'],
                            attr_value: item['attr_vals']
                        };
                        this.addGoodsForm.attrs.push(attr);
                    })

                    //使用lodash库实现“深拷贝”
                    const clonedForm = _.cloneDeep(this.addGoodsForm);
                    clonedForm.goods_cat = clonedForm.goods_cat.join(',');
                    //向后台发起请求
                    const {data: res} = await this.$http.post('goods', clonedForm);
                    if (res['meta']['status'] !== 201) return this.$message.error('添加商品失败！' + res['meta']['msg']);
                    this.$message.success('添加商品成功！');
                    setTimeout(() => this.$router.push('/goods'), 500);
                });
            }
        },
        computed: {
            //商品分类被选中的3级id
            cateId() {
                if (this.addGoodsForm.goods_cat.length === 3) {
                    return this.addGoodsForm.goods_cat[2];
                }
            },
        }
    }
</script>

<style lang="less" scoped>
    .el-steps {
        margin: 20px 0;
    }

    .el-checkbox {
        margin: 0 10px 0 0 !important;
    }

    .pic {
        width: 100%;
    }

    .addCateBtn {
        margin-top: 15px;
    }
</style>
