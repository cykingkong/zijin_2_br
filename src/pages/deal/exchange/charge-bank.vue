<template>
    <div class="color-blueGray-400 charge-bank-page p-12">
        <div class="color-blueGray-400 t font-size-18">银行卡入款</div>
        <div class="color-blueGray-400 t font-size-14 mt-4">请选择入金金额</div>
        <div class="color-blueGray-400 price-tab flex my-12 gap-12px flex-wrap">
            <div class="color-blueGray-400 price-item p-12 flex-1 text-align-center rounded-10"
                v-for="item in priceTabArr" :key="item" @click="form.amount = item">
                <div class="color-blueGray-400 t font-size-14">{{ item }}</div>
            </div>
        </div>
        <inputCom :label="'充值数量'" :placeholder="'请输入充值数量'" v-model:value="form.amount" :tips="tips">
        </inputCom>
        <inputCom class="mt-12" :label="'充值方式'" :placeholder="''" v-model:value="form.methodId" :type="'picker'">
            <div class="w-full flex justify-between">
                <div class="l flex-1 font-size-14" @click="showPicker = true">{{ form.methodId ? form.methodIdText :
                    '请选择充值方式'
                    }}</div>
                <div class="r flex-shrink-0">
                    <van-icon name="arrow" class="rotate-90" />
                </div>
            </div>
        </inputCom>

        <div class=" t" v-html="html"></div>
        <van-button type="primary" block @click="handleClickSubmit">提交</van-button>
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
            <van-picker :columns="columns" :model-value="[form.methodId]" @confirm="onConfirm"
                @cancel="showPicker = false" />
        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { rechargeConfig, coinRechargeConfig, recharge } from '@/api/recharge'
import { useLoadingStore } from '@/stores/modules/loading'
const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()!
const priceTabArr = ref([])
const tips = ref('')
const columns = ref([])
const showPicker = ref(false)

const html = `<div class=" px-4 mt-4 centent" ><div class="font-size-15 ">充值说明</div><p class="color-blueGray-400 mt-2 text-12px" >入金前请向在线客服询问本平台官方收款银行账户。</p><p class="color-blueGray-400 mt-2 text-12px" >您通过银行账户汇款后，请尽快将付款成功凭证截图并提交，以完成入金。</p><p class="color-blueGray-400 mt-2 text-12px" >如果您已经存款，请点击页面上的“提交”按钮。 提交收据，否则押金将不予记入。</p><p class="color-blueGray-400 mt-2 text-12px" >请务必确认您的操作设备和浏览器的安全性，以防止信息被篡改或泄露。</p><p class="color-blueGray-400 mt-2 text-12px" >请寻找平台官方客服人员提供的银行收款账户进行入金。 因入金错误造成的资金损失由您自行承担。</p></div>`
const form = reactive({
    amount: '',
    methodId: ''
})
const getRechargeConfig = async () => {
    rechargeConfig({ mode: 'gp' }).then(res => {
        priceTabArr.value = res.data.settings.find(item => item.key === 'recharge_number').value.split(',')
        tips.value = `充值范围${res.data.settings.find(item => item.key === 'recharge_min_amount').value}-10000000000`
        columns.value = res.data.methods.map((e) => {
            return {
                text: e.method,
                value: e.id
            }
        })
    })
}
const onConfirm = ({ selectedValues, selectedOptions }) => {
    form.methodId = selectedValues[0];
    form.methodIdText = selectedOptions[0].text
    console.log(form, selectedValues)
    showPicker.value = false
}
const handleClickSubmitOriginal = async () => {
    const { data, code } = await recharge(form)
    if (code === 200) {
        showToast('提交充值成功')

    }
}
const handleClickSubmit = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
onMounted(() => {
    getRechargeConfig()
})
</script>
<style lang="less" scoped>
.price-item {
    width: 33%;
    border: 1px solid #1678FF;

}
</style>
<route lang="json5">
    {
      name: 'add',
      meta: {
        title: '充值',
      },
    }
</route>