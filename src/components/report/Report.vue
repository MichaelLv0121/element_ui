<template>
    <div>
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片 -->
        <el-card class="box-card">
            <!-- 2、为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style="width: 800px;height:400px;"></div>
        </el-card>
    </div>
</template>

<script>
    // 1、导入 echarts 组件
    import echarts from 'echarts';
    import _ from 'lodash';

    export default {
        name: "Report",
        data() {
            return {
                //要合并的数据
                options: {
                    title: {
                        text: '用户来源'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#E9EEF3'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            boundaryGap: false
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ]
                },
            }
        },
        async mounted() {
            const {data: res} = await this.$http.get('reports/type/1');
            if (res['meta']['status'] !== 200) return this.$message.error('获取数据失败！');

            // 3、在dom渲染完毕后，初始化 echarts 实例
            const myChart = echarts.init(document.getElementById('main'));

            // 4、指定图表的配置项和数据
            const option = _.merge(res['data'], this.options);

            // 5、使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        },
    }
</script>

<style lang="less" scoped>

</style>
