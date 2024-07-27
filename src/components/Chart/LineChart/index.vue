<template>
    <div :id="chartId" :class="chartClass" :style="chartStyle"></div>
  </template>
  
  <script lang="ts" setup>
  import * as echarts from 'echarts';
  import { ref, nextTick, onMounted, onUnmounted, watch, markRaw } from 'vue';
  
  interface Props {
    chartId?: string;
    options: echarts.EChartsOption;
    width?: string;
    height?: string;
  }
  
  const props = withDefaults(defineProps<Props>(), {
    chartId: () => `PieChart-${Math.random().toString(36).substr(2, 9)}`,
    options: () => ({}),
    width: '100%',
    height: '100%',
  });
  
  const chartInstance = ref<echarts.ECharts | null>(null);
  const chartClass = ref('h-full w-full');
  const chartStyle = ref({ width: props.width, height: props.height });
  
  function initChart() {
    if (!chartInstance.value) {
      chartInstance.value = markRaw(echarts.init(document.getElementById(props.chartId)));
      chartInstance.value.setOption(props.options);
      chartInstance.value.resize();
    } else {
      chartInstance.value.setOption(props.options);
      chartInstance.value.resize();
    }
  }
  
  function handleResize() {
    if (chartInstance.value) {
      chartInstance.value.resize();
    }
  }
  
  onMounted(() => {
    nextTick(initChart);
    window.addEventListener('resize', handleResize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    if (chartInstance.value) {
      chartInstance.value.dispose();
      chartInstance.value = null;
    }
  });
  
  watch(
     () => props.options,
     () => {
       nextTick(() => {
         if (chartInstance.value) {
           chartInstance.value.setOption(props.options);
           chartInstance.value.resize();
         }
       });
     },
     { deep: true }
   );
  </script>
  
  <style lang="scss" scoped>
  /* Add any component-specific styles here */
  </style>