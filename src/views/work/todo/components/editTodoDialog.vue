<template>
    <com-dialog width="60%" class="todoDialogForm" v-model="props.dialog.show"
        :title="props.dialog.type === 'add' ? '新增待办事项' : '编辑待办事项'" destroy-on-close @confirm="handleSubmit">
        <com-form ref="formRef" class="todoForm" v-model="props.dialog.form" :options="formOptions" :rules="rules"
            @submit="handleSubmit" label-width="80px">
            <template #date>
                <el-form-item class="content-item" label="时间" prop="date">
                    <el-date-picker v-model="props.dialog.form.date" type="datetimerange" range-separator="至"
                        placeholder="请选择时间" start-placeholder="开始时间" end-placeholder="结束时间" format="YYYY-MM-DD HH:mm:ss"
                        value-format="YYYY-MM-DD HH:mm:ss" date-format="YYYY/MM/DD ddd" time-format="A hh:mm:ss" />
                </el-form-item>
            </template>
            <!-- 此处注意写法v-model:content -->
            <template #content>
                <el-form-item class="content-item" label="内容" prop="content">
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
import { FormOption } from '@/components/form/types'
import { QuillEditor } from '@vueup/vue-quill'
import { updateTodo, createTodo } from '@/apis/todo'
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
    { label: '标题', prop: 'title', required: true },
    { label: '描述', prop: 'desc', required: true },
    { label: '时间', prop: 'date', required: true, slot: 'date' },
    {
        label: '优先级', component: 'el-select', prop: 'priority', required: true, props: {
            options: [{
                label: '高',
                value: 1
            }, {
                label: '中',
                value: 2
            }, {
                label: '低',
                value: 3
            }]
        }
    },
    {
        label: '状态', component: 'el-select', prop: 'status', required: true, props: {
            // 0:未开始、1:进行中、2:已完成、3:已取消
            options: [{
                label: '未开始',
                value: 0
            }, {
                label: '进行中',
                value: 1
            }, {
                label: '已完成',
                value: 2
            }, {
                label: '已取消',
                value: 3
            }]
        }
    },
    {
        label: '类型', component: 'el-select', prop: 'type', required: true, props: {
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
    { label: '内容', prop: 'content', required: true, slot: 'content' }
])
const rules = reactive<FormRules<RuleForm>>({
    title: [
        { required: true, message: '请填写标题', trigger: 'blur' },
    ],
    desc: [
        { required: true, message: '请填写描述', trigger: 'blur' },
    ],
    date: [
        { required: true, message: '请选择时间', trigger: 'change blur' }
    ],
    priority: [
        { required: true, message: '请选择优先级', trigger: 'change' }
    ],
    status: [
        { required: true, message: '请选择状态', trigger: 'change' }
    ],
    type: [
        { required: true, message: '请选择或输入类型', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请填写内容', trigger: 'blur' },
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
                res = await createTodo({ ...form, startTime: form.date[0], endTime: form.date[1], type: form.type.join(',') })
            } else {
                res = await updateTodo({ ...form, startTime: form.date[0], endTime: form.date[1], type: form.type.join(',') })
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
