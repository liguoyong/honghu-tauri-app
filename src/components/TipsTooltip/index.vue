<template>
  <el-tooltip
    popper-class="tips-tooltip-main"
    :placement="placement"
    :title="title"
    :width="width"
    :content="content"
    v-bind="$attrs"
  >
    <template #content>
      <slot />
    </template>
    <slot name="trigger">
      <el-icon><QuestionFilled /></el-icon>
    </slot>
  </el-tooltip>
</template>
<script>
export default {
  name: 'TipsPopover',
  props: {
    title: {
      type: String,
      default: ''
    },
    placement: {
      type: String,
      default: 'top'
    },
    content: {
      type: String,
      default: ''
    },
    width: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {

    }
  }
}
</script>
  <style lang="scss">
  .tips-tooltip-main {
    max-width: 60vw !important;
  }
  </style>
