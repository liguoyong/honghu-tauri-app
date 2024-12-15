<template>
    <div class="layout-wrapper">
        <el-form :inline="true" :model="ruleForm" size="small" ref="planFormRef" class="filter-container" @submit.prevent>
            <el-form-item label="账号名" prop="username">
                <el-input v-model="ruleForm.username" placeholder="请输入账号名" clearable />
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
                </el-icon>新增用户
            </el-button>
        </div>
        <el-table :data="tableData" size="small" stripe style="width: 100%" @row-dblclick="handelClickViewDetail">
            <el-table-column prop="id" label="id" />
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="password" label="密码" />
            <el-table-column prop="phone" label="手机号" />
            <el-table-column prop="regtime" label="注册时间">
                <template #default="scope">
                    {{ transformTimeDate(scope.row.regtime) }}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
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
        <editUserDialog :dialog="updateDialog" @close="handelCloseEditDialog" />
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { reactive } from 'vue'

import { getUserList, deleteUser } from '@/apis/user'
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
import editUserDialog from '../components/editUserDialog.vue'
import dayjs from 'dayjs';
const ruleForm = reactive({
    username: '',
    status: ''
})
interface RuleForm {
    username: string,
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
    const response = await getUserList({ ...ruleForm, ...pageParams })
    if (response.code == 200) {
        const { list = [], total } = response.data
        tableData.value = response.data.list
        pageParams.total = total
    }
}
getList()
const transformTimeDate = (date: string = '') => {
    return date ? dayjs(date).format('YYYY-MM-DD HH:mm:ss') : ''
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
// 编辑
const handleEdit = (row: any) => {
    updateDialog.type = 'edit'
    updateDialog.form = row
    updateDialog.show = true
}
const handleClickDelete = async (id: number) => {

    ElMessageBox.confirm(
        '确认删除该用户吗?',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            await deleteUser({ id })
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
