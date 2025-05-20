<template>
  <div class="changePassword-content flex flex-col gap-24 p-12">
    <loginTab :list="typeArr" @change="changeActive" class="mb-0"></loginTab>
    <inputCom :label="'邮箱'" v-model:value="form.username" :placeholder="'请输入'" v-if="form.type == 'email'">
    </inputCom>

    <inputCom :label="'手机号'" :placeholder="'请输入'" v-model:value="form.username" :tips="''" v-if="form.type == 'phone'">
      <template #picker>
        <div class="picker-box pr-8 mr-6  h-full flex items-center gap-8" @click="hanleClickAreaPick">
          <!-- <img :src="icon1" alt="" class="w16 h16"> -->
          <div class="iti-flag mr-10" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
      </template>
    </inputCom>
    <inputCom :label="'新密码'" v-model:value="form.password" :placeholder="'请输入新密码'" :tips="'請輸入6-12個字符，包括數字或字母'">
    </inputCom>
    <inputCom :label="'确认新密码'" v-model:value="form.passwordConfirmation" :placeholder="'请确认新密码'"
      :tips="'請輸入6-12個字符，包括數字或字母'"></inputCom>
    <inputCom :label="'验证码'" :placeholder="'请输入验证码'" v-model:value="form.code" :tips="''">
      <template #sendCode>
        <div class="absolute right-0 font-size-12 sendCode" :class="countdown > 0 ? 'text-gray-400' : 'text-blue-500'"
          @click="getCode">
          {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
        </div>
      </template>
    </inputCom>
    <van-button type="primary" block @click="onSubmit">确定</van-button>
    <nationalityList ref="controlChildRef" :title="'选择'" @getName="getName"></nationalityList>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from "@/components/inputCom.vue";
import nationalityList from '@/components/nationality-list/nationalityList.vue'

import { useUserStore } from '@/stores'
import { forgetPassword, sendCode } from "@/api/user"
import loginTab from "@/components/tab.vue";
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
  label: '手机号',
  value: 'phone'
}, {
  label: '邮箱',
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
const getCode = async () => {
  if (countdown.value > 0) return
  console.log(userInfo)
  try {

    await sendCode(form)
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
    return showToast.error('两次密码不一致')
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
    showToast('修改成功')
    router.push('/login')
  }
}

const getName = (val: any) => {
  console.log(val, 'vvvv')
  areaInfo.value = val
}
onMounted(() => {
  if (route.query.forgotType) {

  }
})
</script>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";
</style>
