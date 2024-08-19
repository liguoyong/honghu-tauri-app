<template>
    <div class="quill-container">
        <QuillEditor ref="myQuillEditor" theme="snow" v-model:content="editorContent" :options="editorOption"
            contentType="html" @update:content="updateContent" />
    </div>
</template>
<script lang="ts">
// import { toRaw } from 'vue'
import { uploadFile, uploadFileToObs } from '@/apis/upload'
import { QuillEditor, Quill } from '@vueup/vue-quill'
import { ImageDrop } from 'quill-image-drop-module'
// import ImageResize from 'quill-image-resize-module'
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css'
Quill.register("modules/imageUploader", ImageUploader);
Quill.register('modules/imageDrop', ImageDrop);
// Quill.register('modules/imageResize', ImageResize);
// 引入图片缩放插件
import 'quill-image-resize-module/image-resize.min.js'

export default {
    name: 'ComQuillEditor',
    components: {
        QuillEditor
    },
    props: {
        content: {
            default: ''
        }
    },
    data() {
        return {
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
                    ],
                    imageDrop: true, //图片拖拽
                    imageResize: {
                        displayStyles: {// 放大缩小
                            backgroundColor: "black",
                            border: "none",
                            color: "white",
                        },
                        modules: ["Resize", "DisplaySize", "Toolbar"],
                    },
                    imageUploader: {
                        upload: async (file: any) => {
                            try {
                                console.log(file,'filefile')
                                return new Promise((resolve, reject) => {
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    console.log(formData)
                                    uploadFileToObs(formData, {
                                        headers: {
                                            "Content-Type": "multipart/form-data",
                                        },
                                    }).then((res: any) => {
                                        resolve(res.data.url);
                                    }).catch(err => {
                                        reject("Upload failed");
                                        console.error("Error:", err)
                                    })
                                })
                            } catch (error) {
                                console.error('压缩和上传图像时出错:', error);
                            }
                        }
                    },
                },
                placeholder: '请输入内容...'
            }
        };
    },
    computed: {
        editorContent: {
            get() {
                return this.content;
            },
            set(newVal) {
                console.log('更新content', newVal);

                this.$emit('update:content', newVal);
            }
        }
    },
    methods: {
        updateContent(newVal) {
            this.editorContent = newVal;
        }
    }
}
</script>
<style lang="scss" scoped>
.quill-container {
    width: 100%;
    border-radius: 4px;

    :deep(.ql-container) {
        min-height: 200px;

    }

    :deep(.ql-toolbar.ql-snow) {
        border-radius: 4px 4px 0 0;
    }

    :deep(.ql-toolbar.ql-snow+.ql-container.ql-snow) {
        border-radius: 0 0 4px 4px;
    }
}
</style>