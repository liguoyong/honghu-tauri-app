<template>
    <div id="todo-container" data-tauri-drag-region>
        <!-- 侧边tab -->
        <!-- 数据list -->
        <!-- 固定日历 -->
        <div class="todo-left-container">
            <ul class="todo-menu">
                <li>
                    <svg-icon name="todo" />
                </li>
                <li>
                    <svg-icon name="history" />
                </li>
                <li>
                    <svg-icon name="ing" />
                </li>
            </ul>
        </div>
        <el-calendar class="todoCalendar" ref="calendar" v-model="value" style="width: 280px;">
        </el-calendar>
    </div>
</template>
<script lang="ts" setup>
// import miniCalendar from './components/miniCalendar.vue'
import { ref, reactive } from 'vue'
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import dayjs from 'dayjs';
const calendar = ref<CalendarInstance>()
const tabPosition = ref('left')
const value = ref(new Date())
const logTime = () => {
    const date = dayjs(new Date(value.value)).format('YYYY-MM-DD HH:mm:ss')
    console.log(date);
}
</script>

<style lang="scss" scoped>
#todo-container {
    height: 100%;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    font-size: 12px;

    .todo-left-container {
        .todo-menu {
            display: flex;
        }

        :deep(.svg-icon) {
            width: 14px;
            height: 14px;
        }
    }

    .el-calendar {
        transform-origin: top left;
        --el-calendar-cell-width: 34px;
    }

    :deep(.todoCalendar) {
        font-size: 12px;
        overflow: hidden;
        -webkit-transform: scale(0.7);
        transform: scale(0.7);
        -webkit-transform-origin: left top;
        transform-origin: right top;
        margin-bottom: -80px;

        .el-calendar__body {
            padding: 4px 8px 16px;
        }

        .el-calendar-table {
            .el-calendar-day {
                width: 20px;
            }

            thead th {
                padding: 4px 0;
            }
        }

        .el-calendar-table .el-calendar-day {
            padding: 6px 10px 6px;
        }
    }
}
</style>