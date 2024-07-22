<template slot="empty">
  <div class="data-empty">
    <div>
      <svg-icon :name="iconName"></svg-icon>
    </div>
    <div>{{ emptyText }}</div>
    <div v-if="description">{{ description }}</div>
  </div>
</template>
<script>
export default {
  props: {
    // 提示文字
    description: {
      type: String,
      default: ''
    },
    iconName: {
      type: String,
      default: 'nodata'
    },
    emptyText: {
      type: String,
      default: '暂无数据'
    }
  },
}
</script>
  
<style scoped lang="scss">
.data-empty {
  padding: 20px 0;

  .svg-icon {
    display: inline-block;
    width: 152px;
    height: 120px;
    margin-bottom: 32px;
  }

  div {
    line-height: 20px;
    color: #8B8F92;
    font-size: 14px;
  }
}
</style>
  
  