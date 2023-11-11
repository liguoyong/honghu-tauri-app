<template>
    <el-form class="information-container" label-position="right" size="small" label-width="100px"
        :model="formLabelAlign">
        <el-form-item label="用户头像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                </el-icon>
            </el-upload>
        </el-form-item>
        <el-form-item label="用户昵称">
            <el-input v-model="userForm.username" />
        </el-form-item>
        <el-form-item label="联系方式">
            <el-input v-model="userForm.phone" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">保存</el-button>
            <el-button>取消</el-button>
        </el-form-item>

    </el-form>
</template>
  
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { updateUserInfo } from '@/apis/user'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
const { userName, phone, avatar, userId } = userStore

const formLabelAlign = reactive({
    name: '',
    phone: ''
})
const userForm = reactive({
    username: userName,
    phone,
    avatar,
    id: userId
})

const onSubmit = () => {
    updateUserInfo(userForm).then(async res => {
        if (res.code === 200) {
            ElMessage.success('修改成功')
            await userStore.GET_USER_INFO()
        }
    })
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    console.log(response, 'response')
    userForm.avatar = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('Avatar picture must be JPG format!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}
</script>
  
<style lang="scss" scoped>
.information-container {
    max-width: 460px;
    margin: auto;
    margin-top: 50px;

    ::v-deep(.avatar-uploader) {
        .avatar {
            width: 128px;
            height: 128px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 128px;
            height: 128px;
            text-align: center;
        }
    }


}
</style>
