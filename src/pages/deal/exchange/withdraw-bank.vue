<template>
    <div class="color-blueGray-400 charge-bank-page p-12">
        <div class="color-blueGray-400 t font-size-18">银行卡入款</div>
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
        <inputCom :label="'提现数量'" :placeholder="'请输入提现数量'" v-model:value="form.num" :tips="''">
        </inputCom>
        <div class="font-size-12">{{ tips }}</div>
        <div class="font-size-12">{{ tips2 }}</div>

        <van-button type="primary" block @click="handleClickSubmit">提交</van-button>
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
            <van-picker :columns="columns" :model-value="[form.methodId]" @confirm="onConfirm"
                @cancel="showPicker = false" />
        </van-popup>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { withdrawConfig, withdraw } from '@/api/withdraw'
import { userCardGrid } from '@/api/payment'
const priceTabArr = ref(['1999', '4999', '9999', '19999', '49999', '99999'])
const tips = ref('')
const tips2 = ref('')
const columns = ref([])
const showPicker = ref(false)

const page = reactive({
    page: 1,
    pageSize: 10
})
const form = reactive({
    num: '',
    methodId: ''
})
const getRechargeConfig = async () => {
    withdrawConfig({ mode: 'gp' }).then(res => {

        tips.value = `手续费${res.data.withdrawFee} 最小提现金额${res.data.minWithdraw} `
        tips2.value = `余额${res.data.minWithdraw} `

    })
}
const getList = async () => {
    const { data } = await userCardGrid({
        ...page
    })
    columns.value = data.rows ? data.rows.map((e) => {
        return {
            text: e.address.bankType,
            value: e.id
        }
    }) : []
    store.setUserCardList(data.rows)

}
const onConfirm = ({ selectedValues, selectedOptions }) => {
    form.methodId = selectedValues[0];
    form.methodIdText = selectedOptions[0].text
    console.log(form, selectedValues)
    showPicker.value = false
}
const handleClickSubmit = async () => {

}
onMounted(() => {
    getRechargeConfig();
    getList()
})
</script>
<style lang="less" scoped>
.price-item {
    width: 33%;
    border: 1px solid #1678FF;

}
</style>
