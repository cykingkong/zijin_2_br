<template>
    <div class="conversion-page p-12">
        <div class="title font-size-20 mb-12" @click="showPicker = true">划转</div>
        <div class="transfer w-full rounded-10 p-12 font-size-14 flex items-center mb-12">
            <div class="left w-90% flex-shrink-0 ">
                <div class="li flex flex-shrink-0 gap-30">
                    <div class="l flex items-center gap-8">
                        <van-icon name="gold-coin-o" class="block" />
                        从
                    </div>
                    <div class="mid flex-1 flex justify-between items-center" @click="handleClickPicker(0)">
                        {{ form.baseAssetIdDesc }}
                        <van-icon name="arrow-down" class="w-20 h-20" />
                    </div>
                </div>
                <van-icon name="down" class="my-12" />
                <div class="li  flex flex-shrink-0 gap-30">
                    <div class="l flex items-center gap-8">
                        <van-icon name="gold-coin-o" class="block" />
                        至
                    </div>
                    <div class="mid flex-1 flex justify-between items-center" @click="handleClickPicker(1)">
                        {{ form.quoteAssetIdDesc }}
                        <van-icon name="arrow-down" class="w-20 h-20" />
                    </div>
                </div>
            </div>
            <div class="r flex-1 items-center flex justify-center" @click="change">
                <van-icon name="exchange" size="20px" class="rotate-90" />
            </div>
        </div>
        <inputCom :label="'金额'" class="mb-12" :placeholder="'请输入金额'" v-model:value="form.amount" :tips="tips">
            <template #sendCode>
                <div class="absolute right-0 font-size-12 sendCode ">
                    {{ form.baseAssetIdDesc }} <span class="text-blue-500"
                        @click="form.amount = userBalance + ''">最大</span>
                </div>
            </template>
        </inputCom>
        <van-button type="primary" block @click="handleClickSubmit">提交</van-button>

        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
            <van-picker :columns="columns" :model-value="popType ? [form.baseAssetId] : [form.quoteAssetId]"
                @confirm="onConfirm" @cancel="showPicker = false" />
        </van-popup>

    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import {
    assetsList,
} from '@/api/market'
import { getBalance } from '@/api/user'
import { conversionInfo, conversion } from '@/api/conversion'
const columns = ref([])
const showPicker = ref(false)
const form = reactive({
    quoteAssetId: 0,
    quoteAssetIdDesc: '',
    baseAssetId: 0,
    baseAssetIdDesc: '',
    amount: ''
})
const price = ref(0)

const getDescById = (id: number) => {
    const item = columns.value.find(item => item.value == id)
    return item?.text || ''
}
const userBalance = ref(0)
const tips = ref('可用余额：0')
const popType = ref(0) // 0 base 1 quote
const handleClickPicker = (type: number) => {
    popType.value = type
    showPicker.value = true
    console.log(type)
}
const change = () => {
    const temp = form.baseAssetId
    form.baseAssetId = form.quoteAssetId
    form.quoteAssetId = temp
    const tempDesc = form.baseAssetIdDesc
    form.baseAssetIdDesc = form.quoteAssetIdDesc
    form.quoteAssetIdDesc = tempDesc
    tips.value = `可用余额：${price.value} ${form.baseAssetIdDesc}`

}
const onConfirm = (value: any) => {
}
const getBalanceColumns = async () => {
    const { data, code } = await assetsList({
        status: 1,
        isConversion: 1
    })
    if (code == 200) {
        columns.value = data.rows ? data.rows.map(item => {
            return {
                text: item.assetInfo.symbol,
                value: item.assetId
            }
        })
            : [];

        form.quoteAssetId = columns.value[0].value
        form.baseAssetId = columns.value[1].value
        form.quoteAssetIdDesc = columns.value[0].text
        form.baseAssetIdDesc = columns.value[1].text
        tips.value = `可用余额：${price.value} ${columns.value[0].text}`
    }

}

const getInfo = async () => {
    const { data, code } = await conversionInfo({
        quoteAssetId: form.quoteAssetId,
        baseAssetId: form.baseAssetId

    })
    if (code == 200) {
        price.value = `${data.baseAssetBalance}`
        console.log(data)
        tips.value = `可用余额：${price.value} ${form.baseAssetIdDesc}`

    }
}
const handleClickSubmit = async () => {
    const { data, code } = await conversion({
        quoteAssetId: form.quoteAssetId,
        baseAssetId: form.baseAssetId,
        amount: Number(form.amount)
    })
    if (code == 200) {
        console.log(data)
    }
}
onMounted(async () => {
    await getBalanceColumns()
    getInfo()
    getPair()

})
</script>
<style lang="less" scoped>
.transfer {
    background: var(--bg);
}
</style>
