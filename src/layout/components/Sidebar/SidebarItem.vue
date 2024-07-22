<template>
  <el-menu-item v-if="!item.children || !item.children.length" :index="item.path">
    <el-icon v-if="item.meta.icon">
      <component :is="item.meta.icon" />
    </el-icon>
    <span>{{ item.meta.title }}</span>
  </el-menu-item>

  <el-sub-menu v-else :index="item.path">
    <template #title>
      <el-icon v-if="item.meta.icon">
        <component :is="item.meta.icon" />
      </el-icon>
      <span>{{ item.meta.title }}</span>
    </template>
    <template v-for="child in item.children" :key="child.path">
      <sidebar-item :item="child"></sidebar-item>
    </template>
  </el-sub-menu>
</template>
<script>
import { defineComponent } from 'vue';
import { RouterLink } from 'vue-router';

export default defineComponent({
  name: 'SidebarItem',
  components: {
    RouterLink
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  setup(props) {
  }
});
</script>
