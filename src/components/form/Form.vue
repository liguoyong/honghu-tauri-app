<template>
  <el-form ref="formRef" :model="form" :rules="rules" v-bind="$attrs">
    <template v-for="item in options" :key="item.prop">
      <el-form-item v-if="!item.slot" :label="item.label" :prop="item.prop" :required="item.required">
        <component :is="item.component || 'el-input'" v-model="form[item.prop]" v-bind="item.props">
          <template v-if="item.component === 'el-select'">
            <el-option v-for="(o, i) in item.props.options" :key="i" v-bind="o" />
          </template>
          <template v-else-if="item.component === 'el-radio-group'">
            <el-radio v-for="(o, i) in item.props.options" :key="i" :label="o.value">{{ o.label }}</el-radio>
          </template>
        </component>
      </el-form-item>
      <slot v-if="item.slot" :name="item.slot" v-bind="item"></slot>
    </template>
    <slot></slot>
  </el-form>
</template>

<script setup lang='ts'>
import { PropType, computed, ref } from 'vue'
import { FormOption } from './types.ts'
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  },
  options: {
    type: Array as PropType<FormOption[]>,
    default: () => []
  },
  rules: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:modelValue', 'reset', 'submit'])
const form = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val.value)
  }
})

const formRef = ref()
const validate = (cb: any) => {
  formRef.value?.validate(cb)
}

const resetFields = () => {
  formRef.value?.resetFields()
}

defineExpose({
  validate,
  resetFields
})
</script>

<style lang='scss' scoped>
</style>
