<template>
    <el-drawer class="editPayDrawer" v-model="props.drawer.show" size="578px" :direction="direction">
        <template #header>
            <h4>{{ props.drawer.title }}</h4>
        </template>
        <template #default>
            <div>
                <el-descriptions :column="1" title="基本信息" border direction="horizontal" size="small">
                    <el-descriptions-item label="订单编号">{{ drawer.data.transactionNumber }}</el-descriptions-item>
                    <el-descriptions-item label="交易时间">{{ drawer.data.payTime }}</el-descriptions-item>
                    <el-descriptions-item label="交易分类">{{ drawer.data.payType }}</el-descriptions-item>
                    <el-descriptions-item label="交易对方">{{ drawer.data.payUser }}</el-descriptions-item>
                    <el-descriptions-item label="对方账号">{{ drawer.data.payAccount }}</el-descriptions-item>
                    <el-descriptions-item label="商品说明">{{ drawer.data.goods }}</el-descriptions-item>
                    <el-descriptions-item label="收/支">{{ drawer.data.consume }}</el-descriptions-item>
                    <el-descriptions-item label="金额">{{ drawer.data.amount }}</el-descriptions-item>
                    <el-descriptions-item label="收/付款方式">{{ drawer.data.payWay }}</el-descriptions-item>
                    <el-descriptions-item label="当前状态">{{ drawer.data.status }}</el-descriptions-item>

                    <!-- 订单编号
                    交易时间
                    交易分类
                    交易对方
                    对方账号
                    商品说明
                    收/支
                    金额
                    收/付款方式
                    当前状态 -->
                </el-descriptions>
                <el-descriptions title="占比" style="margin-top:20px;" direction="vertical">
                    <el-descriptions-item label="">
                        <pie-chart />
                    </el-descriptions-item>
                </el-descriptions>
                <div id="chartContainer" ref="chartContainer" style="height:300px;"></div>
            </div>
        </template>
        <!-- <template #footer>
          <div style="flex: auto">
              <el-button @click="cancelClick">cancel</el-button>
              <el-button type="primary" @click="confirmClick">confirm</el-button>
          </div>
      </template> -->
    </el-drawer>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import * as echarts from 'echarts';
import 'echarts/lib/chart/line'; // 导入折线图
import pieChart from './pieChart.vue'
const chartContainer = ref()
const props = defineProps({
    drawer: {
        type: Object,
        default() {
            return {
                show: false,
                title: '查看详情',
                data: {}
            }
        }
    },
    detail: {
        type: Object,
        default() {
            return {
                show: false,
                title: '查看详情',
                data: {}
            }
        }
    }
})


onMounted(() => {
    watch(props.drawer, (newVal, oldVal) => {
        if (newVal.show) {
            nextTick(() => {
                console.log('展示节点', document.getElementById('chartContainer'), 'asd');
                init()
            })

        }
    })
});
function init() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('chartContainer'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: ''
        },
        tooltip: {},
        legend: {
            data: ['销量']
        },
        xAxis: {
            data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [
            {
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
const direction = ref('rtl')
</script>
<style lang="scss" scoped>
.editPayDrawer {
    .el-drawer__header {
        margin-bottom: 0;

        h4 {
            font-size: 16px;
            color: #031321;
            font-family: PingFang SC;
            font-weight: bold;
            padding: 0;
            margin: 0;
        }
    }
}
</style>
