<template>
    <com-dialog width="60%" class="todoDialogForm" v-model="props.dialog.show"
        :title="props.dialog.type === 'add' ? '新增用户' : '编辑用户'" destroy-on-close @confirm="handleSubmit">
        <com-form ref="formRef" class="todoForm" v-model="props.dialog.form" :options="formOptions" :rules="rules"
            @submit="handleSubmit" label-width="80px">
            <el-form-item class="content-item" label="内容" v-slot="avatar" prop="content">
                <com-upload v-model="avatar.value" @success="handleUploadSuccess"/>
            </el-form-item>
        </com-form>
    </com-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw, watch, computed, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { FormOption } from '@/components/form/types'
import { registerUser, updateUserInfo } from '@/apis/user'
interface RuleForm {
    username: string,
    password: string,
    phone: string,
    avatar: ''
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
const handleUploadSuccess = (response, file, fileList) => {
    props.dialog.form.avatar = response.url
    console.log(response, file, fileList, 'response, file, fileList');
}
const formOptions = computed<FormOption[]>(() => [
    { label: '用户名', prop: 'username', props: { placeholder: "请填写用户名" }, required: true },
    { label: '密码', prop: 'password', props: { placeholder: "请填写密码" }, required: true },
    {
        label: '头像',
        component: 'el-upload',
        prop: 'avatar',
        required: true,
        slot: 'avatar',
    },
    { label: '手机号', prop: 'phone', props: { placeholder: "请填写手机号" }, required: true },
    {
        label: '角色', component: 'el-select', prop: 'priority', required: true, props: {
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
    }
])
const rules = reactive<FormRules<RuleForm>>({
    username: [
        { required: true, message: '请填写用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请填写密码', trigger: 'blur' },
    ],
    phone: [
        { required: true, message: '请选择手机号', trigger: 'change blur' }
    ],
    avatar: [
        { required: true, message: '请上传头像', trigger: 'change' }
    ]
})
function handleSubmit() {
    const form = {
        ...props.dialog?.form
    }
    console.log(form, 'form');
    formRef.value?.validate(async (valid: Boolean, fields: string[]) => {
        if (valid) {
            let res
            if (props.dialog.type === 'add') {
                res = await registerUser({ ...form })
            } else {
                res = await updateUserInfo({ ...form })
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
