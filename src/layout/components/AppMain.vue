<template>
    <div class="main-box">
        <Transition name="slide-fade">
            <el-scrollbar ref="scrollMenuRef" class="scrollMenuBox">
                <router-view></router-view>
            </el-scrollbar>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
</script>

<style scoped lang="scss">
.main-box {
    flex: 20;
    overflow-y: auto !important;
    position: relative;
    height: calc(100% - 56px);
}

.main-box::-webkit-scrollbar {
    width: 8px;
}

.main-box::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: var(--scroll-thumb);
}

.main-box::-webkit-scrollbar-track {
    border-radius: 0;
    background: var(--scroll-track);
}
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
// .scrollMenuBox {
//   height: calc(100vh - 80px);
//   width: 100%;
//   :deep(.el-scrollbar__wrap) {
//     overflow-x: hidden;
//   }
//   :deep(.el-scrollbar__view) {
//     height: 100%;
//   }
// }
</style>