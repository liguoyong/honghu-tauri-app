export interface FormOption {
[x: string]: any
  component?: string
  label?: string
  prop: string
  required?: boolean
  slot?: string
  props?: any
  defaultValue?: any
}

export interface UploadOption extends FormOption {
  component: 'el-upload';
  props: {
    action: string; // 上传地址
    accept?: string; // 接受的文件类型
    multiple?: boolean; // 是否支持多选
    limit?: number; // 最大允许上传个数
    onExceed?: (files: File[], fileList: File[]) => void; // 文件超出个数限制时的钩子
    onSuccess?: (response: any, file: File, fileList: File[]) => void; // 文件上传成功时的钩子
    onError?: (err: any, file: File, fileList: File[]) => void; // 文件上传失败时的钩子
    // 其他 el-upload 支持的 props
  };
}