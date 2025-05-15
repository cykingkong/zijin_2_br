<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RouteMap } from 'vue-router'
import { useUserStore } from '@/stores'
import inputCom from '@/components/inputCom.vue'
import loginTab from '@/components/tab.vue'
import logoDark from '~/images/logo-dark.svg'
import vw from '@/utils/inline-px-to-vw'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const typeArr = [{
  label: '手机号登录',
  value: 'phone'
}, {
  label: '邮箱登录',
  value: 'email'
}]
const dark = ref<boolean>(isDark.value)

watch(
  () => isDark.value,
  (newMode) => {
    dark.value = newMode
  },
)

const postData = reactive({
  account: '',
  password: '',
  type: 'phone',
  code: ''
})
const changeIndex = (val: any) => {
  postData.type = typeArr[val].value
}
const rules = reactive({
  email: [
    { required: true, message: t('login.pleaseEnterEmail') },
  ],
  password: [
    { required: true, message: t('login.pleaseEnterPassword') },
  ],
})

async function login(values: any) {
  try {
    loading.value = true
    await userStore.login({ ...postData, ...values })
    await userStore.info()
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      name: (redirect as keyof RouteMap) || 'profile',
      query: {
        ...othersQuery,
      },
    })
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="m-x-a w-7xl ">
    <loginTab :list="typeArr" @change="changeIndex"></loginTab>
    <!-- <div class="title font-size-14 font-bold mt-24 mb-12 flex gap-12 items-center">
      <div class="flex justify-center tab-item rounded-10px p-12" :class="{ 'active': postData.type == item.value }"
        v-for="(item, index) in typeArr" :key="index" @click="postData.type = item.value">
        {{ item.label }} </div>
    </div> -->
    <inputCom :label="postData.type == 'phone' ? '手机号' : '邮箱'"
      :placeholder="postData.type == 'phone' ? '请输入手机号' : '请输入邮箱'" v-model:value="postData.account" :tips="''">
    </inputCom>
    <inputCom :label="'密码'" :placeholder="'请输入密码'" v-model:value="postData.password" :tips="''" :inputType="'password'">
    </inputCom>
    <van-button type="primary" class="login-btn" block @click="login({})">登陆</van-button>


    <GhostButton block to="register" :style="{ 'margin-top': vw(18) }">
      {{ $t('login.sign-up') }}
    </GhostButton>

    <GhostButton block to="forgot-password?forgotType=1">
      {{ $t('login.forgot-password') }}
    </GhostButton>
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'menus.login'
  },
}
</route>
<style lang="less" scoped>
.login-btn {
  margin-top: 24px;
}
</style>