<template>
  <svg aria-hidden="true" :class="['svg-icon', `svg-${name}`]" :style="style">
    <use :xlink:href="symbolId" />
  </svg>
</template>
 
<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'SvgIcon',
  props: {
    // 使用的svg图标名称，也就是svg文件名
    name: {
      type: String,
      required: true
    },
    prefix: {
      type: String,
      default: 'icon'
    },
    style: {
      type: Object,
      default: () => { }
    }
  },
  setup(props) {
    const symbolId = computed(() => `#${props.prefix}-${props.name}`)
    console.log(props.style);

    return { symbolId }
  }
})
</script>
 
<style scope>
.svg-icon {
  fill: currentColor;
}
</style>