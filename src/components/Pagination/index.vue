<template>
    <el-pagination :page-sizes="pageSizes" :page-size="pageSize" :layout="layout" :size="size" :total="total"
        :current-page="currentPage" v-bind="$attrs" />
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'Pagination',
    props: {
        currentPage: {
            type: Number,
            default: 1,
            required: true
        },
        pageSize: {
            type: Number,
            default: 10
        },
        pageSizes: {
            type: Array,
            default: () => {
                return [10, 20, 50, 100]
            }
        },
        total: {
            type: Number,
            required: true
        },
        layout: {
            type: String,
            default: '->,total, sizes, prev, pager, next, jumper'
        },
        size: {
            type: String,
            default: 'small'
        }
    },
    setup(props, { emit, attrs }) {
        // const handlePageChange = (page) => {
        //     // 发送页码变化事件
        //     emit('currentChange', page);
        // };

        // const handleSizeChange = (size) => {
        //     emit('sizeChange', size);
        // }

        return {
            // handlePageChange,
            // handleSizeChange
        };
    }
};
</script>
