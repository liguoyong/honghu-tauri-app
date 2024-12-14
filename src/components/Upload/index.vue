<template>
    <div class="upload-container">
      <el-upload
        ref="uploadRef"
        :headers="headers"
        :data="data"
        :multiple="multiple"
        :accept="accept"
        :before-upload="beforeUpload"
        :on-change="handleChange"
        :on-success="handleSuccess"
        :on-error="handleError"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="autoUpload"
        :drag="drag"
        :limit="limit"
        :on-exceed="handleExceed"
        :http-request="customUploadRequest"
      >
        <template v-if="drag">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip" v-if="tip">{{ tip }}</div>
        </template>
        <template v-else>
          <el-button slot="trigger" type="primary">选取文件</el-button>
          <el-button type="success" @click="submitUpload" v-if="!autoUpload">上传到服务器</el-button>
          <div class="el-upload__tip" slot="tip" v-if="tip">{{ tip }}</div>
        </template>
      </el-upload>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue'
  import { ElUpload, ElButton } from 'element-plus'
  import { useUserStore } from '@/stores/user'
  import { uploadFileToObs } from '@/apis/upload'
  import axios from 'axios' // 使用 axios 进行 HTTP 请求
  
  interface Props {
    action: string // 上传的 URL 地址
    headers?: Record<string, string> // 设置上传的请求头部
    data?: Record<string, any> // 上传时附带的额外参数
    multiple?: boolean // 是否支持多选文件
    accept?: string // 接受上传的文件类型（例如：.jpg,.png）
    beforeUpload?: (file: File) => boolean | Promise<boolean> // 上传前的钩子
    onChange?: (file: File, fileList: File[]) => void // 文件状态改变时的钩子
    onSuccess?: (response: any, file: File, fileList: File[]) => void // 上传成功时的钩子
    onError?: (error: any, file: File, fileList: File[]) => void // 上传失败时的钩子
    onRemove?: (file: File, fileList: File[]) => void // 文件列表移除文件时的钩子
    fileList?: File[] // 上传的文件列表
    autoUpload?: boolean // 是否在选取文件后立即进行上传
    drag?: boolean // 是否启用拖拽上传
    limit?: number // 最大允许上传个数
    tip?: string // 提示说明文字
  }
  
  const userStore = useUserStore()
  console.log(userStore)
  
  const props = withDefaults(defineProps<Props>(), {
    action: '/api/uploadFile', // 默认上传地址
    limit: 1, // 默认最大上传文件数量
    fileList: () => [] as File[],
    autoUpload: true,
    headers: () => {
      const userStore = useUserStore()
      return { "Authorization": `Bearer ${userStore.userToken}` } // 移除 Content-Type
    }
  })
  
  const emit = defineEmits(['change', 'success', 'error', 'remove'])
  
  const uploadRef = ref<InstanceType<typeof ElUpload>>()
  
  const handleChange = (file: File, fileList: File[]) => {
    emit('change', file, fileList)
  }
  
  const handleSuccess = (response: any, file: File, fileList: File[]) => {
    emit('success', response, file, fileList)
  }
  
  const handleError = (error: any, file: File, fileList: File[]) => {
    emit('error', error, file, fileList)
  }
  
  const handleRemove = (file: File, fileList: File[]) => {
    emit('remove', file, fileList)
  }
  
  const handleExceed = (files: File[], fileList: File[]) => {
    console.warn(`当前限制选择 ${props.limit} 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
  }
  
  const submitUpload = () => {
    uploadRef.value?.submit()
  }
  
  // 自定义上传请求
  const customUploadRequest = (options: any) => {
    const formData = new FormData()
    formData.append('file', options.file) // 添加文件
  
    // 添加其他数据
    if (props.data) {
      for (const key in props.data) {
        formData.append(key, props.data[key])
      }
    }
    uploadFileToObs(formData, {
        headers: {
            ...props.headers,
            "Content-Type": "multipart/form-data",
        },
    }).then((res: any) => {
        options.onSuccess(res.data, options.file) // 上传成功
    }).catch(err => {
        options.onError(err, options.file) // 上传失败
    })
  }
  </script>
  
  <style scoped lang="scss">
  .upload-container {
    margin-bottom: 20px;
  }
  </style>