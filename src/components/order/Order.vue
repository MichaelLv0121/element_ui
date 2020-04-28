<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 搜索栏 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryParam.query" @change="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单数据列表表格 -->
            <el-table
                    :data="orderList"
                    stripe
                    border
                    style="width: 100%">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" width="500px"></el-table-column>
                <el-table-column prop="order_price" label="订单价格"></el-table-column>
                <el-table-column label="是否付款">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row['order_pay'] === '1'">已付款</el-tag>
                        <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货"></el-table-column>
                <el-table-column label="下单时间" width="180px">
                    <template slot-scope="scope">
                        {{scope.row['create_time'] | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <el-tooltip content="修改地址" placement="top" :enterable="false">
                            <el-button type="primary" icon="el-icon-edit" size="mini"
                                       @click="handleEditAdrButton"></el-button>
                        </el-tooltip>
                        <el-tooltip content="物流进度" placement="top" :enterable="false">
                            <el-button type="success" icon="el-icon-location" size="mini"
                                       @click="handleClickLogisticsProgressBtn"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParam.pagenum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="queryParam.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    background>
            </el-pagination>

            <!-- 修改地址对话框 -->
            <el-dialog
                    title="修改地址"
                    :visible.sync="editAdrDialogVisible"
                    @closed="handleEditAdrFormClosed('editAdrFormRef')"
                    width="50%">
                <el-form :model="editAdrForm" :rules="editAdrFormRules" ref="editAdrFormRef" label-width="100px">
                    <el-form-item label="省市区/县" prop="province">
                        <el-cascader
                                v-model="editAdrForm.province"
                                :options="cityData"
                                :props="provinceProps"
                                @change="handleProvinceCascaderChange">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="detailAdr">
                        <el-input v-model.trim="editAdrForm.detailAdr"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editAdrDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleClickEditAdrBtn('editAdrFormRef')">确 定</el-button>
                </span>
            </el-dialog>

            <!-- 物流进度对话框 -->
            <el-dialog
                    title="物流进度"
                    :visible.sync="logisticsProgressDialogVisible"
                    width="50%">
                <div class="radio">
                    排序：
                    <el-radio-group v-model="reverse">
                        <el-radio :label="true">正序</el-radio>
                        <el-radio :label="false">倒序</el-radio>
                    </el-radio-group>
                </div>

                <el-timeline>
                    <el-timeline-item
                            :reverse="reverse"
                            v-for="(activity, index) in logisticsProgress"
                            :key="index"
                            :timestamp="activity.time">
                        {{activity.context}}
                    </el-timeline-item>
                </el-timeline>
            </el-dialog>

        </el-card>
    </div>
</template>

<script>
    import cityData from "./citydata";

    export default {
        name: "Order",
        data() {
            return {
                //订单数据列表查询参数
                queryParam: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                //订单数据列表
                orderList: [],
                //总条数
                total: 0,
                //修改地址对话框显示与否
                editAdrDialogVisible: false,
                //修改地址绑定的数据对象
                editAdrForm: {
                    province: [],
                    detailAdr: ''
                },
                //所有省市县数据
                cityData,
                //修改地址绑定的数据对象校验
                editAdrFormRules: {
                    province: [
                        {required: true, message: '请选择省市区/县', trigger: 'blur'},
                    ],
                    detailAdr: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'},
                    ]
                },
                //省市级联选择器绑定的配置数据对象
                provinceProps: {
                    expandTrigger: 'hover',
                    value: 'value',
                    label: 'label',
                    children: 'children',
                },
                //物流进度对话框显示与否
                logisticsProgressDialogVisible: false,
                //物流进度
                logisticsProgress: [],
                //物流进度正序、倒序
                reverse: false,
            }
        },
        created() {
            this.getOrderList();
        },
        methods: {
            //获取订单数据列表
            async getOrderList() {
                const {data: res} = await this.$http.get('orders', {params: this.queryParam});
                if (res['meta']['status'] !== 200) return this.$message.error('获取订单列表失败！');
                this.orderList = res['data']['goods'];
                this.total = res['data']['total'];
            },
            //每页数量变化时触发的事件
            handleSizeChange(newSize) {
                this.queryParam.pagesize = newSize;
                this.getOrderList();
            },
            //当前页页码变化时触发的事件
            handleCurrentChange(newPage) {
                this.queryParam.pagenum = newPage;
                this.getOrderList();
            },
            //修改地址按钮的点击事件
            handleEditAdrButton() {
                this.editAdrDialogVisible = true;
            },
            //修改地址对话框关闭触发的事件
            handleEditAdrFormClosed(formName) {
                this.$refs[formName].resetFields();
            },
            //省市县级联选择框变化时触发的事件
            handleProvinceCascaderChange() {
                console.log(this.editAdrForm.province);
            },
            //点击“修改地址”对话框的“确定”按钮
            handleClickEditAdrBtn(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) return;
                    console.log(this.editAdrForm);
                })
            },
            //点击“物流进度”按钮
            async handleClickLogisticsProgressBtn() {
                const {data: res} = await this.$http.get('kuaidi/1106975712662');
                if (res['meta']['status'] !== 200) return this.$message.error('物流进度获取失败！');
                this.logisticsProgress = res['data'];
                this.logisticsProgressDialogVisible = true;
            }
        },
        watch: {
            //用于将“物流进度”正倒序
            reverse() {
                this.logisticsProgress.reverse();
            }
        }
    }
</script>

<style lang="less" scoped>
    .el-cascader {
        width: 100%;
    }

    .radio {
        margin-bottom: 20px;
    }
</style>
