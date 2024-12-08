<template>
  <div :class="{ fullscreen }" class="tinymce-container" :style="{ width: containerWidth }">
    <textarea :id="tinymceId" class="tinymce-textarea" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onActivated, onDeactivated, onBeforeUnmount, nextTick } from 'vue'
import plugins from './plugins'
import toolbar from './toolbar'
import load from './dynamicLoadScript'
import { uploadFileToObs } from '@/apis/upload'

const tinymceCDN = window.location.origin + '/tinymce/tinymce.min.js'
// const customPluginPath = window.location.origin + '/tinymce/plugins/title/customTitlePlugin.js' // 确保路径正确
const props = defineProps({
  id: {
    type: String,
    default: () => 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
  },
  modelValue: {
    type: String,
    default: ''
  },
  toolbar: {
    type: Array,
    required: false,
    default: () => []
  },
  menubar: {
    type: String,
    default: 'file edit insert view format table'
  },
  height: {
    type: [Number, String],
    required: false,
    default: 360
  },
  width: {
    type: [Number, String],
    required: false,
    default: 'auto'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'fullscreen'])

const hasChange = ref(false)
const hasInit = ref(false)
const tinymceId = ref(props.id)
const fullscreen = ref(false)

const languageTypeList = reactive({
  'en': 'en',
  'zh': 'zh_CN',
  'es': 'es_MX',
  'ja': 'ja'
})

const containerWidth = computed(() => {
  const width = props.width
  if (/^[\d]+(\.[\d]+)?$/.test(width)) { // matches `100`, `'100'`
    return `${width}px`
  }
  return width
})

watch(() => props.modelValue, (val) => {
  if (!hasChange.value && hasInit.value) {
    nextTick(() =>
      window.tinymce.get(tinymceId.value).setContent(val || ''))
  }
})

onMounted(() => {
  init()
})

onActivated(() => {
  if (window.tinymce) {
    initTinymce()
  }
})

onDeactivated(() => {
  destroyTinymce()
})

onBeforeUnmount(() => {
  destroyTinymce()
})

function init() {
  // dynamic load tinymce from cdn
  load([tinymceCDN], (err) => {
    if (err) {
      // 这里假设有一个全局的 message 组件，实际项目中可能需要替换为具体的实现
      // this.$message.error(err.message)
      console.error(err.message)
      return
    }
    initTinymce()
  })
}

function initTinymce() {
  window.tinymce.init({
    content_css: '/tinymce/tinymce.css',
    selector: `#${tinymceId.value}`,
    language: languageTypeList['zh'],
    height: props.height,
    branding: false,
    body_class: 'panel-body ',
    object_resizing: false,
    toolbar: props.toolbar.length > 0 ? props.toolbar : toolbar,
    toolbar_mode: 'wrap',
    menubar: props.menubar,
    plugins: [...plugins, 'customTitle'],
    end_container_on_empty_block: true,
    powerpaste_word_import: 'clean',
    code_dialog_height: 450,
    code_dialog_width: 1000,
    advlist_bullet_styles: 'square',
    advlist_number_styles: 'default',
    fontsize_formats: '8px 10px 12px 14px 16px 18px 20px 24px 36px 42px',
    // imagetools_cors_hosts: ['www.tinymce.com', 'codepen.io'],
    default_link_target: '_blank',
    link_title: false,
    paste_data_images: true, // 允许粘贴图片
    nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
    init_instance_callback: editor => {
      if (props.modelValue) {
        editor.setContent(props.modelValue)
      }
      hasInit.value = true
      editor.on('NodeChange Change KeyUp SetContent', () => {
        hasChange.value = true
        emit('update:modelValue', editor.getContent())
      })
    },
    setup(editor) {
      editor.on('FullscreenStateChanged', (e) => {
        fullscreen.value = e.state
        emit('fullscreen', e.state)
      })
    },
    convert_urls: false,
    readonly: props.disabled, // 设置只读模式
    images_upload_handler: (blobInfo, progress) => new Promise((resolve, reject) => {
      // 上传逻辑
      const formData = new FormData()
      formData.append('file', blobInfo.blob()) // 假设服务器端接受名为 'file' 的字段
      uploadFileToObs(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(res => {
        if (res.code === 200) {
          resolve(res.data.url)
        } else {
          reject('上传失败')
        }
      })
    }),
  })
}

function destroyTinymce() {
  const tinymce = window.tinymce.get(tinymceId.value)
  if (fullscreen.value) {
    tinymce.execCommand('mceFullScreen')
  }

  if (tinymce) {
    tinymce.destroy()
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;

  :deep(.tox-promotion) {
    visibility: hidden !important;
    display: none !important;
  }
  :deep(.tox .tox-editor-header) {
    display: block;
  }
}

.tinymce-container {
  :deep(.mce-fullscreen) {
    z-index: 10000;
  }
}

.tinymce-textarea {
  visibility: hidden;
  z-index: -1;
}

.editor-custom-btn-container {
  position: absolute;
  right: 4px;
  top: 4px;
  /*z-index: 2005;*/
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}
</style>