<template>
    <div class="changePassword-content flex flex-col gap-24 p-12">
        <!-- <inputCom :label="'旧密码'" :placeholder="'请输入旧密码'"></inputCom> -->
        <inputCom :label="'新密码'" v-model:value="form.password" :placeholder="'请输入新密码'" :tips="'請輸入6-12個字符，包括數字或字母'">
        </inputCom>
        <inputCom :label="'确认新密码'" v-model:value="form.passwordConfirmation" :placeholder="'请确认新密码'"
            :tips="'請輸入6-12個字符，包括數字或字母'"></inputCom>
        <inputCom :label="'验证码'" :placeholder="'请输入验证码'" v-model:value="form.code" :tips="''">
            <template #sendCode>
                <div class="absolute right-0 font-size-12 sendCode"
                    :class="countdown > 0 ? 'text-gray-400' : 'text-blue-500'" @click="getCode">
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
import { updatePassword, sendCode } from "@/api/user"
const form = reactive({
    passwordType: 1,
    password: '',
    passwordConfirmation: '',

})
const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const countdown = ref(0)
const timer = ref()
const getCode = async () => {
    if (countdown.value > 0) return
    console.log(userInfo)
    try {
        let params = {
            phone: userInfo.value.phone,
            email: userInfo.value.email,
            type: userInfo.value.email ? 'email' : 'phone',
        }
        await sendCode(params)
        startCountdown()
    } catch (e) {
        // 处理错误
        console.log(e)
    }
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
        return showToast('两次密码不一致')
    }
    let params = {
        ...form,
        type: userInfo.value.email ? 'email' : 'phone',
        passwordType: passwordType.value
    }
    const res = await updatePassword(params)
    if (res.code === 200) {
        showToast('修改成功')
        router.push('/profile')
    }
}
const passwordType = ref(1) //  1:登录密码 2:支付密码 3:忘记密码
const route = useRoute()
onMounted(() => {
    if (route.query.type == '1') {
        passwordType.value = 1
    } else if (route.query.type == '2') {
        passwordType.value = 2
    }
})
</script>
<style lang="less" scoped></style>
