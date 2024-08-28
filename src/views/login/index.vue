<template>
  <div class="login-container">
    <div class="f-header">
      <div class="titlebar">
        <div class="titlebar-button">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="iconfont theme-i">&#xe645;</i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="useTheme('dark')">暗黑主题</el-dropdown-item>
                <el-dropdown-item @click="useTheme('light')">亮白主题</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="titlebar-button">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="iconfont lang">&#xe616;</i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="changeLang('en')">English</el-dropdown-item>
                <el-dropdown-item @click="changeLang('zh')">简体中文</el-dropdown-item>
                <el-dropdown-item>繁体中文</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <TitleBar></TitleBar>
      </div>
    </div>
    <div v-if="loginModel === 'Register'" class="container a-container" id="a-container" data-tauri-drag-region>
      <form class="login-form" id="a-form" method="" action="" data-tauri-drag-region>
        <img class="login-logo" src="@/assets/image/logo.png" alt="" srcset="" />
        <h2 class="form_title login-title">{{ $t('welcomeToHongHu') }}</h2>
        <input class="form__input" type="text" @keydown.enter="registUser" v-model="loginForm.userName" @input="cantSpace"
          :placeholder="$t('login.userName')" />
        <input class="form__input" type="passWord" @keydown.enter="registUser" v-model="loginForm.passWord"
          @input="cantSpace" :placeholder="$t('login.passWord')" />
        <div class="login-info">
          <a href="javascript:void(0);" @click="forgetPassword">{{ $t('forgetPassword') }}</a>
          <a href="javascript:void(0);" @click="switchModel('Login')">{{ $t('loginwithanaccount') }}</a>
        </div>
        <el-button :loading="loadingBtn" type="primary" round size="large" @click.prevent="registUser" class="login-btn">
          <span v-if="locale === 'zh'">注&nbsp;&nbsp;&nbsp;&nbsp;册</span>
          <span v-else>Register</span>
        </el-button>
      </form>
    </div>
    <div v-else-if="loginModel === 'Login'" class="container b-container" id="b-container" data-tauri-drag-region>
      <form class="login-form" id="b-form" method="" action="" data-tauri-drag-region>
        <img class="login-logo" src="@/assets/image/logo.png" alt="" srcset="" />
        <h2 class="form_title login-title">
          {{ $t('loginTitle') }}
        </h2>
        <input class="form__input" @input="cantSpace" type="text" @keydown.enter="handleLogin"
          v-model="loginForm.userName" :placeholder="$t('login.userName')" />
        <input class="form__input" type="passWord" v-model="loginForm.passWord" :placeholder="$t('login.passWord')"
          @keydown.enter="handleLogin" @input="cantSpace" />
        <div class="login-info">
          <a href="javascript:void(0);" @click.prevent="forgetPassword">{{ $t('forgetPassword') }}</a>
          <a href="javascript:void(0);" @click="switchModel('Register')">{{ $t('Registeranewaccount') }}</a>
        </div>
        <el-button :loading="loadingBtn" type="primary" round size="large" @click.prevent="handleLogin" class="login-btn">
          <span v-if="locale === 'zh'">登&nbsp;&nbsp;&nbsp;&nbsp;录</span>
          <span v-else>Login</span>
        </el-button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import useTheme from '@/hooks/theme'
import { useUserStore } from '@/stores/user'
import { getLogin, registerUser } from '@/apis/user'
import commonApi from '@/apis/common'
import { rsaDecode, rsaEncode } from "@/utils/encode"
import TitleBar from '@/components/titleBar.vue'
import { setToken } from '@/utils/auth'


const userStore = useUserStore()

// 登录loading状态
const loadingBtn = ref(false)

const { locale, t } = useI18n()
// 语言切换
const changeLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}


const router = useRouter()
// 忘记密码提示
const forgetPassword = () => {
  ElMessage({
    message: '请联系微信或者QQ：648133599',
    type: 'success',
  })
}

// 密码输入框不能输入空格
const cantSpace = () => {
  const { userName = '', passWord = '' } = loginForm
  loginForm.userName = userName.replace(/\s/g, "")
  loginForm.passWord = passWord.replace(/\s/g, "")
  // console.log("输入的值发生了变化--", loginForm);
  userStore.userName = loginForm.userName
  userStore.passWord = loginForm.passWord
  localStorage.setItem("userName", loginForm.userName)
  localStorage.setItem("passWord", loginForm.passWord)
}

// 模式：登录，token，注册
let loginModel = ref('Login')
const switchModel = (model: string) => {
  loginModel.value = model
}

// 点击登录后校验登录逻辑，然后登录
interface loginType {
  userName: string
  passWord: string
}
const loginForm: loginType = reactive({
  userName: userStore.userName || '',
  passWord: userStore.passWord || '',
  serverKey: ""
})

// 登录行为
const handleLogin = async () => {
  loadingBtn.value = true
  if (loginForm.userName && loginForm.passWord && loginModel.value === "Login") {
    await getLogin({ username: loginForm.userName, password: loginForm.passWord }).then(async res => {
      if (res.code == 200) {
        setToken(res.data)
        await userStore.GET_USER_INFO()
        ElMessage.success(t('loginSuccess'))
        router.push('/home/index')
      } else {
        ElMessage.error('登录失败，此用户不存在！')
      }
      loadingBtn.value = false
    }).catch((err: any) => {
      console.log(err, 'err')
      loadingBtn.value = false
    })


  } else {
    ElMessage.error('登录失败，账号/密码不对')
    loadingBtn.value = false
  }
}

// 注册行为
const registUser = async () => {
  loadingBtn.value = true
  if (loginForm.userName && loginForm.passWord && loginModel.value === "Register") {
    await registerUser({ username: loginForm.userName, password: loginForm.passWord }).then(async res => {
      if (res.code === 200) {
        ElMessage.success(t('registerSuccess'))
        loginModel.value = 'Login'
      } else {
        ElMessage.error(res.msg || '注册失败！')
      }
      loadingBtn.value = false
    }).catch((err: any) => {
      console.log(err, 'err')
      loadingBtn.value = false
    })
  } else {
    ElMessage.error('注册失败！')
    loadingBtn.value = false
  }
  // 先验证用户名是否重复
  // const loginRes = await loginApi.loginUserName(loginForm.userName)
  // // console.log('UserNameExistRes------', loginRes)
  // if (loginRes.status === 200) {
  //   ElMessage.error("用户名已存在，请更换用户名")
  //   loadingBtn.value = false
  //   return
  // }
  // 先验证token是否有效，然后注册：pr到数据资产库
  // if (loginForm.userName && loginForm.passWord) {
  //   const res = await loginApi.getUserInfo()
  //   if (res.status === 200) {
  //     // 文件名直接使用用户名，文件内容：用户名+密码+token加密
  //     const encodeUser = rsaEncode(JSON.stringify(loginForm))
  //     const userInfo = {
  //       "body": encodeUser,
  //       "title": `[regist]userName:${loginForm.userName}`
  //     }
  //     const registRes = await loginApi.registUser(userInfo)
  //     // console.log("userContent----", userInfo, registRes);
  //     if (registRes.status === 201) {
  //     } else {
  //       ElMessage.error("注册出错:" + (registRes.data as any).message)
  //       loadingBtn.value = false
  //     }
  //   } else {
  //     // console.log("Token无效,请填写正确Token");
  //     ElMessage.error("Token无效,请填写正确Token")
  //     loadingBtn.value = false
  //   }
  // } else {
  //   ElMessage.error("请填写用户名/密码/Token")
  //   loadingBtn.value = false
  // }
}
</script>

<style scoped lang="scss">
@import '@/style/login.css';

:focus-visible {
  outline: none;
}

.login-container {
  width: 100%;
  height: 100%;

  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    height: 100%;
    padding: 25px;
    transition: 1.25s;
    width: 100%;
    right: 0;
    z-index: 1;

    .login-form {
      position: absolute;
      width: 30%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 1;
      right: 0;
      padding-top: 96px;

      .login-logo {
        width: 52px;
        height: 52px;
      }

      .login-title {
        font-size: 26px;
        font-weight: 700;
        margin-bottom: 24px;
        margin-top: 8px;
        color: var(--el-color-primary);
      }
    }
  }
}

html.light .login-container {
  background-image: url('@/assets/image/light_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

html.dark .login-container {
  background-image: url('@/assets/image/dark_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.login-info {
  margin-top: 10px;
  width: 250px;
  margin: auto;
  display: flex;
  justify-content: space-between;
  padding: 0 4px;

  a {
    font-size: 12px;
    color: #b0b0b0;
  }
}

.login-btn {
  width: 250px;
  height: 28px;
  margin-top: 10px;
  font-weight: 700;
  font-size: 12px;
  border: none;
  outline: none;
}

.f-header {
  display: flex;
  position: fixed;
  justify-content: center;
  align-items: center;
  padding: 13px 15px 0 0;
  right: 0px;
  z-index: 2;

  .titlebar {
    display: flex;
    margin-right: 5px;
    user-select: none;

    .titlebar-button {

      .theme-i,
      .lang {
        color: var(--header-icon-color);
      }
    }
  }
}
/* 当屏幕宽度小于或等于 600px 时应用的样式 */
@media screen and (max-width: 600px) {
  .login-container .container .login-form {
    width: 100%;
  }
}
</style>