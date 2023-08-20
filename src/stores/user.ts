import { defineStore } from 'pinia'
import { getUserInfo } from '@/apis/user'

export const useUserStore = defineStore('userInfo', {
    // 定义state
    state: () => {
        return {
            name: '',
            userName: localStorage.getItem('userName') || '',
            passWord: localStorage.getItem('passWord') || '',
            userToken: localStorage.getItem('userToken') || '',
            serverKey: localStorage.getItem('serverKey') || '',
            theme: localStorage.getItem('theme') || 'light',
            roles: '',
            avatar: '',
            userId: ''
        }
    },
    // 定义getters
    getters: {
    },
    // 定义action
    actions: {
        setTheme(the: string) {
            this.theme = the
            localStorage.setItem('theme', the)
        },
        setUserInfo(setInfo: any) {
            this.userName = setInfo.userName
            this.passWord = setInfo.passWord
            this.userToken = setInfo.token
            this.serverKey = setInfo.serverKey
            localStorage.setItem('userName', this.userName)
            localStorage.setItem('passWord', this.passWord)
            localStorage.setItem('userToken', this.userToken)
            localStorage.setItem('serverKey', this.serverKey)
            console.log('setUserInfo------', setInfo)
        },
        async SET_USER_INFO(data: any) {
            this.userName = data.username
            this.roles = data.roles
            this.avatar = data.avatar
            this.userId = data.userId
        },
        async GET_USER_INFO() {
            const userInfo = await getUserInfo({})
            console.log(userInfo, 'userInfo');
            this.SET_USER_INFO(userInfo.data)
        }
    },
})
