<template>
  <div class="layout-wrapper home-container">
    <el-row :gutter="20">
      <!-- <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>重要事项</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item">
            11111111
          </div>
        </el-card>
      </el-col> -->
      <!-- <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>每日任务</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item">
            11111111
          </div>
        </el-card>
      </el-col> -->
      <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>待办事项</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item">
            <div ref="todoList" class="todoList">
              <div v-for="item in items" :key="item.id">标题：{{ item.title }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>昨日账单</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item">
            <div v-for="(item, index) in yesterdayAnalysisList">{{ item.consume }}：{{ item.amount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>今日账单</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item">
            <div v-for="(item, index) in todayAnalysisList">{{ item.consume }}：{{ item.amount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <!-- <div class="grid-content ep-bg-purple">
          <el-calendar v-model="value" />
        </div> -->
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
export default {
  setup() {
    const value = ref(new Date());
    const items = ref([]);
    const analysisList = ref([])
    const todayAnalysisList = ref([])
    const yesterdayAnalysisList = ref([])
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
          console.log(res, 'ssssssssssss');
          analysisList.value = res.data
          todayAnalysisList.value = res.data.filter(item => dayjs(item.payTime).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD'))
          yesterdayAnalysisList.value = res.data.filter(item => dayjs(item.payTime).format('YYYY-MM-DD') === dayjs().subtract(1, 'day').format('YYYY-MM-DD'))
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
      items
    }
  }
}
</script>
<style lang="scss" scoped>
.home-container {
  .box-card {
    min-height: 41vh;
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
}
</style>
