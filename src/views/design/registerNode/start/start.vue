<template>
  <div class="node-title" ref="myNode">
    <span class="node-icon">
      <SvgIcon name="start" />
    </span>
    <span class="node-name"><span></span></span>
  </div>
</template>

<script setup lang="ts">
import variables from '@/style/variables.module.scss';
import { ref, onMounted, reactive } from 'vue';
const props = defineProps({
  properties: {
    type: Object,
    default: null,
  },
});
let myNode = ref(null);

onMounted(() => {
  let borderColor = variables.dragNodeBorderColor;
  if (props.properties.frontend_status == '0') {
    borderColor = variables.dangerColor;
  }
  myNode.value.style.border = `1px solid ${borderColor}`; //stroke边框
});
</script>

<style scoped lang="scss">
.node-icon {
  color: #6bd452;
  font-size: 17px;
}
</style>
