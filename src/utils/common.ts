import clipboard3 from 'vue-clipboard3'
const { toClipboard } = clipboard3()
import { ElMessage } from 'element-plus'

// 列表tooltip提示配置
export const tooltipOptions = { enterable: true, effect: 'light', 'popperClass': 'tooltipPopperClass', placement: 'bottom', showArrow: true, hideAfter: 200, popperOptions: { strategy: 'fixed' } }

// 复制文本
export const copyText = async (text: string) => {
    try {
        await toClipboard(text)
        ElMessage({
            type: 'success',
            message: '复制成功!'
        })
    } catch (err) {
        console.error(err)
        ElMessage({
            type: 'error',
            message: '复制失败，请手动复制'
        })
    }
}

//获取url中的参数方法
export function getUrlKey(name: string, url: string) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null
  }