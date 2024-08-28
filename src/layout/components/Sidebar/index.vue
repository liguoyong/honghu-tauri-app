<template>
  <div class="el-menu-slider-container" :style="{ width: isCollapse ? '46px' : '160px' }">
    <el-scrollbar>
      <el-menu size="small" v-model="activeMenu" :default-active="activeMenu"
        mode="vertical" router 
        :collapse="isCollapse" 
        @open="handleOpen" 
        @close="handleClose"
        :class="{ 'collapse': isCollapse, 'expand': !isCollapse }" 
        :style="{ width: isCollapse ? '46px' : '160px', height: `calc(100vh - 56px)` }">
        <sidebar-item v-for="item in routerData" :item="item" :key="item.path"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import SidebarItem from "./SidebarItem.vue";
import { routes } from "@/route/index.ts";
import { useRoute } from 'vue-router'
import { useAppStore } from "@/stores/app.ts";
const route = useRoute()

const appStore = useAppStore();
import _ from "lodash";
const { isCollapse } = storeToRefs(appStore);
const activeMenu = ref(route.meta.activeMenu || route.path)
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
const getMenuList = function (data, basePath) {
  if (!data) {
    return [];
  }
  data = data.filter((item) => !item.hidden); // 过滤隐藏的菜单
  data = data.map((item) => {
    if (basePath) {
      // 拼接path
      item.path = `${basePath}${item.path.startsWith("/") || basePath === "/" ? "" : "/"
        }${item.path}`;
    }
    if (item.children && item.children.length > 1) {
      // 存在子级继续递归
      item.children = getMenuList(item.children, item.path);
    } else if (item.children && item.children.length == 1) {
      const { children = [{}] } = item
      const [{ path = '' }] = children
      if (item.path !== '/') {
        item.path = item.path + (!path.includes('/') ? '/' + path : '')
      }
      item.children = null
    }
    return item
  });
  return data;
};
const menuData = _.cloneDeep(routes);
const routerData = getMenuList(menuData);
const logo = "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png";
watch(route, (newRoute, oldRoute) => {
  console.log('newRoute.meta.activeMenu', newRoute)
  // 只在初始化时执行一次回调函数
  const activeMenuPath = newRoute.meta.activeMenu || ''
  activeMenuPath ? activeMenu.value = activeMenuPath : ''
})
onMounted(async () => {
  console.log(activeMenu.value, routerData, 'routerData');
})



</script>

<style lang="scss">
.el-menu-slider-container {
  overflow: hidden;
  width: 160px;
  background: #fff;
  transition: width 0.5s ease;

  .el-menu {
    border-right: none;
    .svg-icon {
      vertical-align: middle;
      width: var(--el-menu-icon-width);
      text-align: center;
      height: 18px;
      margin-right: 5px;
    }
  }

  &:not(.el-menu--collapse) {
    width: 160px;
    min-height: 160px;
  }

  .el-icon:not(.el-sub-menu__icon-arrow) {
    color: var(--el-color-primary);
  }
}
</style>
