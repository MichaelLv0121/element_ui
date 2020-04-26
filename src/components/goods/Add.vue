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

            <el-form :model="addGoodsForm" :rules="addGoodsFormRules" ref="addGoodsFormRef" label-position="top">
                <!-- 菜单栏 -->
                <el-tabs :tab-position="'left'" v-model="stepIndex" @tab-click="">
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
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
                </el-tabs>
            </el-form>

        </el-card>
    </div>
</template>

<script>
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
                    goods_number: 0
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
                    ]
                },
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-steps {
        margin: 20px 0;
    }
</style>
