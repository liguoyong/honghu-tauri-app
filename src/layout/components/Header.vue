<template>
  <div class="header" data-tauri-drag-region>
    <div class="logo" data-tauri-drag-region>
      <el-popover placement="right" trigger="hover" :content="appVersion">
        <template #reference>
          <div class="logo-container">
            <img v-if="userStore.theme === 'light'" :src="logoLight" class="logo-img" data-tauri-drag-region />
            <img v-else :src="logoDark" class="logo-img" data-tauri-drag-region />
            <span data-tauri-drag-region>{{ $t('logoTitle') }}</span>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="header-tool">
      <div class="theme">
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
      <div class="language">
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
      <div class="user-info">
        <el-dropdown trigger="click">
          <img :src="userStore.avatar" alt="" class="user-img" />
          <template #dropdown>
            <el-dropdown-menu>
              <div class="user-item">
                {{ userStore.userName }}
              </div>
              <el-dropdown-item>
                <a href="javascript:void(0);" @click="$router.push({ name: 'userInformation' })"
                  class="my-info">编辑资料</a>
              </el-dropdown-item>
              <el-dropdown-item @click="loginOut">切换账号</el-dropdown-item>
              <el-dropdown-item @click="loginOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="titlebar">
        <TitleBar></TitleBar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoLight from '@/assets/image/logo.png'
import logoDark from '@/assets/image/logo.png'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import useTheme from '@/hooks/theme'
import { useI18n } from 'vue-i18n'
import { timestampToTime } from "@/utils/index"
import { removeToken } from '@/utils/auth'
import TitleBar from '@/components/titleBar.vue'
import { getVersion } from '@tauri-apps/api/app';
import { onMounted, ref } from 'vue'

let appVersion = ref("版本:")
onMounted(async () => {
  const version = await getVersion()
  console.log("appVersion", version);
  appVersion.value = "当前版本: V" + version
})

const { locale } = useI18n()
const userStore = useUserStore()

// 进度条颜色
const colors = [
  { color: '#f53434', percentage: 20 },
  { color: '#f56c6c', percentage: 40 },
  { color: '#6f7ad3', percentage: 60 },
  { color: '#1fb929', percentage: 80 },
  { color: '#1989fa', percentage: 100 },
]

const router = useRouter()
// 退出登录
const loginOut = () => {
  removeToken()
  // localStorage.removeItem("gitToken")
  router.push('/')
}
// 语言切换
const changeLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('lang', lang)
}
</script>

<style scoped lang="scss">
.api-color {
  color: #f53434;
  color: #f56c6c;
  color: #6f7ad3;
  color: #1fb929;
  color: #1989fa;
}

.user-item {
  text-align: center;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  cursor: pointer;
  color: var(--el-text-color-regular);
}

:deep(.el-progress-bar__outer) {
  background-color: var(--api-process) !important;
}

.header {
  height: 56px;
  border-bottom: solid 1px var(--el-menu-border-color);
  display: flex;
  justify-content: space-between;

  .logo {
    display: flex;
    align-items: center;

    .logo-container {
      display: flex;
      align-items: center;

      span {
        margin-left: 8px;
        font-size: 14px;
        color: var(--el-color-primary);
      }
    }

    .logo-img {
      width: 36px;
      height: 36px;
    }

    .api-pro {
      width: 150px;
      margin-left: 20px;
      cursor: pointer;
    }
  }

  .header-tool {
    display: flex;
    align-items: center;

    .theme,
    .language {
      margin-right: 30px;
      margin-top: 4px;
      cursor: pointer;
    }

    .user-info {
      margin-right: 5px;

      .user-img {
        width: 30px;
        height: 30px;
        border: unset;
        border-radius: 18px;
        cursor: pointer;
      }
    }

    .my-info {
      color: var(--el-text-color-regular);
      text-decoration: none;
    }

    .titlebar {
      display: flex;
      margin-right: 20px;
      user-select: none;

      .titlebar-button {
        margin-left: 15px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 30px;
        height: 30px;

        &:hover {
          // background-color: rgb(242, 242, 242);
        }
      }

      #titlebar-close {
        &:hover {
          color: white;
          background-color: rgb(235, 32, 19);
        }
      }
    }
  }
}
</style>
