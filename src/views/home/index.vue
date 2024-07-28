<template>
  <div class="layout-wrapper home-container">
    <el-row :gutter="16">
      <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span class="font-semibold">待办事项</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item h-[204px]">
            <div ref="todoList" class="todoList">
              <div class="list-item-div" v-for="item in items" :key="item.id">
                <el-row>
                  <el-col :span="8">
                    {{ item.title }}
                  </el-col>
                  <el-col :span="15" style="text-align: right;">
                    {{ $dayjs(item.startTime).format('YYYY-MM-DD') }} 到 {{ $dayjs(item.endTime).format('YYYY-MM-DD') }}
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
          <template #footer>
            <div>
              待办事项：{{ items.length }}条
            </div>
          </template>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span  class="font-semibold">昨日账单</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item h-[204px]">
            <el-scrollbar>
                <div class="list-item-div" v-for="(item, index) in  yesterdayAnalysisList ">
                  <el-row>
                    <el-col :span="6">
                      {{ item.consume }}
                    </el-col>
                    <el-col :span="11" class="truncate">
                      <el-tooltip effect="dark" :content="item.goods" placement="top">
                        <span>{{ item.goods }}</span>
                      </el-tooltip>
                    </el-col>
                    <el-col :span=" 7 " class="text-right">
                      <el-text v-if=" item.consume === '收入' " type="primary">{{ item.amount }}元<el-icon class="ml-[4px]">
                          <Top />
                        </el-icon></el-text>
                      <el-text v-else-if=" item.consume === '支出' " type="danger">{{ item.amount }}元<el-icon class="ml-[4px]">
                          <Bottom />
                        </el-icon></el-text>
                      <el-text v-else-if=" item.consume === '不计收支' " type="warning">{{ item.amount }}元<el-icon class="ml-[4px]">
                          <Right />
                        </el-icon></el-text>
                    </el-col>
                  </el-row>
              </div>
            </el-scrollbar>
          </div>
          <template #footer>
            <el-row>
              <el-col :span="8">
                <div class="flex items-center">
                  <svg-icon name="expenses" style="width: 16px;height: 16px;"/>
                  <span class="ml-[4px]">
                    {{ yesterdayExpensesSum }}
                  </span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flex items-center justify-center">
                  <svg-icon name="income" style="width: 16px;height: 16px;"/>
                  <span class="ml-[4px]">
                    {{ yesterdayIncomeSum }}
                  </span>
                </div>
                
              </el-col>
              <el-col :span="8">
                <div class="flex items-center justify-end">
                  <svg-icon name="noCalculate" style="width: 16px;height: 16px;"/>
                  <span class="ml-[4px]">
                    {{ yesterdayNoCalculateSum }}
                  </span>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-card>
      </el-col>
      <el-col :span=" 6 " :xs=" 24 " :sm=" 24 " :md=" 12 " :lg=" 8 " :xl=" 6 ">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span class="font-semibold">今日账单</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item h-[204px]">
            <el-scrollbar>
              <div class="list-item-div" v-for="( item, index ) in  todayAnalysisList ">
                <el-row>
                  <el-col :span="6">
                    {{ item.consume }}
                  </el-col>
                  <el-col :span="11" class="truncate">
                    <el-tooltip effect="dark" :content="item.goods" placement="top">
                      <span>{{ item.goods }}</span>
                    </el-tooltip>
                  </el-col>
                  <el-col :span="7" style="text-align: right;">
                    <el-text v-if=" item.consume === '收入' " type="primary">{{ item.amount }}元<el-icon class="ml-[4px]">
                        <Top />
                      </el-icon></el-text>
                    <el-text v-else-if=" item.consume === '支出' " type="danger">{{ item.amount }}元<el-icon class="ml-[4px]">
                        <Bottom />
                      </el-icon></el-text>
                    <el-text v-else-if=" item.consume === '不计收支' " type="warning">{{ item.amount }}元<el-icon class="ml-[4px]">
                        <Right />
                      </el-icon></el-text>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </div>
          <template #footer>
            <el-row>
              <el-col :span="8">
                <div class="flex items-center">
                  <svg-icon name="expenses" style="width: 16px;height: 16px;"/>
                  <span class="ml-[4px]">
                    {{ todayExpensesSum }}
                  </span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flex items-center justify-center">
                  <svg-icon name="income" style="width: 16px;height: 16px;"/>
                  <span class="ml-[4px]">
                    {{ todayIncomeSum }}
                  </span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="flex items-center justify-end">
                  <svg-icon name="noCalculate" style="width: 16px;height: 16px;"/>
                  <span class="ml-[4px]">
                    {{ todayNoCalculateSum }}
                  </span>
                </div>
              </el-col>
            </el-row>
          </template>
        </el-card>
      </el-col>
      <el-col :span=" 6 ">
        
      </el-col>
    </el-row>

  </div>
</template>
<script lang="ts">
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from 'element-plus'
import Sortable from 'sortablejs';
import { getTodoAll } from '@/apis/todo'
import { postAnalysisList } from '@/apis/bills'
import dayjs from 'dayjs';
import Big from 'big.js';
export default {
  setup() {
    const value = ref(new Date());
    const items = ref([]);
    const analysisList = ref([])
    const todayAnalysisList = ref([])
    const yesterdayAnalysisList = ref([])
    const todayExpensesSum = ref(0)
    const todayIncomeSum = ref(0)
    const todayNoCalculateSum = ref(0)
    const yesterdayExpensesSum = ref(0)
    const yesterdayIncomeSum = ref(0)
    const yesterdayNoCalculateSum = ref(0)
    let sortable;
    getTodoAll().then(res => {
      if (res.code === 200) {
        items.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })
    const dateRange1: any = ref('')
    const setLastWeekRange = () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 1)
      dateRange1.value = [dayjs(start).format('YYYY-MM-DD 00:00:00'), dayjs(end).format('YYYY-MM-DD 23:59:59')]
    }
    setLastWeekRange()
    
    const getAnalysisList = () => {
      const [startTime = '', endTime = ''] = dateRange1.value
      postAnalysisList({
        startTime,
        endTime
      }).then(res => {
        if (res.code === 200) {
          analysisList.value = res.data;
          const sort = ['支出', '收入', '不计收支'];
          const today = res.data.filter(item => dayjs(item.payTime).isSame(dayjs(), 'day'));
          const yesterday = res.data.filter(item => dayjs(item.payTime).isSame(dayjs().subtract(1, 'day'), 'day'));

          // 使用箭头函数简化排序逻辑
          todayAnalysisList.value = [...today].sort((a, b) => sort.indexOf(a.consume) - sort.indexOf(b.consume));
          yesterdayAnalysisList.value = [...yesterday].sort((a, b) => sort.indexOf(a.consume) - sort.indexOf(b.consume));

          // 提取重复的计算逻辑到函数中
          const sumByCategory = (items, category: String) => items.filter(item => item.consume === category)
            .reduce((acc, cur) => acc.plus(cur.amount), new Big(0)).toString();

          todayExpensesSum.value = sumByCategory(today, '支出');
          todayIncomeSum.value = sumByCategory(today, '收入');
          todayNoCalculateSum.value = sumByCategory(today, '不计收支');
          yesterdayExpensesSum.value = sumByCategory(yesterday, '支出');
          yesterdayIncomeSum.value = sumByCategory(yesterday, '收入');
          yesterdayNoCalculateSum.value = sumByCategory(yesterday, '不计收支');
        }
      })
    }
    getAnalysisList()
    onMounted(async () => {
      sortable = Sortable.create(document.querySelector('.todoList'), {
        onEnd: (evt) => {
          const item = items.value.splice(evt.oldIndex, 1)[0];
          items.value.splice(evt.newIndex, 0, item);
        }
      });
    });
    return {
      dateRange1,
      analysisList,
      todayAnalysisList,
      yesterdayAnalysisList,
      value,
      items,
      todayExpensesSum,
      todayIncomeSum,
      todayNoCalculateSum,
      yesterdayExpensesSum,
      yesterdayIncomeSum,
      yesterdayNoCalculateSum
    }
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  .box-card {
    min-height: 41vh;
    padding: 12px 0;
  }
  :deep(.el-card) {
    font-size: 12px;
    .el-text {
      font-size: 12px;
    }
    .el-card__body {
      padding: 12px 0;
    }
    .list-item-div {
      padding: 0 12px;
    }
  }
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}</style>
