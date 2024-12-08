<template>
    <el-card class="layout-wrapper">
        <template #header>
            <div class="card-header flex justify-between">
                <span>{{ isEdit ? '编辑文档' : '新增文档' }}</span>
                <div>
                    <el-button size="small" @click="handleBack">取消</el-button>
                    <el-button :loading="submitLoading" size="small" type="primary" @click="handleSubmit">确定</el-button>
                </div>
            </div>
        </template>
        <div>
            <com-form ref="formRef" class="docForm" v-model="formData" size="small" :options="formOptions"
                :rules="rules" @submit="handleSubmit" label-width="80px">
                <template #content>
                    <el-form-item class="content-item" label="文档内容" prop="content">
                        <div class="quill-container">
                            <Tinymce v-model="formData.content" height="600px"/>
                        </div>
                    </el-form-item>
                </template>
            </com-form>
        </div>
    </el-card>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw, watch, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { FormOption } from '@/components/form/index'
import { updateDoc, createDoc, getDocDetail } from '@/apis/doc'
import { useRouter, useRoute } from 'vue-router'
import Tinymce from '@/components/Tinymce/index.vue'

interface RuleForm {
    title: string,
    identifier: string,
    desc: string,
    status: string | number,
    type: string,
    content: string
}
const router = useRouter()
const route = useRoute()
const isEdit = ref(!!route.query.id)
const emits = defineEmits(['close'])
const formData = reactive({
    title: '',
    identifier: '',
    desc: '',
    status: '',
    type: [],
    content: ''
})
const formRef = ref()
const myQuillEditor2 = ref()
const submitLoading = ref(false)
const formOptions = computed<FormOption[]>(() => [
    { label: '文档名称', prop: 'title', required: true },
    { label: '文档标识', prop: 'identifier', required: true },
    { label: '文档描述', prop: 'desc', required: true, props: {
        type: 'textarea',
        rows: 3
    } },
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
    identifier: [
        { required: true, message: '请填写文档标识', trigger: 'blur' },
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
                [{ 'color': [] }, { 'background': [] }],
                [{ font: [] }],
                [{ align: [] }],
                ['clean'],
                ['link', 'image', 'video']
            ]
        },
        placeholder: '请输入内容...',
        language: 'zh-CN' // 设置语言为中文
    }
})
onMounted(async () => {
    if (route.query.id) {
        const id = route.query.id
        const { code, data = {} } = await getDocDetail({ id: id })
        const type = data.type ? data.type.split(',') : ''
        if (code == 200) {
            Object.assign(formData, { ...data, type })
        }
    }
    myQuillEditor2.value && toRaw(myQuillEditor2.value).setHTML(formData.content)

});
function handleBack() {
    router.push({
        path: '/work/doc'
    })
}
// 提交
function handleSubmit() {
    const form = {
        ...formData
    }
    console.log(form, 'form');
    formRef.value?.validate(async (valid: Boolean, fields: string[]) => {
        if (valid) {
            let res
            submitLoading.value = true
            console.log(isEdit.value, 'isEditisEditisEdit');
            if (!isEdit.value) {
                res = await createDoc({ ...form, type: form.type.join(',') })
            } else {
                res = await updateDoc({ ...form, id: route.query.id, type: form.type.join(',') })
            }
            submitLoading.value = false
            if (res.code === 200) {
                ElMessage.success(!isEdit.value ? '新增成功' : '更新成功')
                handleBack()
            } else {
                ElMessage.error(res.msg)
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

.docForm {
    :deep(.el-select) {
        width: 100%;
    }
}
</style>
