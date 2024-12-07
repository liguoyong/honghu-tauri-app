<template>
    <el-drawer class="todoDrawer" v-model="props.drawer.show" size="578px" :direction="direction">
        <template #header>
            <h4>{{ props.drawer.title }}</h4>
        </template>
        <template #default>
            <div>
                <el-descriptions :column="1" title="" direction="vertical">
                    <el-descriptions-item label="标题：">{{ props.drawer.data.title }}</el-descriptions-item>
                    <el-descriptions-item label="描述：">{{ props.drawer.data.desc }}</el-descriptions-item>
                    <el-descriptions-item label="日期：">{{ props.drawer.data.date }}</el-descriptions-item>
                    <el-descriptions-item label="内容：">
                        <div v-html="props.drawer.data.content"></div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
        </template>
        <!-- <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">cancel</el-button>
                <el-button type="primary" @click="confirmClick">confirm</el-button>
            </div>
        </template> -->
    </el-drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
    drawer: {
        type: Object,
        default() {
            return {
                show: false,
                title: '查看详情',
                data: {}
            }
        }
    }
})
const direction = ref('rtl')
</script>
<style lang="scss" scoped>
.todoDrawer {
    .el-drawer__header {
        margin-bottom: 0;

        h4 {
            font-size: 20px;
            color: #031321;
            font-family: PingFang SC;
            font-weight: bold;
            padding: 0;
            margin: 0;
        }
    }
}
</style>
