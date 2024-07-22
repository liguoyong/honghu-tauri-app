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
            <ul ref="todoList" class="todoList">
              <li v-for="item in items" :key="item.id">标题：{{ item.title }}</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="8" :xl="6">
        <el-card class="box-card mb-4">
          <template #header>
            <div class="card-header flex justify-between items-center">
              <span>每日账单</span>
              <el-icon>
                <Operation />
              </el-icon>
            </div>
          </template>
          <div class="text item">
            11111111
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
export default {
   setup() {
    const value = ref(new Date());
    const items = ref([]);
    let sortable;
     getTodoAll().then(res => {
      if (res.code === 200) {
        items.value = res.data
      } else {
        ElMessage.error(res.msg)
      }
    })

    onMounted(async () => {
      sortable = Sortable.create(document.querySelector('.todoList'), {
        onEnd: (evt) => {
          const item = items.value.splice(evt.oldIndex, 1)[0];
          items.value.splice(evt.newIndex, 0, item);
        }
      });
    });
    return {
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
