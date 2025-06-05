<template>
    <div class="color-blueGray-400 charge-bank-page p-12">
        <div class="color-blueGray-400 t font-size-18">银行卡提现</div>
        <inputCom class="mt-12" :label="'银行卡'" :placeholder="''" v-model:value="form.methodId" :type="'picker'">
            <div class="w-full flex justify-between">
                <div class="l flex-1 font-size-14" @click="showPicker = true">{{ form.methodId ? form.methodIdText :
                    '请选择银行卡'
                    }}</div>
                <div class="r flex-shrink-0">
                    <van-icon name="arrow" class="rotate-90" />
                </div>
            </div>
        </inputCom>
        <inputCom :label="'提现金额'" :placeholder="'请输入'" v-model:value="form.num" :tips="''">
        </inputCom>
        <div class="font-size-12">{{ tips }}</div>
        <div class="font-size-12 mb-12 mt-4">{{ tips2 }}</div>

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
import { useStore } from '@/stores/modules/index';
import { addCommasToNumber } from '@/utils/tool'
import { userCardGrid } from '@/api/payment'
import { useLoadingStore } from '@/stores/modules/loading'
import { method } from "lodash-es";
const router = useRouter()
const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()
const priceTabArr = ref(['1999', '4999', '9999', '19999', '49999', '99999'])
const tips = ref('')
const tips2 = ref('')
const columns = ref([])
const showPicker = ref(false)
const store = useStore()
const page = reactive({
    pageIndex: 1,
    pageSize: 200
})
const form = reactive({
    num: '',
    methodId: '',
    assetId: '',
})
const getRechargeConfig = async () => {
    withdrawConfig({ mode: 'gp' }).then(res => {
        console.log(res.data)
        form.assetId = res.data.assetId
        tips.value = `手续费${res.data.withdrawFee} 最小提现金额${res.data.minWithdraw} `
        tips2.value = `余额${addCommasToNumber(res.data.balance)} `

    })
}
const getList = async () => {
    const { data } = await userCardGrid({
        ...page
    })
    columns.value = data.rows ? data.rows.map((e) => {
        return {
            text: `${e.address.bankName}(${e.address.bankType})`,
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
const handleClickSubmitOriginal = async () => {
    //     console.log(store, 'params')
    store.setWithdrawParams({
        cardId: form.methodId,
        amount: form.num,
        networkId: 0,
        type: 1,
        assetId: form.assetId
    })
    router.push('/deal/exchange/securityVerification?type=1')
    // const { data, code } = await withdraw({
    //     cardId: form.methodId,
    //     amount: form.num,
    //     networkId: 0,
    //     type: 1,
    //     assetId: 0,

    // })
    // if (code == 200) {
    //     showToast('提交成功')
    //     getRechargeConfig();

    // }
}
const handleClickSubmit = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
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
