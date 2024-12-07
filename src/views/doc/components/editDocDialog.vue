<template>
    <com-dialog width="60%" class="todoDialogForm" v-model="props.dialog.show"
        :title="props.dialog.type === 'add' ? '新增待办事项' : '编辑待办事项'" destroy-on-close @confirm="handleSubmit">
        <com-form ref="formRef" class="todoForm" v-model="props.dialog.form" :options="formOptions" :rules="rules"
            @submit="handleSubmit" label-width="80px">
            <!-- 此处注意写法v-model:content -->
            <template #content>
                <el-form-item class="content-item" label="文档内容" prop="content">
                    <div class="quill-container">
                        <QuillEditor ref="myQuillEditor2" theme="snow" v-model:content="props.dialog.form.content"
                            :options="data.editorOption" contentType="html" @update:content="setValue()" />
                    </div>
                </el-form-item>
            </template>
        </com-form>
    </com-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw, watch, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { FormOption } from '@/components/form/index'
import { QuillEditor } from '@vueup/vue-quill'
import { updateDoc, createDoc } from '@/apis/doc'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
interface RuleForm {
    title: string,
    date: string,
    desc: string,
    priority: string | number,
    status: string | number,
    type: string,
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
const myQuillEditor2 = ref()
const formOptions = computed<FormOption[]>(() => [
    { label: '文档名称', prop: 'title', required: true },
    { label: '文档描述', prop: 'desc', required: true },
    {
        label: '文档状态', component: 'el-select', prop: 'status', required: true, props: {
            // 0:未开始、1:进行中、2:已完成、3:已取消
            options: [{
                label: '停用',
                value: 0
            }, {
                label: '启用',
                value: 1
            }]
        }
    },
    {
        label: '文档类型', component: 'el-select', prop: 'type', required: true, props: {
            multiple: true,
            filterable: true,
            'allow-create': true,
            options: [{
                label: '工作',
                value: '工作'
            }, {
                label: '娱乐',
                value: '娱乐'
            }]
        }
    },
    { label: '文档内容', prop: 'content', required: true, slot: 'content' }
])
const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: '请填写文档标题', trigger: 'blur' },
    ],
    desc: [
        { required: true, message: '请填写文档描述', trigger: 'blur' },
    ],
    status: [
        { required: true, message: '请选择文档状态', trigger: 'change' }
    ],
    type: [
        { required: true, message: '请选择或输入文档类型', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请填写文档内容', trigger: 'blur' },
    ],
})
const data = reactive({
    content: '',
    editorOption: {
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'size': ['small', false, 'large', 'huge'] }],
                [{ 'font': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'header': 1 }, { 'header': 2 }],
                ['image'],
                [{ 'direction': 'rtl' }],
                [{ 'color': [] }, { 'background': [] }]
            ]
        },
        placeholder: '请输入内容...'
    }
})
// 抛出更改内容，此处避免出错直接使用文档提供的getHTML方法
const setValue = () => {
    const text = toRaw(myQuillEditor2.value).getHTML()
}
onMounted(() => {
    myQuillEditor2.value && toRaw(myQuillEditor2.value).setHTML(props.dialog.form.content)
});
function handleSubmit() {
    const form = {
        ...props.dialog?.form
    }
    console.log(form, 'form');
    formRef.value?.validate(async (valid: Boolean, fields: string[]) => {
        if (valid) {
            let res
            if (props.dialog.type === 'add') {
                res = await createDoc({ ...form, type: form.type.join(',') })
            } else {
                res = await updateDoc({ ...form, type: form.type.join(',') })
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
<style lang="scss" scoped>
.quill-container {
    width: 100%;
    border-radius: 4px;

    ::v-deep(.ql-container) {
        min-height: 200px;

    }

    ::v-deep(.ql-toolbar.ql-snow) {
        border-radius: 4px 4px 0 0;
    }

    ::v-deep(.ql-toolbar.ql-snow+.ql-container.ql-snow) {
        border-radius: 0 0 4px 4px;
    }
}

.todoForm {
    :deep(.el-select) {
        width: 100%;
    }
}
</style>
