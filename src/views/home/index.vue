<template>
  <div class="home-container">
    <el-row>
      <el-col :span="12">
        <div class="grid-content ep-bg-purple" />
      </el-col>
      <el-col :span="12">
        <el-calendar ref="calendar" size="mini">
          <template #header="{ date }">
            <span>{{ date }}</span>
            <el-button-group>
              <el-button size="small" @click="selectDate('prev-year')">
                {{ $t('calendar.preYear') }}
              </el-button>
              <el-button size="small" @click="selectDate('prev-month')">
                {{ $t('calendar.preMonth') }}
              </el-button>
              <el-button size="small" @click="selectDate('today')">{{ $t('calendar.today') }}</el-button>
              <el-button size="small" @click="selectDate('next-month')">
                {{ $t('calendar.nextMonth') }}
              </el-button>
              <el-button size="small" @click="selectDate('next-year')">
                {{ $t('calendar.nextYear') }}
              </el-button>
            </el-button-group>
          </template>
        </el-calendar>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
const calendar = ref<CalendarInstance>()
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
</script>
<style lang="scss" scoped>
.home-container {
  ::v-deep(.el-calendar__header) {
    font-size: 12px;
  }
}
</style>