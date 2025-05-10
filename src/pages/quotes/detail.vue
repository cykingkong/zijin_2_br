<template>
    <div class="detail px-12 pb-40">
        <userBalance :data="userBalanceInfo"></userBalance>
        <div class="flex">
            <div class="l flex flex-1 flex-col gap-12">
                <div class="picker flex items-center" @click="handleClickPop">
                    {{ listtext }}
                    <van-icon style="margin-left:5px" name="arrow-down" />
                </div>
                <div class="" :style="{ 'color': klineData.increase < 0 ? 'rgb(255, 72, 52)' : 'rgb(0, 197, 114)' }">{{
                    klineData.close }}</div>
                <div class="">
                    <span :style="{ 'color': klineData.increase < 0 ? 'rgb(255, 72, 52)' : 'rgb(0, 197, 114)' }">{{
                        klineData.increase }}</span>
                </div>
            </div>
            <div class="options-h flex-1 font-size-12 line-height-25">
                <div class="flex justify-between items-center">
                    <div class="text-blueGray-400"> 最高价</div>
                    <div>{{ klineData.high }}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-blueGray-400"> 最低价</div>
                    <div>{{ klineData.low }}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-blueGray-400">开盘价</div>
                    <div>{{ klineData.open }}</div>
                </div>
                <div class="flex justify-between items-center">
                    <div class="text-blueGray-400">收盘价</div>
                    <div>{{ klineData.close }}</div>
                </div>
            </div>
        </div>
        <div class="h-500">
            <charts v-if="tradingPairsId" ref="EhartsData" :trading_pair_id="tradingPairsId"></charts>
        </div>
        <div class="w-full mt-12">
            <div class="flex th gap-12 mb-6 text-blueGray-400 font-size-12">
                <div class="l flex-1">买</div>
                <div class="l flex-1">卖</div>
            </div>
            <div class="flex td gap-12 font-size-14">
                <div class="l flex-1 ">
                    <div class="w-full flex mb-6" v-for="(item, index) in depthData.asks" :key="index">
                        <div class="l flex-1">{{ item[0] }}</div>
                        <div class="l flex-1 text-right down">{{ item[1] }}</div>
                    </div>
                </div>
                <div class="l flex-1">
                    <div class="w-full flex mb-6" v-for="(item, index) in depthData.bids" :key="index">
                        <div class="l flex-1 up">{{ item[1] }}</div>
                        <div class="l flex-1 text-right ">{{ item[0] }}</div>
                    </div>
                </div>
            </div>
        </div>
        <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
            <van-picker :columns="columns" :model-value="[tradingPairsId]" @confirm="onConfirm"
                @cancel="showPicker = false" />
        </van-popup>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { getBalancePair } from '@/api/user'
import { depth, kline, } from '@/api/market'
import { useStore } from '@/stores/modules/index';
import local from '@/utils/local'


import charts from '@/components/charts/charts.vue'
import userBalance from './component/detailCom/user-balance.vue'
const tradingPairsId = ref()
const store = useStore();
const EhartsData = ref(null)

const listtext = computed(() => {
    if (local.getlocal('rankInfo')) {
        return local.getlocal('rankInfo').tradingInfo.baseAssetInfo.name + '/' + local.getlocal('rankInfo').tradingInfo.quoteAssetInfo.name
    }
})
const columns = computed(() => {
    console.log(store.setMarketList, '123123')
    let arr = store.getMarketList.map((e) => {
        return {
            ...e,
            text: e.tradingInfo.baseAssetInfo.name + '/' + e.tradingInfo.quoteAssetInfo.name,
            value: e.tradingPairsId
        }
    })
    return arr

})
const showPicker = ref(false)
const handleClickPop = () => {
    showPicker.value = true
}
const onConfirm = ({ selectedOptions }) => {
    if (selectedOptions.tradingPairsId != tradingPairsId.value) {
        EhartsData.value.childInte()
    }
    tradingPairsId.value = selectedOptions.tradingPairsId
    local.setlocal('rankInfo', selectedOptions[0])
    showPicker.value = false
}
const klineData = computed(() => store.getlistData)
const route = useRoute()
const time = ref([
    '1m',
    '5m',
    '15m',
    '30m',
    '60m',
    '4h',
    '1d',
    '1w',
])
const userBalanceInfo = ref({
    baseAsset: {}
})
const depthData = ref([])
const getBalance = async () => {
    const { data, code } = await getBalancePair({ tradingPairsId: tradingPairsId.value })
    if (code == 200) {
        console.log(data)
        userBalanceInfo.value = data
    }
}
const getDepth = async () => {
    const { data, code } = await depth({ tradingPairsId: tradingPairsId.value })
    if (code == 200) {
        depthData.value = data
    }
}
const getKline = async () => {
    const res = await kline({ tradingPairsId: tradingPairsId.value, period: '1min' })
    console.log(res)
}
onMounted(async () => {
    console.log(route)

    if (route.query.id) {
        tradingPairsId.value = route.query.id
        await getDepth()
        await getBalance()
    }
})



</script>
<style lang="less" scoped></style>
