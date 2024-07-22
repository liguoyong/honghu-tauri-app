<template>
    <el-drawer class="editPayDrawer" v-model="props.drawer.show" size="578px" :direction="direction">
        <template #header>
            <h4>{{ props.drawer.title }}</h4>
        </template>
        <template #default>
            <div>
                <!-- <el-descriptions :column="3" title="收/支总和" border direction="horizontal">
                    <el-descriptions-item label="不计收支">kooriookami</el-descriptions-item>
                    <el-descriptions-item label="支出">18100000000</el-descriptions-item>
                    <el-descriptions-item label="收入">18100000000</el-descriptions-item>
                </el-descriptions> -->
                <el-descriptions title="占比" direction="vertical" size="small">
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
                title: '账单数据分析',
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
