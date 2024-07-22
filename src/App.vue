<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
const theme = ref(localStorage.getItem('theme') || 'light')
if (theme !== 'dark') {
  document.documentElement.setAttribute('theme', 'light')
  document.querySelector('html')?.classList.remove('dark')
  document.querySelector('html')?.classList.add('light')
  // userStore.setTheme('light')
} else {
  document.documentElement.setAttribute('theme', 'dark')
  document.querySelector('html')?.classList.remove('light')
  document.querySelector('html')?.classList.add('dark')
  // userStore.setTheme('dark')
}
watch(theme, (newTheme) => {
  if (newTheme != 'dark') {
    document.documentElement.setAttribute('theme', 'light')
    document.querySelector('html')?.classList.remove('dark')
    document.querySelector('html')?.classList.add('light')
    // userStore.setTheme('light')
  } else {
    document.documentElement.setAttribute('theme', 'dark')
    document.querySelector('html')?.classList.remove('light')
    document.querySelector('html')?.classList.add('dark')
    // userStore.setTheme('dark')
  }
})
// 监听 Local Storage 的变化
const onStorageChange = ({ key, newValue }: StorageEvent) => {
  if (key === 'theme') {
    theme.value = newValue || 'light'
  }
}

onMounted(() => {
  window.addEventListener('storage', onStorageChange)
})
</script>

<style scoped lang="scss"></style>
