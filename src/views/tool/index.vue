<template>
    <div class="layout-wrapper tool-container">
        <el-tabs :tab-position="tabPosition" class="demo-tabs">
            <el-tab-pane v-for="(item, index) in configList" :key="index" :label="item.label">
                <div class="tool-tab-container" v-if="item.children.length">
                    <div class="tool-tab-item" v-for="(it, id) in item.children" :key="id"
                        @click="handelToUrl(it.url, it.target)">
                        <img class="tool-tab-img" :src="it.icon" alt="" srcset="" />
                        <div class="tool-tab-title">{{ it.title || '' }}</div>
                        <div class="tool-tab-description">{{ it.description || '' }}</div>
                    </div>
                </div>
                <div class="tool-tab-container" v-else>
                    <p>暂无数据</p>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const configList = reactive([
    {
        label: '办公专区', children: [{
            icon: 'https://img1.baidu.com/it/u=281324014,160585262&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            url: '/operational/tool/json',
            title: 'JSON格式化',
            description: '格式化JSON数据',
            target: '_self',
        },
        {
            icon: 'https://img2.baidu.com/it/u=3058861405,730789891&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            url: '/operational/tool/svg',
            title: 'SVG预览',
            description: 'SVG预览',
            target: '_self',
        },
        {
            icon: 'https://img2.baidu.com/it/u=3058861405,730789891&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            url: '/operational/tool/shell',
            title: 'shell',
            description: 'shell命令行',
            target: '_self',
        }, {
            icon: 'https://img2.baidu.com/it/u=3058861405,730789891&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
            url: '/operational/tool/flow',
            title: '思维导图',
            description: '思维导图，简单的思维导图页面',
            target: '_self',
        }, {
            icon: 'https://caniuse.com/img/favicon-128.png',
            url: 'https://caniuse.com/',
            title: 'Can I use',
            description: 'Caniuse用于查看浏览器对各种新特性的兼容情况',
            target: '_blank',
        }]
        // https://p2.itc.cn/images01/20210707/61e2e18662c447148f244dc969d12dc0.png
    },
    {
        label: '技术专区', children: [{
            icon: 'http://cxy521.com/static/img/index/tech/cnblogs.png',
            url: 'https://www.cnblogs.com/',
            title: '博客园',
            description: '开发者的网上家园',
            target: '_blank',
        }, {
            icon: 'http://cxy521.com/static/img/index/tech/csdn.png',
            url: 'https://www.csdn.net/',
            title: 'CSDN',
            description: '中文最大的技术社区',
            target: '_blank',
        }, {
            icon: 'http://cxy521.com/static/img/index/tech/juejin.png',
            url: 'https://juejin.cn/',
            title: '掘金',
            description: '一个帮助开发者成长的社区',
            target: '_blank',
        }, {
            icon: 'http://cxy521.com/static/img/index/tech/stackoverflow.svg',
            url: 'https://stackoverflow.com/',
            title: 'StackOverflow',
            description: '全球最大的技术问答社区',
            target: '_blank',
        }]
    },
    {
        label: '学习专区', children: [{
            icon: 'http://cxy521.com/static/img/index/study/cn.ico',
            url: 'https://www.runoob.com/',
            title: '菜鸟教程',
            description: '学的不仅是技术，更是梦想！',
            target: '_blank',
        }, {
            icon: 'http://cxy521.com/static/img/index/study/github.svg',
            url: 'https://github.com/',
            title: 'GitHub',
            description: '世界最大的开源代码共享社区',
            target: '_blank',
        }, {
            icon: 'http://cxy521.com/static/img/index/study/gitee.png',
            url: 'https://gitee.com/',
            title: 'Gitee',
            description: '中国最大的开源代码共享社区',
            target: '_blank',
        }, {
            icon: 'http://cxy521.com/static/img/index/study/w3.png',
            url: 'https://www.w3school.com.cn/',
            title: 'W3school',
            description: '全球最大的中文 Web 技术教程',
            target: '_blank',
        }]
    },
    {
        label: '框架专区', children: [{
            icon: 'http://www.alloyteam.com/nav/static/images/vue-favicon.png',
            url: 'https://cn.vuejs.org/',
            title: 'Vue',
            description: '构建数据驱动的web界面的渐进式框架',
            target: '_blank',
        }, {
            icon: 'http://www.alloyteam.com/nav/static/images/react-favicon.png',
            url: 'https://react.dev/',
            title: 'React',
            description: '用于构建用户界面的Javscript库',
            target: '_blank',
        }, {
            icon: 'https://www.midwayjs.org/img/logo.svg',
            url: 'https://www.midwayjs.org/',
            title: 'Midway',
            description: '基于渐进式理念研发的 Node.js 框架',
            target: '_blank',
        }, {
            icon: 'https://element-plus.youqua.cn/images/element-plus-logo.svg',
            url: 'https://element-plus.youqua.cn/zh-CN/',
            title: 'Element-plus',
            description: '基于 Vue 3，面向设计师和开发者的组件库',
            target: '_blank',
        },
        {
            icon: 'https://next.antdv.com/assets/logo.1ef800a8.svg',
            url: 'https://antdv.com/components/overview-cn',
            title: 'Ant-design-vue',
            description: '为 Web 应用提供了丰富的基础 UI 组件',
            target: '_blank',
        },
        {
            icon: 'https://fastly.jsdelivr.net/npm/@vant/assets/logo.png',
            url: 'https://vant-ui.github.io/vant/#/zh-CN',
            title: 'Vant 4',
            description: '轻量、可定制的移动端 Vue 组件库',
            target: '_blank',
        },
        {
            icon: 'https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-dark.svg',
            url: 'https://vuetifyjs.com/zh-Hans/',
            title: 'Vuetify',
            description: '一个无需设计技能的开源UI库，具有精美的手工制作的Vue组件',
            target: '_blank',
        },
        {
            icon: 'https://pinia.web3doc.top/logo.svg',
            url: 'https://pinia.web3doc.top/',
            title: 'Pinia',
            description: 'Vue 存储库',
            target: '_blank',
        },
        ]
    },
    { label: '摸鱼专区', children: [] },
    {
        label: '资源专区', children: [{
            icon: 'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg',
            url: 'https://www.iconfont.cn/',
            title: 'iconfont',
            description: '国内功能很强大且图标内容很丰富的矢量图标库',
            target: '_blank',

        }]
    },
    {
        label: '生活专区', children: [{
            icon: 'https://img.alicdn.com/imgextra/i4/O1CN01Z5paLz1O0zuCC7osS_!!6000000001644-55-tps-83-82.svg',
            url: 'https://passer-by.com/relationship/',
            title: '中国亲戚关系计算器',
            description: '逢年过节遇到三姑六婆，拒绝叫不出口的尴尬！轻松搞定亲戚关系～',
            target: '_blank',

        }]
    }])
const tabPosition = ref('right')
// 跳转页面
const handelToUrl = (url: string, target: undefined | string) => {
    if (target === '_self') {
        router.push(url)
    } else {
        window.open(url, '_blank')
    }

}
</script>
<style lang="scss" scoped>
.tool-container {
    height: calc(100% - 56px);
    .demo-tabs {
        background: #fff;
        height: 100%;
        padding: 10px;
    }
    .tool-tab-container {
        display: flex;
        flex-wrap: wrap;
        font-size: 14px;

        .tool-tab-item {
            font-size: 14px;
            text-align: center;
            cursor: pointer;
            width: 25%;
            margin-bottom: 40px;

            .tool-tab-img {
                width: 42px;
                height: 42px;
                display: inline-block;
            }
        }
    }
}

.demo-tabs>.el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
}

.el-tabs--right .el-tabs__content,
.el-tabs--left .el-tabs__content {
    height: 100%;
}
</style>
