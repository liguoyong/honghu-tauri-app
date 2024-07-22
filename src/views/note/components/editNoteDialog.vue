<template>
    <com-dialog width="60%" class="noteForm" v-model="props.dialog.show"
        :title="props.dialog.type === 'add' ? '新增笔记' : '编辑笔记'" destroy-on-close @confirm="handleSubmit">
        <com-form ref="formRef" v-model="props.dialog.form" :options="formOptions" :rules="rules" @submit="handleSubmit">
            <el-form-item class="content-item" label="内容" v-slot="content" prop="content">
                <!-- 此处注意写法v-model:content -->
                <div class="quill-container">
                    <com-quill-editor v-model:content="props.dialog.form.content" />
                </div>
            </el-form-item>
        </com-form>
    </com-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw, watch, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { FormOption } from '@/components/form/index.ts'
import { updateNote, createNote } from '@/apis/note.ts'
interface RuleForm {
    title: string,
    desc: string,
    content: string
}
const emits = defineEmits(['close'])
const props = defineProps({
    dialog: {
        type: Object,
        default() {
            return {
                show: false,
                type: 'add',
                form: { content: '' }
            }
        }
    }
})
const formRef = ref()

const formOptions = computed<FormOption[]>(() => [
    { label: '标题', prop: 'title', required: true, props: { 'show-word-limit': true, 'maxlength': 50 } },
    { label: '描述', prop: 'desc', required: true, props: { 'show-word-limit': true, 'maxlength': 100 } },
    { label: '内容', prop: 'content', required: true, slot: 'content' },
])
const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: '请填写标题', trigger: 'blur' },
    ],
    desc: [
        { required: true, message: '请填写描述', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '请填写内容', trigger: 'blur' },
    ],
})
function handleSubmit() {
    const form = {
        ...props.dialog?.form
    }

    formRef.value?.validate(async (valid: Boolean, fields: string[]) => {
        if (valid) {
            let res
            if (props.dialog.type === 'add') {
                res = await createNote(form)
            } else {
                res = await updateNote(form)
            }
            if (res.code === 200) {
                ElMessage.success(props.dialog.type === 'add' ? '新增成功' : '更新成功')
                emits('close', 1)
            }
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>
<style lang="scss" scoped></style>