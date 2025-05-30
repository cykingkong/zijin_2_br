<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { RouteMap } from 'vue-router'
import { useUserStore } from '@/stores'
import inputCom from '@/components/inputCom.vue'
import nationalityList from '@/components/nationality-list/nationalityList.vue'

import loginTab from '@/components/tab.vue'
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
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: ""
})
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

const controlChildRef = ref()
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
}
const toRegister = () => {
  try {

    router.push({ path: '/register' })
  } catch (e) {
    console.log(e)
  }

}
const toForget = () => {
  try {
    router.push('/forgot-password?forgotType=1')
  } catch (e) {
    console.log(e)
  }
}
const getName = (val: any) => {
  console.log(val, 'vvvv')
  areaInfo.value = val
}
async function login(values: any) {
  if (!postData.password) {
    showToast('请输入密码')
    return
  }

  try {
    loading.value = true
    let area = areaInfo.value?.dialCode

    let params = {
      ...postData,
    }
    if (postData.type == 'phone') {
      params.account = `${area}${params.account}`

    }
    await userStore.login({ ...params, ...values })
    await userStore.info()
    const { redirect, ...othersQuery } = router.currentRoute.value.query
    router.push({
      name: 'profile',
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
    <nationalityList ref="controlChildRef" :title="'选择'" @getName="getName"></nationalityList>
    <!-- <div class="title font-size-14 font-bold mt-24 mb-12 flex gap-12 items-center">
      <div class="flex justify-center tab-item rounded-10px p-12" :class="{ 'active': postData.type == item.value }"
        v-for="(item, index) in typeArr" :key="index" @click="postData.type = item.value">
        {{ item.label }} </div>
    </div> -->
    <loginTab :list="typeArr" @change="changeIndex"></loginTab>

    <inputCom :label="'手机号'" :placeholder="'请输入'" v-model:value="postData.account" :tips="''"
      v-show="postData.type == 'phone'">
      <template #picker>
        <div class="picker-box pr-8 mr-6  h-full flex items-center gap-8" @click="hanleClickAreaPick">
          <div class="iti-flag mr-10" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
      </template>
    </inputCom>
    <inputCom :label="'邮箱'" :placeholder="'请输入邮箱'" v-model:value="postData.account" :tips="''"
      v-show="postData.type == 'email'">
    </inputCom>
    <inputCom :label="'密码'" :placeholder="'请输入密码'" v-model:value="postData.password" :tips="''" :inputType="'password'">
    </inputCom>
    <van-button type="primary" class="login-btn" block @click="login({})">登陆</van-button>


    <GhostButton block class="mt-18" @click="toRegister">
      {{ $t('login.sign-up') }}
    </GhostButton>

    <GhostButton block @click="toForget">
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
<style scoped>
@import "@/components/nationality-list/intl.css";
</style>