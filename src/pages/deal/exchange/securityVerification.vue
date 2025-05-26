<template>
    <div class="securityVerificationContent p-12">
        <!-- 安全认证 -->
        <div class="font-size-24 mb-24">安全认证</div>
        <inputCom :label="'资金密码'" :placeholder="'请输入资金密码'" v-model:value="form.password" class="mb-24">
        </inputCom>
        <van-button type="primary" block @click="handelClickBtn">提交</van-button>

    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { withdraw } from "@/api/recharge";
import { useStore } from '@/stores/modules/index';
import { useLoadingStore } from '@/stores/modules/loading'
const store = useStore()
const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()!
const params = computed(() => store.getWithdrawParams)
const router = useRouter()
const form = reactive({
    password: '',
})
const handleClickSubmitOriginal = async () => {
    let submitData = {
        ...params.value,
        password: form.password
    }
    const { data, code } = await withdraw(submitData)
    if (code === 200) {
        showToast('提交充值成功')
        store.setWithdrawParams({})
        router.push('/deal/exchange/withdraw-usdt')
    }
}
onUnmounted(() => {
    store.setWithdrawParams({})

})
const handelClickBtn = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
</script>
<style lang="less" scoped></style>
