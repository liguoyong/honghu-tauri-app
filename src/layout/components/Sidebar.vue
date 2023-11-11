<template>
  <div class="expand-icon-container">
    <svg-icon name="expand" v-if="!appStore.isCollapse" @click="appStore.isCollapse = true" />
    <svg-icon name="collapse" v-else @click="appStore.isCollapse = false" />
    <div class="menu-container" v-if="!appStore.isCollapse">
      <div class="menu-item" v-for="(item, index) in filterRouterMap" :key="index"
        :class="{ 'menu-active': isChecked(item) }">
        <el-tooltip effect="dark" :content="$t(`menu.${item.name}`) || item.meta.title || ''" placement="right">
          <div class="svg-icon-container" @click="$router.push(item.redirect || '/')">
            <svg-icon :name="item.meta.icon" />
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { routes } from '@/route/index'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()
const appStore = useAppStore()

console.log(routes, 'routes', appStore.isCollapse)
const filterRouter = routes.filter((item, index) => {
  return !item.hidden
})
const filterRouterMap = filterRouter.map((item, index) => {
  return item
})
const isChecked = (item: any) => {
  return item.redirect === router.currentRoute.value.path
}
console.log(filterRouter, 'filterRouter')
console.log('routes----', routes)

const defaultMenu = localStorage.getItem("menuIndex") ? localStorage.getItem("menuIndex") as string : "0"

const clickMenu = (menuPath: string, menuIndex: string) => {
  console.log('点击了菜单--', '/index/' + menuPath, menuIndex)
  router.push('/index/' + menuPath)
  // 默认菜单和路由
  localStorage.setItem('menuIndex', menuIndex)
  localStorage.setItem("menuRoute", '/index/' + menuPath)
}
</script>

<style scoped lang="scss">
.menu-container {
  width: 44px;
  position: absolute;
  border: 1px solid #ccc;
  left: 16px;
  z-index: 100;
  border-radius: 24px;
  background: #474747;
  top: 50%;
  transform: translateY(-50%);
  display: none;

  .menu-item {
    text-align: center;

    .svg-icon-container {
      width: 36px;
      height: 36px;
      border-radius: 50%;

      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px auto;
      cursor: pointer;

      &:first-of-type {
        margin-top: 5px;
      }

      &:last-of-type {
        margin-bottom: 5px;
      }

      &:hover {
        background: #ededee;
      }
    }

    &.menu-active {
      .svg-icon-container {
        background: #ededee;
      }

    }

    .svg-icon {
      width: 16px;
      height: 16px;
    }
  }
}

.expand-icon-container {
  width: 16px;
  height: 16px;
  top: 50%;
  transform: translateY(-50%);
  position: absolute;
  z-index: 100;
  cursor: pointer;

  .svg-expand,
  .svg-collapse {
    width: 16px;
    height: 16px;
    color: var(--el-text-color-regular);
  }

  &:hover .menu-container {
    display: block;
  }
}
</style>
