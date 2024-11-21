<template>
    <div class="layout-wrapper">
        <el-form :inline="true" :model="ruleForm" size="small" ref="planFormRef" class="filter-container" @submit.prevent>
            <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title" placeholder="请输入标题" clearable />
            </el-form-item>
            <el-form-item label="状态">
            <el-select
                v-model="ruleForm.status"
                placeholder="请选择状态"
                clearable
            >
                <el-option v-for="item in STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">查询</el-button>
                <el-button @click="resetForm(planFormRef)">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="btns-container">
            <el-button type="primary" size="small" @click="handelCreateTodo">
                <el-icon color="#fff" style="margin-right: 8px;">
                    <Plus />
                </el-icon>新增待办事项
            </el-button>
        </div>
        <el-table :data="tableData" size="small" stripe style="width: 100%" @row-dblclick="handelClickViewDetail">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="desc" label="描述" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="截止时间" />
            <el-table-column prop="priority" label="优先级">
                <template #default="{ row }">
                    {{ filterPriority(row.priority) }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态">
                <template #default="{ row }">
                    {{ filterStatus(row.status) }}
                </template>
            </el-table-column>
            <el-table-column prop="type" label="类型">
                <template #default="{ row }">
                    {{ row.type }}
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template #default="scope">{{ transformTimeDate(scope.row.startTime) }}</template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleClickEdit(scope.row.id)">编辑</el-button>
                    <el-button link type="danger" size="small" @click="handleClickDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
            <template #empty>
                <data-empty></data-empty>
            </template>
        </el-table>
        <div class="common-pagination">
            <com-pagination :current-page="pageParams.page" size="small" :page-size="pageParams.size" :total="pageParams.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
        <editTodoDialog :dialog="updateDialog" @close="handelCloseEditDialog" />
        <todo-drawer :drawer="drawer" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { reactive } from 'vue'

import { getTodoList, getDeleteTodo, getTodoDetail } from '@/apis/todo'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import editTodoDialog from './components/editTodoDialog.vue'
import TodoDrawer from './components/TodoDrawer.vue'
const ruleForm = reactive({
    title: '',
    status: ''
})
import { STATUS_OPTIONS } from './constants'
interface RuleForm {
    title: string,
    desc: string,
    content: string
}
const pageParams = reactive({
    page: 1,
    size: 10,
    total: 0
})
const updateDialog = reactive({
    show: false,
    type: 'update',
    form: { content: '' }
})
const planFormRef = ref<FormInstance>()
const drawer = reactive({
    show: false,
    title: '查看详情',
    data: {}
})
const onSearch = () => {
    getList()
}
const tableData = ref([])
const getList = async () => {
    const response = await getTodoList({ ...ruleForm, ...pageParams })
    if (response.code == 200) {
        const { list = [], total } = response.data
        tableData.value = response.data.list
        pageParams.total = total
    }
}
getList()
const transformTimeDate = (date: string) => {
    return date
}
const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    ruleForm.status = ''
    formEl.resetFields()
    getList()
}

const handleSizeChange = (val: number) => {
    pageParams.size = val
    getList()
}

const handleCurrentChange = (val: number) => {
    pageParams.page = val
    getList()
}

const handleClickEdit = async (id: number) => {
    const { code, data = {} } = await getTodoDetail({ id: id })
    const type = data.type ? data.type.split(',') : ''
    if (code == 200) {
        updateDialog.type = 'edit'
        updateDialog.form = { ...data, date: [data.startTime, data.endTime], type }
        updateDialog.show = true
    }
}
const handelClickViewDetail = async (row: { 'id': string, [key: string]: string }) => {
    const { code = 0, data = {} } = await getTodoDetail({ id: row.id })
    if (code === 200) {
        drawer.show = true
        drawer.title = '查看待办事项详情'
        drawer.data = data
    }
}
const handelCreateTodo = () => {
    updateDialog.type = 'add'
    updateDialog.form = { content: '' }
    updateDialog.show = true
}
const handleClickDelete = async (id: number) => {

    ElMessageBox.confirm(
        '确认删除该待办事项?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await getDeleteTodo({ id })
            getList()
            ElMessage({
                type: 'success',
                message: '删除完成',
            })
        })
        .catch(() => {
            // ElMessage({
            //     type: 'info',
            //     message: 'Delete canceled',
            // })
        })

}

const handelCloseEditDialog = (key: number | undefined) => {
    updateDialog.show = false
    if (key == 1) {
        getList()
    }
}
const filterPriority = (priority: number) => {
    switch (priority) {
        case 1:
            return '高'
            break;
        case 2:
            return '中'
            break;
        case 3:
            return '低'
        default:
            return ''
            break;
    }
}

const filterStatus = (status: number) => {
    switch (status) {
        case 0:
            return '未开始'
            break;
        case 1:
            return '进行中'
            break;
        case 2:
            return '已完成'
            break;
        case 3:
            return '已取消'
        default:
            return ''
            break;
    }
}

</script>

<style>
.demo-form-inline .el-input {
    --el-input-width: 220px;
}
</style>
