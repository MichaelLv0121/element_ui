<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容"
                              v-model.trim="queryParam.query"
                              @change="getGoodsList"
                              @clear="getGoodsList"
                              clearable>
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="handleClickAddGoodsButton">添加商品</el-button>
                </el-col>
            </el-row>

            <!-- 商品列表 table -->
            <el-table :data="goodsList"
                      stripe
                      border
                      width="100%"
                      class="goods_list_table">
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column prop="goods_price" label="商品价格（元）" width="80"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
                <el-table-column label="创建时间" width="170">
                    <template slot-scope="scope">
                        {{scope.row['add_time'] | dateFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini"
                                   @click="handleDeleteGoodsButton(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParam.pagenum"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="queryParam.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>

        </el-card>
    </div>
</template>

<script>
    export default {
        name: "List",
        data() {
            return {
                //根据分页查询的参数
                queryParam: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                //商品列表数据
                goodsList: [],
                //商品总条数
                total: 0,
            }
        },
        created() {
            this.getGoodsList();
        },
        methods: {
            //获取商品列表数据
            async getGoodsList() {
                const {data: res} = await this.$http.get('goods', {params: this.queryParam});
                if (res['meta']['status'] === 200) {
                    //专门用于处理删除某一页（此页页码 >= 2）的最后一条数据时，手动获取前一页的数据
                    if (res['data']['goods'].length === 0 && res['data']['pagenum'] > 1) {
                        this.queryParam.pagenum = 1;
                        await this.getGoodsList();
                    } else {
                        this.goodsList = res['data']['goods'];
                        this.total = res['data']['total'];
                    }
                } else {
                    return this.$message.error('获取商品列表失败！');
                }
            },
            //每页大小变化时触发的事件
            handleSizeChange(newSize) {
                this.queryParam.pagesize = newSize;
                this.getGoodsList();
            },
            //当前页变化时触发的事件
            handleCurrentChange(newPage) {
                this.queryParam.pagenum = newPage;
                this.getGoodsList();
            },
            //点击“删除”按钮
            async handleDeleteGoodsButton(row) {
                const flag = await this.$confirm(`是否要删除「${row['goods_name']}」?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err);
                if (flag !== 'confirm') return;
                const {data: res} = await this.$http.delete(`goods/${row['goods_id']}`);
                if (res['meta']['status'] !== 200) return this.$message.error('删除失败！');
                this.$message.success('删除成功！');
                await this.getGoodsList();
            },
            //点击“添加商品”按钮
            handleClickAddGoodsButton() {
                this.$router.push('/goods/add');
            }
        }
    }
</script>

<style lang="less" scoped>
    .goods_list_table {
        margin-top: 20px;
    }
</style>
