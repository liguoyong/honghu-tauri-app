import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    // 定义state
    state: () => {
        return {
            env: '',
            baseUrl: '',
            isCollapse: false,
            lang: 'zh'
        }
    },
    // 定义getters
    getters: {
    },
    // 定义action
    actions: {
    },
})
