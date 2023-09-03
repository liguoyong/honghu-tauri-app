<template>
  <div class="home-container">
    <el-row>
      <el-col :span="8">
        <div class="plans-container">
          <div class="plans-container-header">
            <span>今日计划</span>
          </div>
          <div class="plans-container-container">
            <div v-for="(item, index) in noteList" :key="index" class="plan-item">{{ item.title }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="center-container">
        </div>
      </el-col>
      <el-col :span="8">
        <el-calendar ref="calendar" size="mini">
          <template #header="{ date }">
            <span class="data">{{ date }}</span>
            <el-button-group>
              <el-button size="small" @click="selectDate('prev-month')">
                {{ $t('calendar.preMonth') }}
              </el-button>
              <el-button size="small" @click="selectDate('today')">{{ $t('calendar.today') }}</el-button>
              <el-button size="small" @click="selectDate('next-month')">
                {{ $t('calendar.nextMonth') }}
              </el-button>
            </el-button-group>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import { getNotesList } from '@/apis/note'


const calendar = ref<CalendarInstance>()
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
const noteList = ref([])
const pageParams = reactive({
  page: 1,
  size: 10
})
const getNoteList = () => {
  getNotesList(pageParams).then(res => {
    if (res.code === 200) {
      const { data = {} } = res
      noteList.value = data.list
    }
  })
}
getNoteList()
</script>
<style lang="scss" scoped>
.home-container {
  ::v-deep(.el-calendar__header) {
    font-size: 12px;
  }

  .plans-container {
    padding-left: 16px;
    margin-top: 8px;
    .plans-container-header {
      margin-bottom: 8px;
    }
    .plans-container-container {
      font-size: 12px;
      color: #545454;
      .plan-item {
        line-height: 18px;
      }
    }
  }

  .data {
    color: var(--el-text-color-regular);
  }

  .el-card {
    margin: 12px 20px;
  }
}
</style>