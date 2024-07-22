<template>
    <div class="page-header-container">
            <el-page-header class="header-container-page" :icon="ArrowLeft" v-bind="$attrs">
                <template #content>
                    <span class="text-large font-600 mr-3">{{ props.title }}</span>
                </template>
            </el-page-header>
        </div>
</template>
<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<style scoped lang="scss">
.page-header-container {
    width: 100%;
    margin-bottom: 24px;
    :deep(.el-page-header__content) {
      font-size: 14px;
      font-weight: bold;
    }
}
</style>