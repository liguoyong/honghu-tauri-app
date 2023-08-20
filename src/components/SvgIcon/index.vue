<template>
  <svg :class="svgClass" v-bind="$attrs" :style="{ color: color }">
    <use :xlink:href="iconName" rel="external nofollow" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: ''
  }
})


const svgClass = computed(() => {
  console.log(props.name, 'svgClass');
  if (props.name) {
    return `svg-icon icon-${props.name}`
  }
  return `svg-icon`
});
const iconName = computed(() => {
  console.log(props, 'iconName');
  return `#icon-${props.name}`
});
</script>

<style lang='scss'>
.svg-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  vertical-align: middle;
}
</style>
