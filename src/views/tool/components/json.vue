<template>
    <div class="layout-wrapper json-contianer">
        <com-page-header title="JSON格式化" @back="goBack" />
        <el-row :gutter="24">
            <el-col :span="12">
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="textarea">
                </el-input>
            </el-col>
            <el-col :span="12">
                <el-scrollbar>
                    <div class="json-operator-container">
                        <el-tooltip class="box-item" v-for="item in prettyConfig" :key="item" effect="dark"
                            :content="item.desctition" placement="bottom">
                            <el-icon :class="{ 'active': item.active }"
                                @click.native="handleCilckOperator(item.iconName, item)">
                                <component :is="item.iconName" />
                            </el-icon>
                        </el-tooltip>

                    </div>
                    <vue-json-pretty :data="!prettyConfig[0].active ? jsonData : coinData"
                        v-if="!prettyConfig[0].active ? jsonData : coinData" :showIcon="true" :showLine="true"
                        :showDoubleQuotes="true" :showKeyValueSpace="true" :showLineNumber="showLineNumber" />
                </el-scrollbar>
            </el-col>
        </el-row>

    </div>
</template>
  
<script>
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import data from '../../../../package.json'
import { ElMessage } from 'element-plus'
import { copyText } from '@/utils/common'
export default {
    components: {
        VueJsonPretty,
    },
    data() {
        return {
            jsonData: data,
            coinData: '',
            textarea: '',
            showLineNumber: false,
            prettyConfig: [{ //  压缩、显示行数、导出、复制、清空
                iconName: 'Coin',
                desctition: '压缩json',
                active: false
            }, {
                iconName: 'Operation',
                desctition: '显示行数',
                active: false
            }, {
                iconName: 'DocumentCopy',
                desctition: '复制json',
                active: false
            }, {
                iconName: 'Download',
                desctition: '导出json',
                active: false
            }, {
                iconName: 'DeleteFilled',
                desctition: '清空json',
                active: false
            }]
        }
    },
    watch: {
        textarea(val) {
            try {
                this.jsonData = JSON.parse(val)
            } catch (error) {
                console.log(error);
            }
        }

    },
    methods: {
        // 操作项
        async handleCilckOperator(name, data) {
            switch (data.iconName) {
                case 'Coin': // 压缩
                    data.active = !data.active
                    try {
                        let str = JSON.stringify(this.jsonData)
                        this.coinData = str.replace(/\s/g, '')
                    } catch (error) {
                        console.log(error);
                    }
                    break;
                case 'Operation': // 显示行数
                    data.active = !data.active
                    this.showLineNumber = data.active
                    break;
                case 'DocumentCopy': // 复制文本
                    copyText(!this.prettyConfig[0].active ? JSON.stringify(this.jsonData) : this.coinDat)
                    break;
                case 'DeleteFilled': // 清空内容
                    this.jsonData = ''
                    this.coinData = null
                    this.textarea = ''
                    break;
                case 'Download':
                    !this.jsonData && ElMessage({
                        type: 'warning',
                        message: '暂无数据'
                    })
                    this.jsonData && this.exportData(this.jsonData);
                    break;
                default: break;
            }

        },
        exportData(data) {
            // 将对象转换为JSON字符串
            const jsonStr = JSON.stringify(data);

            // 创建一个Blob对象，用于保存JSON字符串
            const blob = new Blob([jsonStr], { type: 'application/json' });

            // 创建一个a标签，并设置其href属性为Blob URL
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'data.json'; // 设置下载文件的名称

            // 生成一个点击事件并触发下载
            a.click();
            // 释放URL资源
            URL.revokeObjectURL(a.href);
            a.remove();
        },
        goBack() {
            this.$router.push('/operational/tool')
        }
    }
};
</script>
<style lang="scss" scoped>
.json-contianer {
    height: calc(100vh - 100px);
    overflow: hidden;

    .el-row,
    .el-col,
    .el-textarea {
        height: 100%;
    }

    .el-textarea :deep(.el-textarea__inner) {
        height: calc(100%  - 24px) !important;
    }

    .json-operator-container {
        margin-bottom: 8px;
        background: #fff;
        position: absolute;
        top: 0;
        z-index: 1;
        width: 100%;

        .el-icon {
            margin-right: 16px;
            color: #031321;
            cursor: pointer;

            &.active,
            &:hover {
                color: var(--el-color-primary);
            }
        }
    }

    .vjs-tree {
        margin-top: 26px;
    }
}
</style>>
