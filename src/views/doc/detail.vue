<template>
    <div class="doc-view-container">
        <el-container>
            <el-aside v-show="showAside && treeData.length" width="300px">
                <el-card class="min-h-[400px]">
                    <el-tree ref="treeRef" class="treeRef" :data="treeData" :props="defaultProps" node-key="id"
                        :default-expanded-keys="expandedKeys" :default-checked-keys="checkedKeys"
                        :default-expand-all="true" :highlight-current="true" @node-click="handleNodeClick" />
                </el-card>
            </el-aside>
            <el-main id="mainRef" ref="mainRef" v-html="content" />
        </el-container>
    </div>
</template>

<script>
import { getDocDetail } from '@/apis/doc'
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.css'

export default {
    name: 'DocView',
    data() {
        return {
            content: '',
            version: '',
            docId: '',
            versionData: {},
            treeData: [],
            expandedKeys: [],
            checkedKeys: [],
            showAside: true,
            defaultProps: {
                children: 'children',
                label: 'text'
            },
            viewer: null
        }
    },
    async created() {
        const hideAside = this.$route.query.hideAside // 如果地址栏参数是1则隐藏
        this.showAside = hideAside !== '1'
        this.docId = this.$route.query.identifier
        const docId = this.docId
        const result = await getDocDetail({
            identifier: docId
        })
        if (result.code === 200) {
            const { content = '', status = true } = result.data
            this.parseHtmlAndGenerateTree(content)
            this.initViewer()
        } else {
            this.$message({
                message: result.message,
                type: 'error'
            })
        }
    },
    mounted() {
        
    },
    methods: {
        handleNodeClick(data) {
            const element = document.getElementById(data.id)
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth', // 平滑滚动
                    block: 'start', // 滚动到元素顶部
                    inline: 'nearest'
                })
            }
        },
        parseHtmlAndGenerateTree(htmlContent) {
            const parser = new DOMParser()
            const doc = parser.parseFromString(htmlContent, 'text/html')

            const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
            const tree = []

            headings.forEach(heading => {
                const level = parseInt(heading.tagName[1], 10)
                const text = heading.textContent.trim()

                // 为每个标题元素生成一个唯一的 ID
                const uniqueId = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                heading.id = uniqueId

                const node = {
                    text,
                    id: uniqueId,
                    level,
                    children: []
                }

                let current = tree
                for (let i = 1; i < level; i++) {
                    if (current[current.length - 1] && current[current.length - 1].children) {
                        current = current[current.length - 1].children
                    } else {
                        current.push({ children: [] })
                        current = current[current.length - 1].children
                    }
                }

                current.push(node)
            })

            // 更新 content 字符串以包含新生成的 ID
            this.content = doc.body.innerHTML
            this.treeData = tree
        },
        initViewer() {
            this.$nextTick(() => {
                console.log(this.$refs.mainRef.$el, 'this.$refs.mainRef')
                const images = this.$refs.mainRef.$el.querySelectorAll('img')
                if (images.length > 0) {
                    this.viewer = new Viewer(this.$refs.mainRef.$el, {
                        url: 'src'
                    })
                }
            })
        },
        onMainScroll(el) {
            const mainRect = document.getElementById('mainRef').getBoundingClientRect()
            const tree = this.versionData[this.version].tree
            const self = this
            // 递归循环tree节点，找到第一个当前可见的id,tree是数组
            function findVisibleId(tree) {
                for (const node of tree) {
                    if (node.children) {
                        const id = findVisibleId(node.children)
                        if (id) {
                            return id
                        }
                    } else {
                        const elem = document.getElementById(node.id)
                        if (elem && self.isElementInViewport(elem, mainRect)) {
                            return node.id
                        }
                    }
                }
            }
            const id = findVisibleId(tree)
            // 设置树节点勾选
            this.$refs.treeRef.setCheckedKeys([id])
        },

        isElementInViewport(element, containerRect) {
            const elemRect = element.getBoundingClientRect()
            return (
                elemRect.top >= containerRect.top &&
                elemRect.bottom <= containerRect.bottom
            )
        }
    }
}
</script>
<style lang="scss" scoped>
.doc-view-aside-icon {
    position: fixed;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
}

#mainRef {
    height: 100vh;
    overflow-y: auto;

    :deep(img) {
        max-width: 100%;
        height: auto;
    }
}

.treeRef {
    :deep(.is-current>.el-tree-node__content) {
        color: #409eff !important;
    }
}

.point {
    cursor: pointer;
}

.doc-view-container {
    background-color: #ffffff;
    overflow-y: auto;
    .el-tree {
        font-weight: bold;
    }
    .el-aside {
        background: #fff;
        max-height: 100vh;
        padding: 10px;
    }

    .tips {
        margin-bottom: 16px;
    }

    pre {
        white-space: pre-wrap;
        background: #f5f2f0;
        padding: 10px;
        line-height: 20px;
        font-size: 16px;
        word-break: break-all;
    }
}
</style>