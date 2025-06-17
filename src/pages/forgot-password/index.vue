<template>
  <div class="changePassword-content flex flex-col gap-24 p-12">
    <loginTab :list="typeArr" @change="changeActive" class="mb-0"></loginTab>
    <inputCom :label="t('login.email')" v-model:value="form.username" :placeholder="t('input.PleaseEnter')"
      v-if="form.type == 'email'">
    </inputCom>

    <inputCom :label="t('input.Phone')" :placeholder="t('input.PleaseEnter')" v-model:value="form.username" :tips="''"
      v-if="form.type == 'phone'">
      <template #picker>
        <div class="picker-box pr-8 mr-6  h-full flex items-center gap-8" @click="hanleClickAreaPick">
          <!-- <img :src="icon1" alt="" class="w16 h16"> -->
          <div class="iti-flag mr-10" :class="areaInfo?.code" style="transform: scale(1.2)"></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
      </template>
    </inputCom>
    <inputCom :label="t('input.NewPassword')" v-model:value="form.password" :placeholder="t('input.PleaseEnter')">
    </inputCom>
    <inputCom :label="t('input.ConfirmPassword')" v-model:value="form.passwordConfirmation"
      :placeholder="t('input.PleaseEnter')"></inputCom>
    <inputCom :label="t('input.VerificationCode')" :placeholder="t('input.PleaseEnter')" v-model:value="form.code"
      :tips="''">
      <template #sendCode>
        <div class="absolute right-0 font-size-12 sendCode" :class="countdown > 0 ? 'text-gray-400' : 'text-blue-500'"
          @click="getCode">
          {{ countdown > 0 ? `${countdown}s` : t("input.SendCode") }}
        </div>
      </template>
    </inputCom>
    <van-button type="primary" block @click="onSubmit">{{ t('confirm') }}</van-button>
    <nationalityList ref="controlChildRef" :title="t('pick')" @getName="getName"></nationalityList>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from "@/components/inputCom.vue";
import nationalityList from '@/components/nationality-list/nationalityList.vue'

import { useUserStore } from '@/stores'
import { forgetPassword, sendCode } from "@/api/user"
import loginTab from "@/components/tab.vue";
const { t } = useI18n()
const form = reactive({
  passwordType: 3,
  password: '',
  passwordConfirmation: '',
  type: 'phone',
  username: "",
  code: "",

})
const forgotType = ref(0) // 1 忘记登录密码  2 忘记支付密码
const typeArr = [{
  label: `${t('input.Phone')}`,

  value: 'phone'
}, {
  label: `${t('login.email')}`,

  value: 'email'
}]
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: ""
})
const active = ref(0)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const countdown = ref(0)
const timer = ref()
const getCode = async () => {
  if (countdown.value > 0) return
  if (!form.username) {
    showToast(t('input.PleaseEnter'))
    return
  }
  try {
    let params = {
      type: form.type,
      phone: '',
      email: ''
    }
    if (params.type == 'phone') {
      params.phone = `${areaInfo.value.dialCode}${form.username}`
    } else if (params.type == 'email') {
      params.email = form.username
    }

    await sendCode(params)
    startCountdown()
  } catch (e) {
    // 处理错误
    console.log(e)
  }
}
const changeActive = (val: any) => {
  active.value = val
  form.type = val ? 'email' : 'phone'
}
const startCountdown = () => {
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = undefined
    }
  }, 1000)
}
const controlChildRef = ref()
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
}
const onSubmit = async () => {
  const { password, passwordConfirmation } = form
  if (password !== passwordConfirmation) {
    return
  }
  let params = {
    ...form,

  }
  params.code = params.code.trim()
  if (params.type == 'phone') {
    params.username = `${areaInfo.value.dialCode}${params.username}`
  }

  const res = await forgetPassword(params)
  if (res.code === 200) {
    showToast(t('Successfully modified'))
    router.push('/login')
  }
}

const getName = (val: any) => {
  areaInfo.value = val
}
onMounted(() => {
  if (route.query.forgotType) {
    form.passwordType = Number(route.query.forgotType)
  }
})
</script>
<route lang="json5">
{
  name: 'forgotPassword',
  meta: {
    i18n: 'menus.forgot-password',
  },
}
</route>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";
</style>
