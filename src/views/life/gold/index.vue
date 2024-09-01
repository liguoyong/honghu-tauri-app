<template>
    <div class="layout-wrapper gold-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="12">
                            <span class="font-semibold flex">
                                金价统计
                            </span>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-date-picker v-model="form.date" size="small" type="datetimerange" style="width: 320px;"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" :shortcuts="shortcuts"
                                value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime"
                                @change="getBalanceAnalysisChart" />
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div class="h-[260px] font-size-[12px] color-white">
                <div class="h-[260px] w-full" id="GoldLineChart" ref="GoldLineChart">
                </div>
            </div>
            <com-table class="mt-[40px]" size="small" :columns="columns" :data="tableData" @op="handleOperation" />
            <com-pagination class="mt-[16px]" :current-page="pageParams.page" :page-sizes="[10, 20, 50, 100]"
                :page-size="pageParams.size" :total="pageParams.total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </el-card>
        <!-- <com-form ref="formRef" size="small" :inline="true" v-model="form" :options="formOptions" @submit="handleSearch">
            <el-form-item>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="" size="small" @click="handleReset">重置</el-button>
            </el-form-item>
        </com-form> -->

    </div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { getGoldList, postGoldAnalysis } from '@/apis/gold'
import { markRaw } from "vue"
import * as echarts from 'echarts';
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs';
const form = reactive({ date: [] })
const formRef = ref(null)
const lineChart = ref(null)
const defaultTime: [Date, Date] = [
    new Date(2000, 0, 1, 0, 0, 0, 0),
    new Date(2000, 0, 1, 23, 59, 59, 999),
]
const shortcuts = reactive([
    {
        text: '近一周',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 7)
            return [start, end]
        },
    },
    {
        text: '近一月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 1)
            return [start, end]
        },
    },
    {
        text: '近三月',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 3)
            return [start, end]
        },
    },
    {
        text: '近半年',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setMonth(start.getMonth() - 6)
            return [start, end]
        },
    },
    {
        text: '近一年',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setFullYear(start.getFullYear() - 1)
            return [start, end]
        },
    },
    {
        text: '近三年',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setFullYear(start.getFullYear() - 3)
            return [start, end]
        },
    },
    {
        text: '近五年',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setFullYear(start.getFullYear() - 5)
            return [start, end]
        },
    },
])
const pageParams = reactive({
    page: 1,
    size: 10,
    total: 0
})
const columns = ref([
    {
        label: `序号`, type: 'index', align: 'center'
    },
    {
        label: `黄金TD`, prop: 'goldTd'
    },
    {
        label: `水贝黄金`, prop: 'shuibeiGold'
    },
    {
        label: `铂金99`, prop: 'platinum99'
    },
    {
        label: `白银TD`, prop: 'silverTd'
    },
    {
        label: `金条价格`, prop: 'goldBarPrice'
    },
    {
        label: `18K金`, prop: 'gold18k'
    },
    {
        label: `记录时间`, prop: 'recordTime', width: '160'
    }
])
const tableData = ref([])
const chartTableData = ref([])
const formOptions = computed(() => [
    {
        label: '', prop: 'date', required: false, component: 'el-date-picker', props: {
            'value-format': "YYYY-MM-DD HH:mm:ss",
            type: 'datetimerange',
            'default-time': defaultTime,
            placeholder: '请选择时间',
            'range-separator': '至',
            'start-placeholder': '开始时间',
            'end-placeholder': '结束时间',
            pickerOptions: {
                disabledDate: function (time: any) {
                    const selected = new Date(time);
                    const start = new Date(form.data[0]);
                    const diffTime = selected.getTime() - start.getTime();
                    const diffDays = diffTime / (1000 * 60 * 60 * 24);

                    // // 结束时间存在并且小于开始时间前一周或大于开始时间后一周时禁用
                    // if (form.data[1]) {
                    //     return diffDays > 7 || diffDays < -7;
                    // }

                    // 开始时间存在时，只禁用开始时间前七天以外的日期
                    return selected < new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000)
                }
            },
            shortcuts: shortcuts,
        }
    },
])
const keyList = reactive({
    goldTd: '黄金TD',
    shuibeiGold: '水贝黄金',
    platinum99: '铂金99',
    silverTd: '白银TD',
    goldBarPrice: '金条价格',
    gold18k: '18K金'
})
const lineChartOptions = computed(() => {
    const legend = Object.keys(keyList).map(key => {
        return keyList[key]
    })
    const data = chartTableData.value
    console.log(chartTableData.value,'chartTableData');
    
    const seriesData = Object.keys(keyList).map(key => {
        return {
            name: keyList[key],
            type: 'line',
            stack: 'Total',
            smooth: true,
            data: data.map(item => item[key])
        }
    })
    return {
        title: {
            text: ''
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: legend,
            show: true
        },
        grid: {
            left: '0%',
            right: '2%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(item => item.recordTime),
            interval: 50 // 或者设置每5个标签显示一个
        },
        yAxis: {
            type: 'value'
        },
        series: seriesData,
        dataZoom: [
            // 内置 dataZoom 组件，适用于折线图、柱状图等
            {
                type: 'inside',
                start: 0,
                end: 100,
                zoomLock: true
            },
            // 工具栏 dataZoom 组件，适用于折线图、柱状图等
            {
                type: 'slider',
                show: true,
                xAxisIndex: [0]
            }
        ]
    }
})
const handleOperation = ({ type, row }) => {
    console.log(type, row);
    if (type === 'view') {
        console.log('111');
        // router.push({ name: 'evaluateDetail' })
    }
}
const handleSizeChange = (val: number) => {
    pageParams.page = 1
    pageParams.size = val
    getList()
}

const handleCurrentChange = (val: number) => {
    pageParams.page = val
    getList()
}

function getGoldAnalysis() {
    const [startTime = '', endTime = ''] = form.date || []
    postGoldAnalysis({ startTime, endTime }).then(res => {
        if (res.code == 200) {
            console.log(res,'asdas');
            
            const { data = [] } = res
            chartTableData.value = data.map(item => {
                return {
                    ...item,
                    recordTime: dayjs(item.recordTime).format('YYYY-MM-DD HH:mm:ss'),
                    updateTime: dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
                    createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
                }
            })
            initLineChart()
        } else {
            ElMessage.error(res.msg)
        }
    })
}
getGoldAnalysis()

function getList() {
    const [startTime = '', endTime = ''] = form.date || []
    const params = { ...pageParams, startTime, endTime }
    getGoldList(params).then(res => {
        if (res.code == 200) {
            const { list = [], total } = res.data
            tableData.value = list
            pageParams.total = total
        } else {
            ElMessage.error(res.msg)
        }
    })
}
getList()

function handleSearch() {
    getList()
}
function handleReset() {
    form.date = []
    pageParams.page = 1
    getList()
}
function getBalanceAnalysisChart() {
    getGoldAnalysis()
    getList()
}
const initLineChart = () => {
    lineChart.value = markRaw(echarts.init(document.getElementById('GoldLineChart')));
    lineChart.value.setOption(lineChartOptions.value);
};
onMounted(() => {
    window.addEventListener('resize', () => {
        lineChart.value.resize();
    });
});
</script>