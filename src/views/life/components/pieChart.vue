<template>
  <div id="billPieChart"></div>
</template>
<script lang="ts" setup>
import * as echarts from 'echarts';
import 'echarts/lib/chart/line'; // 导入折线图
import { ref, nextTick, onMounted } from 'vue'
console.log('pie');
onMounted(() => {
  console.log('加载饼图');
  nextTick(() => {
    init()
  })
})
function init() {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(document.getElementById('billPieChart'));
  // 指定图表的配置项和数据
  var option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: '5%',
      left: 'center'
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 1048, name: '不计收支' },
          { value: 735, name: '支出' },
          { value: 580, name: '收入' }
        ]
      }
    ]
  };
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
}
</script>
<style lang="scss" scoped>
#billPieChart {
  height: 300px;
}
</style>
