<script setup lang="ts">
import type { PickerColumn } from 'vant'
import router from '@/router'
import { languageColumns, locale } from '@/utils/i18n'
import { useUserStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import { clearToken, isLogin } from '@/utils/auth'

import UserInfo from '../../components/user-info.vue'
import grid1 from '@/assets/grid/grid1.png';
import grid2 from '@/assets/grid/grid2.png';
import grid3 from '@/assets/grid/grid3.png';
import grid4 from '@/assets/grid/grid4.png';
import grid5 from '@/assets/grid/grid5.png';
import icon1 from '@/assets/image/icon/icon1.png';
import icon2 from '@/assets/image/icon/icon2.png';
import icon3 from '@/assets/image/icon/icon3.png';
import icon4 from '@/assets/image/icon/icon4.png';
import icon5 from '@/assets/image/icon/icon5.png';
import icon6 from '@/assets/image/icon/icon6.png';
import icon7 from '@/assets/image/icon/icon7.png';

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
watch(() => isLogin(), (val) => {
  if (!val) {
    router.push('/login')
  }
}, {
  immediate: true
})
const { t } = useI18n()
const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)
const gridList = [
  {
    icon: grid1,
    text: '安全',
    url: '/profile/safetyPage/safety'
  },
  {
    icon: grid2,
    text: '修改密码',
    url: '/profile/changePassword/changePassword'

  },
  {
    icon: grid3,
    text: '账变记录',
    url: '/quotes/accountChange?type=1'
  },
  // {
  //   icon: grid4,
  //   text: '邀请推广'
  // },
  {
    icon: grid5,
    text: '身份验证',
    url: '/certificationCenter'
  },
]
const cellList = [
  {
    icon: icon1,
    text: '语言'
  },
  {
    icon: icon2,
    text: '身份认证'
  },

  {
    icon: icon4,
    text: '划转'
  },
  {
    icon: icon5,
    text: '添加收款方式'
  },
  {
    icon: icon6,
    text: '关于我们'
  },
  {
    icon: icon7,
    text: '帮助中心'
  }
]
const handleClickCell = (index: any) => {
  console.log(index, 'kajsldkja')
  switch (index) {
    case 0:
      showLanguagePicker.value = true
      break
    case 1:
      router.push('/certificationCenter')
      break
    case 2:
      router.push('/conversion')  // 划转
      break
    case 3:
      router.push('/profile/payMentMethod/list')

      break
    case 4:
      router.push('/aboutUs')

      break
    case 5:
      router.push('/helpCenter')


      break
  }
}
const handleClickGrid = (index: any) => {
  router.push(gridList[index].url)
}
function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}
const handleLogout = () => {
  // clearToken()
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="myself-index">
    <VanNavBar title="" :fixed="true" clickable placeholder :left-arrow="false">
      <template #right>
        <van-icon name="service-o" class="icon" />
      </template>
    </VanNavBar>

    <section class="myself flex flex-col">
      <UserInfo :userInfo="userInfo" />
      <van-cell-group title="快捷入口" />
      <van-grid :border="false">
        <van-grid-item v-for="(i, k) in gridList" :key="k" @click="handleClickGrid(k)">
          <div class="flex flex-col items-center flex-1">
            <img :src="i.icon" class="w-48 h-48" />
            <span class="text-12 mt-8">{{ i.text }}</span>
          </div>
        </van-grid-item>
      </van-grid>

      <van-cell-group title="通用">
        <van-cell is-link :title="item.text" @click="handleClickCell(k)" v-for="(item, k) in cellList" :key="k">
          <template #icon>
            <img :src="item.icon" class="w20 h20 mr-8 mt-2" />
          </template>
        </van-cell>

      </van-cell-group>

      <div class="btn-box mt-24 w-full">
        <van-button square type="primary" class="mt-12 w-full" @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </section>
    <!-- <section class="unLogin px-12" >
      <div class="flex flex-col items-center">
        <span class="text-12 mt-8">您还未登录</span>
      </div>
      <div class="btn-box mt-24 w-full">
        <van-button square type="primary" class="mt-12 w-full" @click="router.push('/login')">
          去登录
        </van-button>
      </div>
    </section> -->
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker v-model="languageValues" :columns="languageColumns" @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false" />
    </van-popup>
  </div>
</template>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: '个人中心',
    i18n: 'menus.profile'
  },
}
</route>

<style lang="less" scoped>
.icon {
  color: var(--van-text);
}

.myself-index {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.content {
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--van-gary-1);
  }
}
</style>
