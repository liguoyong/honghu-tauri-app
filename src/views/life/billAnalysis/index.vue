<template>
    <div class="layout-wrapper billAnalysis-container">
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="12">
                            <span class="font-semibold">基本情况</span>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-date-picker v-model="dateRange" size="small" type="datetimerange" style="width: 320px;"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
                                :shortcuts="shortcuts" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime2"
                                @change="getAnalysisSum" />
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div class="h-[100px] font-size-[12px] color-white">
                <el-row :gutter="20">
                    <el-col :span="5">
                        <div class="grid-content ep-bg-purple h-[100px]"
                            style="background: #f7af5c;padding: 6px;border-radius: 4px;">
                            <span>支出总和</span>
                            <div class="font-size-[18px] font-semibold">{{ analysisSumData.expenses_sum }}元</div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content ep-bg-purple h-[100px]"
                            style="background: #7a7dde;padding: 6px;border-radius: 4px;">
                            <span>收入总和</span>
                            <div class="font-size-[18px] font-semibold">{{ analysisSumData.income_sum }}元</div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content ep-bg-purple h-[100px]"
                            style="background: #4a90e5;padding: 6px;border-radius: 4px;">
                            <span>不计收支总和</span>
                            <div class="font-size-[18px] font-semibold">{{ analysisSumData.ignore_sum }}元</div>
                        </div>
                    </el-col>
                    <el-col :span="5">
                        <div class="grid-content ep-bg-purple">
                            <div class="h-[100px] w-full">
                                <!-- <pie-chart /> -->
                                <pieChart :chartId="customChartId" :options="chartOptions" />
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4" style="display: flex;align-items: center;">
                        <div class="grid-content ep-bg-purple" style="color: var(--el-text-color-primary)">
                            <div>
                                今日余额：{{ todayBalance }}元
                                <el-popover :visible="visiblePopover" title="更新余额" placement="bottom-end" :width="260">
                                    <el-form ref="formRef" size="small" :model="formData" label-position="left"
                                        label-width="auto">
                                        <el-form-item label="今日余额">
                                            <el-input v-model.trim="formData.total_amount" size="small" />
                                        </el-form-item>
                                        <el-form-item label="今日花呗支出">
                                            <el-input v-model.trim="formData.hb_expenditure" size="small" />
                                        </el-form-item>
                                        <el-form-item label="今日花呗余额">
                                            <el-input v-model.trim="formData.hb_balance" size="small" />
                                        </el-form-item>
                                    </el-form>
                                    <div style="text-align: right; margin: 0">
                                        <el-button size="small" plain @click="visiblePopover = false">取消</el-button>
                                        <el-button size="small" type="primary" @click="handleUpdateBalance">
                                            提交
                                        </el-button>
                                    </div>
                                    <template #reference>
                                        <el-link type="primary" :underline="false"
                                            @click="visiblePopover = true"><el-icon>
                                                <Edit />
                                            </el-icon></el-link>
                                    </template>
                                </el-popover>

                            </div>
                            <div>昨日余额：{{ yesterdayBalance }}元</div>
                            <div class="today-add">今日新增：
                                <el-text v-if="balanceDiff" type="success">{{ balanceDiff }}元<el-icon>
                                        <Top />
                                    </el-icon></el-text>
                                <el-text v-else type="danger">{{ balanceDiff }}元<el-icon>
                                        <Bottom />
                                    </el-icon></el-text>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="box-card mt-[12px]">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="12">
                            <span class="font-semibold">账单统计</span>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-date-picker v-model="dateRange1" size="small" type="datetimerange" style="width: 320px;"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
                                :shortcuts="shortcuts" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime2"
                                @change="getAnalysisList" />
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div class="h-[220px] font-size-[12px] color-white">
                <div class="h-[220px] w-full" id="lineChart" ref="lineChart">
                    <!-- <div class="h-[220px] w-full">
                    <LineChart chartId="lineChart" :options="lineChartOptions" />
                </div> -->
                </div>
            </div>
        </el-card>
        <el-card class="box-card mt-[12px]">
            <template #header>
                <div class="card-header">
                    <el-row>
                        <el-col :span="12">
                            <span class="font-semibold flex">
                                余额统计
                            </span>
                        </el-col>
                        <el-col :span="12" class="text-right">
                            <el-date-picker v-model="dateRange2" size="small" type="datetimerange" style="width: 320px;"
                                range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
                                :shortcuts="shortcuts" value-format="YYYY-MM-DD HH:mm:ss" :default-time="defaultTime2"
                                @change="getBalanceAnalysisChart" />
                        </el-col>
                    </el-row>
                </div>
            </template>
            <div class="h-[220px] font-size-[12px] color-white">
                <div class="h-[220px] w-full" id="lineChart2" ref="lineChart2">
                    <!-- <LineChart :chartId="customLineChartId" :options="lineChartOptions2" /> -->
                </div>
            </div>
        </el-card>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'
import * as echarts from 'echarts';
import { markRaw } from "vue"
import dayjs from 'dayjs';
import Big from 'big.js';
import { postBalanceAnalysis, getBalanceCreate, getBalanceUpdate } from '@/apis/balance'
import { importAnalysis, postAnalysisList } from '@/apis/bills'
// import pieChart from '../components/pieChart.vue'
import pieChart from '@/components/Chart/PieChart/index.vue'
import LineChart from '@/components/Chart/PieChart/index.vue'
import { ElMessage } from 'element-plus'
const dateRange: any = ref('')
const dateRange1: any = ref('')
const dateRange2: any = ref('')
const visiblePopover = ref(false)
const formRef = ref(null)
const formData = reactive({
    total_amount: '',
    id: '',
    hb_expenditure: '',
    hb_balance: ''
})
const defaultTime2: [Date, Date] = [
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
] // '1
const lineChart = ref(null);
// 初始化 dateRange 为近一周的时间范围
const setLastWeekRange = () => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    dateRange.value = [dayjs(start).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).format('YYYY-MM-DD HH:mm:ss')]
    dateRange1.value = [dayjs(start).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).format('YYYY-MM-DD HH:mm:ss')]
    dateRange2.value = [dayjs(start).format('YYYY-MM-DD HH:mm:ss'), dayjs(end).format('YYYY-MM-DD HH:mm:ss')]
}
const analysisChartData = ref([])
const analysisSumData = reactive({
    expenses_sum: 0,
    ignore_sum: 0,
    income_sum: 0
})
const expensesLine = ref([])
const ignoreLine = ref([])
const incomeLine = ref([])
const timeList = ref([])
const balanceTime = ref([])
const balanceData = ref([])
const availableBalanceData = ref([])
const hbExpenditure = ref([])
const todayBalance = ref(0)
const todayBalanceData = ref({})
const yesterdayBalance = ref(0)
setLastWeekRange()
const chartOptions = computed(() => ({
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'right',
        top: '15%'
    },
    series: [
        {
            name: '类型',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['20%', '50%'], // 将饼图中心移动到画布左20%，垂直居中
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
            data: analysisChartData.value // Use the reactive reference here
        }
    ]
}))

const lineChartOptions = computed(() => ({
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['支出', '收入', '不计收支'],
        show: true
    },
    grid: {
        left: '5%',
        right: '5%',
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
        data: timeList.value,
        interval: 50 // 或者设置每5个标签显示一个
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '支出',
            type: 'line',
            smooth: true,
            data: expensesLine.value
        },
        {
            name: '收入',
            type: 'line',
            smooth: true,
            data: incomeLine.value
        },
        {
            name: '不计收支',
            type: 'line',
            smooth: true,
            data: ignoreLine.value
        }
    ],
    dataZoom: [
        {
            show: true,
            realtime: true,
            start: 0,
            end: 100
        },
        {
            type: 'inside',
            realtime: true,
            start: 0,
            end: 100
        }
    ]
}))

// 今日余额跟昨日余额差值
const balanceDiff = computed(() => {
    // 创建两个 Big 实例
    const num1 = new Big(Number(todayBalance.value));
    const num2 = new Big(Number(yesterdayBalance.value));
    // 执行减法运算
    const result = num1.minus(num2);
    return result
})
const getAnalysisSum = () => {
    const [startTime = '', endTime = ''] = dateRange.value
    importAnalysis({
        startTime,
        endTime
    }).then(res => {
        if (res.code === 200) {
            const { expenses_sum = 0,
                ignore_sum = 0,
                income_sum = 0 } = res.data
            analysisChartData.value = [
                { value: ignore_sum, name: '不计收支', itemStyle: { color: '#4a90e5' } },
                { value: expenses_sum, name: '支出', itemStyle: { color: '#f7af5c' } },
                { value: income_sum, name: '收入', itemStyle: { color: '#7a7dde' } }
            ]
            console.log(analysisChartData.value, 'analysisChartData.valueanalysisChartData.value');

            Object.assign(analysisSumData, res.data)
        }

    })
}
getAnalysisSum()
const getAnalysisList = () => {
    const [startTime = '', endTime = ''] = dateRange1.value
    postAnalysisList({
        startTime,
        endTime
    }).then(res => {
        if (res.code === 200) {
            let timeMap = res.data.map(item => dayjs(item.payTime).format('YYYY-MM-DD HH:mm:ss'))
            //  timeMap 按照时间由小到大排序
            timeMap = timeMap.sort((a, b) => {
                return new Date(a) - new Date(b)
            })
            timeMap = [...new Set(timeMap)]
            timeList.value = timeMap

            // 创建一个映射来存储按时间分类的数据
            const dataByTime = {}
            res.data.forEach(item => {
                const timeKey = dayjs(item.payTime).format('YYYY-MM-DD HH:mm:ss')
                if (!dataByTime[timeKey]) {
                    dataByTime[timeKey] = { expenses: 0, ignore: 0, income: 0 }
                }
                if (item.consume === '支出') {
                    dataByTime[timeKey].expenses += Number(item.amount)
                } else if (item.consume === '不计收支') {
                    dataByTime[timeKey].ignore += Number(item.amount)
                } else if (item.consume === '收入') {
                    dataByTime[timeKey].income += Number(item.amount)
                }
            })

            // 根据时间点填充数据
            expensesLine.value = timeMap.map(time => dataByTime[time]?.expenses || 0)
            ignoreLine.value = timeMap.map(time => dataByTime[time]?.ignore || 0)
            incomeLine.value = timeMap.map(time => dataByTime[time]?.income || 0)

            initLineChart()
        } else {

        }
    })
}
getAnalysisList()

const lineChartOptions2 = computed(() => ({
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        // top: '5%',
        left: '5%',
        right: '5%',
        bottom: '3%',
        containLabel: true
    },
    legend: {
        data: ['余额', '花呗支出', '可用余额'],
        show: true
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: balanceTime.value
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '余额',
            stack: 'Total',
            type: 'line',
            smooth: true,
            data: balanceData.value,
        },
        {
            name: '花呗支出',
            type: 'line',
            smooth: true,
            data: hbExpenditure.value
        },
        {
            name: '可用余额',
            type: 'line',
            smooth: true,
            data: availableBalanceData.value
        },
    ],
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
}))

const getBalanceAnalysisChart = () => {
    const [startTime = '', endTime = ''] = dateRange1.value
    postBalanceAnalysis({
        startTime,
        endTime
    }).then(res => {
        if (res.code === 200) {
            const { data = [] } = res
            balanceTime.value = data.map(item => dayjs(item.recordTime).format('YYYY-MM-DD HH:mm:ss'))
            balanceData.value = data.map(item => Number(item.total_amount || 0))
            hbExpenditure.value = data.map(item => Number(item.hb_expenditure || 0))
            // availableBalanceData = 余额 - 花呗支出
            availableBalanceData.value = balanceData.value.map((item, index) => {
                // 使用bigjs计算 item - hbExpenditure.value[index]
                return new Big(item).minus(new Big(hbExpenditure.value[index] || 0)).toNumber()
            })
            console.log(data, dayjs().format('YYYY-MM-DD'))
            const todayData = data.find(item => dayjs(item.recordTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
            if (todayData) {
                todayBalance.value = todayData?.total_amount || 0
                Object.assign(formData, todayData || {})
            }
            yesterdayBalance.value = data.find(item => dayjs(item.recordTime).format('YYYY-MM-DD') === dayjs().subtract(1, 'day').format('YYYY-MM-DD'))?.total_amount || 0
            initLineChart2();
            console.log(todayData, todayBalance.value, yesterdayBalance.value, 'dxddddddddd')
        } else {

        }
        console.log(res);
    })
}
getBalanceAnalysisChart()
const shortcuts = [
    {
        text: '近一天',
        value: () => {
            const end = new Date()
            const start = new Date()
            start.setDate(start.getDate() - 1)
            return [start, end]
        },
    },
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
    // 近一年
    {
        text: '近一年',
        value: () => {
            const end = new Date();
            const start = new Date();
            start.setFullYear(start.getFullYear() - 1);
            return [start, end];
        },
    },
]
const customChartId = ref('myCustomChart')
const customLineChartId = ref('myCustomLineChart')
const initLineChart = () => {
    lineChart.value = markRaw(echarts.init(document.getElementById('lineChart')));
    lineChart.value.setOption(lineChartOptions.value);
};
const lineChart2 = ref(null)
const initLineChart2 = () => {
    lineChart2.value = markRaw(echarts.init(document.getElementById('lineChart2')));
    lineChart2.value.setOption(lineChartOptions2.value);
};
const handleUpdateBalance = () => {
    const { id = '', total_amount = '', hb_expenditure = '', hb_balance = '' } = formData
    if (!total_amount || !hb_expenditure || !hb_balance) {
        ElMessage.error('输入金额不能为空')
        return
    }
    if (id) {
        getBalanceUpdate({
            id,
            total_amount,
            hb_expenditure,
            hb_balance
        }).then(res => {
            if (res.code === 200) {
                todayBalance.value = total_amount
                visiblePopover.value = false
                ElMessage.success('更新成功')
            } else {
                ElMessage.error('更新失败')
            }
        })
    } else {
        getBalanceCreate({
            total_amount,
            hb_expenditure,
            hb_balance
        }).then(async res => {
            if (res.code === 200) {
                visiblePopover.value = false
                ElMessage.success('新增成功')
                setLastWeekRange()
                await getBalanceAnalysisChart()
            } else {
                ElMessage.error('新增失败')
            }
        })
    }

}
onMounted(() => {
    initLineChart();
    initLineChart2();
    window.addEventListener('resize', () => {
        lineChart.value.resize();
        lineChart2.value.resize();
    });
});
console.log(chartOptions, 'chartOptionschartOptionschartOptions');

</script>
<style lang="scss" scoped>
:deep(.today-add) {
    .el-text {
        font-size: 12px;
    }
}

// .el-link {
//     font-size: 12px;
// }</style>