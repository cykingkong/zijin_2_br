<template>
  <div class="changePassword-content flex flex-col gap-24 p-12">
    <!-- <loginTab :list="typeArr" @change="changeActive" class="mb-0"></loginTab> -->
    <inputCom :label="t('login.email')" v-model:value="form.account" :placeholder="t('input.PleaseEnter')"
      v-if="form.type == 'email'">
    </inputCom>


    <div class="phone-input flex items-center gap-12px" v-if="form.type == 'phone'">

      <inputCom :label="t('input.Phone')" :placeholder="t('input.PleaseEnter')" v-model:value="form.account" :tips="''"
        class="flex-1 w-full">
      </inputCom>
    </div>


    <inputCom :label="t('input.NewPassword')" v-model:value="form.password" :placeholder="t('input.PleaseEnter')">
    </inputCom>
    <!-- <inputCom :label="t('input.ConfirmPassword')" v-model:value="form.passwordConfirmation"
      :placeholder="t('input.PleaseEnter')"></inputCom> -->
    <inputCom :label="t('input.VerificationCode')" :placeholder="t('input.PleaseEnter')" v-model:value="form.captcha"
      :tips="''">
      <template #sendCode>
        <div class="absolute right-0 font-size-12 sendCode text-#000 " @click="getCode">
          {{ countdown > 0 ? `${countdown}s` : t("input.SendCode") }}
        </div>
      </template>
    </inputCom>
    <van-button type="primary" class="h-56px" color="#6b39f4" block @click="onSubmit">{{ t('confirm') }}</van-button>
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

  password: '',
  passwordConfirmation: '',
  type: 'phone',
  username: "",
  captcha: "",

})
const forgotType = ref(0) // 1 忘记登录密码  2 忘记支付密码
const typeArr = [{
  label: `${t('input.Phone')}`,

  value: 'phone'
}, {
  label: `${t('login.email')}`,

  value: 'email'
}]

const active = ref(0)
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
watch(() => userInfo.value, () => {
  if (userInfo.value?.phone) {
    form.type = 'phone'
    form.account = userInfo.value?.phone

  }
  if (userInfo.value?.email) {
    form.type = 'email';
    form.account = userInfo.value?.email
  }
}, {
  immediate: true
})
const countdown = ref(0)
const timer = ref()
const getCode = async () => {
  if (countdown.value > 0) return
  if (!form.account) {
    showToast(t('input.PleaseEnter'))
    return
  }
  try {
    let params = {
      type: form.type,
      account: form.account,

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


  let params = {
    ...form,
  }
  params.captcha = params.captcha.trim()


  const res = await forgetPassword(params)
  if (res.code === 200) {
    showToast(t('Successfully modified'))
    router.push('/login')
  }
}


onMounted(async () => {
  if (route.query.type) {
    form.type = route.query.type as string
    await userStore.info()
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

.sendCode {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #868c9a;
}

.link {
  color: #1678ff;
}

.steps-item,
.line {
  background: #868c9a;
}

.picker-box {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 16px;
    background: #868c9a;
  }
}

.green {
  background: #06cda5;
}
</style>
