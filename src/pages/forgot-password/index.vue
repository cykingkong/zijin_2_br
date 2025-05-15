<template>
  <div class="changePassword-content flex flex-col gap-24 p-12">
    <loginTab :list="typeArr" @change="changeActive" class="mb-0"></loginTab>
    <inputCom :label="form.type == 'phone' ? '手机号' : '邮箱'" v-model:value="form.username" :placeholder="'请输入手机号'">
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

  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from "@/components/inputCom.vue";
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

const onSubmit = async () => {
  const { password, passwordConfirmation } = form
  if (password !== passwordConfirmation) {
    return showToast.error('两次密码不一致')
  }
  let params = {
    ...form,

  }
  params.code = params.code.trim()
  const res = await forgetPassword(params)
  if (res.code === 200) {
    showToast('修改成功')
    router.push('/login')
  }
}
onMounted(() => {
  if (route.query.forgotType) {

  }
})
</script>
<style lang="less" scoped></style>
