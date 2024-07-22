<template>
    <div class="layout-wrapper svg-container">
        <com-page-header title="所有图标" @back="goBack" />
        <el-row :gutter="12">
            <el-col :span="4" :xs="12" :sm="3" :md="3" :lg="3" :xl="3" class="svg-container-item" v-for="item in icons"
                :key="item.name">
                <el-card shadow="hover" @dblclick="copyIcon(item.name)">
                    <svg-icon :name="item.name"></svg-icon>
                    <div class="svg-icon-name">{{ item.name }}</div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { copyText } from '@/utils/common'
const router = useRouter()
const icons = ref([]);

const getFileName = (path) => {
    const fileNameWithExtension = path.split('/').pop();
    const fileNameWithoutExtension = fileNameWithExtension.split('.')[0];
    return fileNameWithoutExtension
}

const copyIcon = async (name) => {
    copyText(`<svg-icon name="${name}"></svg-icon>`)
}

const goBack = () => {
    router.push('/operational/tool')
}

onMounted(async () => {
    const iconFiles = import.meta.glob('@/icons/svg/*.svg');

    const files = Object.keys(iconFiles);

    icons.value = files.map((item) => {
        return { name: getFileName(item) }
    })
});
</script>
<style lang="scss" scoped>
.svg-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;

    .svg-container-item {
        // width: 120px;
        margin-bottom: 20px;
        text-align: center;

        :deep(.el-card__body) {
            background: #efefef;
        }

        .svg-icon {
            font-size: 24px;
            height: 24px;
        }

        .svg-icon-name {
            margin-top: 12px;
        }
    }
}
</style>
