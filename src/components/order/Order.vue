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
                    <el-input placeholder="请输入内容">
                        <el-button slot="append" icon="el-icon-search"></el-button>
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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="success" icon="el-icon-location" size="mini"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Order",
        data() {
            return {
                //订单数据列表查询参数
                queryParam: {
                    pagenum: 1,
                    pagesize: 10
                },
                //订单数据列表
                orderList: [],
                total: 0
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

                console.log(this.orderList)
                console.log(this.total)
            }
        },
    }
</script>

<style scoped>

</style>
