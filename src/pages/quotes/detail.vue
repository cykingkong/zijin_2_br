<template>
    <div class="detail px-12 pb-120 pt-12">
        <VanNavBar :title="listtext" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack" />

        <!-- <userBalance :data="userBalanceInfo"></userBalance> -->
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
                    <div class="w-full flex mb-6" v-for="(item, index) in asks" :key="index">
                        <div class="l flex-1">{{ addCommasToNumber(item[0]) }}</div>
                        <div class="l flex-1 text-right down">{{ item[1] }}</div>
                    </div>
                </div>
                <div class="l flex-1">
                    <div class="w-full flex mb-6" v-for="(item, index) in bids" :key="index">
                        <div class="l flex-1 up">{{ item[1] }}</div>
                        <div class="l flex-1 text-right ">{{ addCommasToNumber(item[0]) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fixed bottom-0 w-full left-0 flex justify-center bottom-btn-box">
            <div class="btn-box flex gap-30">
                <div class="b1 flex-1 w-140"><van-button type="primary" block color="#F43368"
                        @click="handelClickBtn(0)">买入</van-button>
                </div>
                <div class="b1 flex-1 w-140"><van-button type="primary" block @click="handelClickBtn(1)">卖出</van-button>
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
import { addCommasToNumber } from '@/utils/tool'
import Socket from "@/utils/Socket.js";
import local from '@/utils/local'
import charts from '@/components/charts/charts.vue'

const tradingPairsId = ref()
const categoryId = ref()

const store = useStore();
const EhartsData = ref(null)
const router = useRouter()
const listtext = ref('')
const routeItem = ref('')
const columns = computed(() => {
    let arr = store.getMarketList.map((e) => {
        return {
            ...e,
            text: e.tradingInfo.baseAssetInfo.name + '/' + e.tradingInfo.quoteAssetInfo.name,
            value: e.tradingPairsId
        }
    })
    return arr

})
function onBack() {
    if (window.history.state.back)
        history.back()
    else
        router.replace('/')
}
let ws = reactive(null)
const showPicker = ref(false)
const handleClickPop = () => {
    showPicker.value = true
}
const onConfirm = async ({ selectedOptions }) => {
    await closews()
    if (selectedOptions[0].tradingPairsId != tradingPairsId.value) {
        EhartsData.value.childInte()
    }
    const item = selectedOptions[0]
    listtext.value = item.tradingInfo.baseAssetInfo.name + '/' + item.tradingInfo.quoteAssetInfo.name
    tradingPairsId.value = item.tradingPairsId
    router.replace({
        query: {
            ...route.query,
            id: item.tradingPairsId
        }
    })
    local.setlocal('rankInfo', selectedOptions[0])
    showPicker.value = false
    SocketWs()

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
const asks = ref([])
const bids = ref([])
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
        asks.value = data.asks
        bids.value = data.bids
    }
}

const closews = () => {
    if (ws) {
        ws.send({
            action: "UnSubscribe",
            params: {
                tradingPairsId: tradingPairsId.value,
                period: 'depth'
            }
        });
    }
}
const SocketWs = () => {
    ws = new Socket('/wss');
    ws.on("open", () => {
        ws.send({
            action: "Subscribe",
            params: {
                tradingPairsId: tradingPairsId.value,
                period: 'depth'
            }
        });
    });
    ws.on("message", res => {
        if (res.code == 200 && JSON.stringify(res.data) != '{}' && res.msgType) {
            asks.value = res.data.tick.asks
            bids.value = res.data.tick.bids
        }
    });
}
const handelClickBtn = (inputType) => { // 参数名建议修改以避免与 query 中的 'type' 混淆
    router.push({
        path: '/quotes/openTrade',
        query: {
            type: inputType, // 根据 inputType 决定 query.type 的值
            id: tradingPairsId.value,
            categoryId: categoryId.value
        }
    });
}

onMounted(async () => {
    if (route.query.categoryId) {
        categoryId.value = route.query.categoryId;
    }
    if (route.query.id) {
        tradingPairsId.value = route.query.id
        routeItem.value = local.getlocal('rankInfo')
        listtext.value = routeItem.value.tradingInfo.baseAssetInfo.name + '/' + routeItem.value.tradingInfo.quoteAssetInfo.name
        await getDepth()
        await getBalance()
        SocketWs()
    }
})
onBeforeUnmount(() => {
    EhartsData.value.close()
    closews()
})


</script>
<style lang="less" scoped>
.bottom-btn-box {
    padding-top: 12px;
    background: var(--bg);
    padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
}
</style>
