<template>
    <com-dialog width="60%" class="ALiPayForm" v-model="props.dialog.show" title="导入支付宝账单" destroy-on-close
        @confirm="handleSubmit">
        <el-table :data="dialog.data" size="small">
            <el-table-column prop="transactionNumber" label="订单编号" />
            <el-table-column prop="payTime" label="交易时间" />
            <el-table-column prop="payType" label="交易分类" />
            <el-table-column prop="payUser" label="交易对方" />
            <el-table-column prop="payAccount" label="对方账号" />
            <el-table-column prop="goods" label="商品说明" />
            <el-table-column prop="consume" label="收/支" />
            <el-table-column prop="amount" label="金额" />
            <el-table-column prop="payWay" label="收/付款方式" />
            <el-table-column prop="status" label="当前状态" />
        </el-table>
    </com-dialog>
</template>
<script lang="ts" setup>
import { reactive, ref, toRaw, watch, computed, onMounted } from 'vue'
import { importNote } from '@/apis/bills.js'
const emits = defineEmits(['close'])
const props = defineProps({
    dialog: {
        type: Object,
        default() {
            return {
                show: false,
                data: []
            }
        }
    }
})
const handleSubmit = () => {
    importNote({ bills: props.dialog.data }).then(res => {
        if (res.code === 200) {
            props.dialog.show = false
            emits('close')
        }
    })
}
onMounted(() => {
});
</script>
<style lang="scss" scoped>
</style>
