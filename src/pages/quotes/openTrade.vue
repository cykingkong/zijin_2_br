<template>
  <div class="openTrade-content">
    <VanNavBar title="123" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack">

      <template #title>
        <div class="flex flex-items-center gap-6"><van-icon name="exchange" @click="handleClickExchange" />{{
          userBalanceInfo.baseAsset.baseSymbolName }}</div>

      </template>
    </VanNavBar>
    <van-tabs v-model:active="activeName" @change="changeTab">
      <van-tab title="买入" :name="0">
        <tab1Page ref="tab1PageBuyRef" :tradingPairsId="tradingPairsId" :depthData="depthData"
          :userBalanceInfo="userBalanceInfo" :orderStatus="orderStatus" :orderLoadStatus="orderLoadStatus"
          :orderList="orderList" @handleClickSubmit="handleClickSubmit" @load-more="loadMoreOrderList"
          @handleClickIndicatorTab="handleClickIndicatorTab" @cancelOrder="cancelOrder" />
      </van-tab>
      <van-tab title="卖出" :name="1">
        <tab1Page ref="tab1PageSellRef" :tradingPairsId="tradingPairsId" :direction="2"
          :userBalanceInfo="userBalanceInfo" :orderStatus="orderStatus" :orderLoadStatus="orderLoadStatus"
          :depthData="depthData" @handleClickSubmit="handleClickSubmit"
          @handleClickIndicatorTab="handleClickIndicatorTab" :orderList="orderList" />
      </van-tab>
      <van-tab title="撤单" :name="2">
        <TabTablePage :table-th="['委托时间', '委託/成交價', '委托数量', '状态']" :table-data="orderListStatus0"
          :order-load-status0="orderLoadStatus0" @load-more="loadMoreOrderListStatus0"></TabTablePage>
      </van-tab>
      <van-tab title="持仓" :name="3">

        <holdPage :userPositionData="userPositionData"></holdPage>
      </van-tab>
      <van-tab title="查询" :name="4">
        <SearchPage></SearchPage>
      </van-tab>
    </van-tabs>

    <div
      class="fixed px-12 flex items-center justify-between  bottom-0 w-full bottom-chart-line line-height-24 font-size-16"
      @click="showBottom = !showBottom">
      K线图表<van-icon name="arrow-up" />
    </div>

    <!-- Popup -->
    <van-popup v-model:show="showLeft" position="left" :style="{ width: '80%', height: '100%' }">
      <div class="pop-content flex-col flex">
        <div class="pop-th flex-justify-between flex font-size-14 text-coolGray  my-12 px-12">
          <div class="th-item">名称</div>
          <div class="th-item text-align-right">最新价格/24H涨跌</div>
        </div>
        <div class="td flex-justify-between flex font-size-12  py-12 px-12" v-for="i in marketList">
          <div class="th-item">{{ i.tradingInfo.baseAssetInfo.symbol }}</div>
          <div class="th-item text-align-right">
            <div class="t"> {{ i.tradingInfo.baseAssetInfo ?
              i.tradingInfo.baseAssetInfo.unit : '' }} {{ i.lastPrice }}</div>
            <div :class="i.dayIncrease > 0 ? 'up' : 'down'">{{ i.dayIncrease > 0 ? '+' : '-' }}{{ i.dayIncrease }}%
            </div>
          </div>
        </div>
      </div>
    </van-popup>
    <van-popup v-model:show="showBottom" position="bottom">
      <div class="title px-12 py-12 font-size-14">K线图表</div>
      <div class="h-500 px-12">
        <charts v-if="tradingPairsId" ref="EhartsData" :trading_pair_id="tradingPairsId"></charts>
      </div>
    </van-popup>
  </div>
</template>
<route lang="json5">
    {
      name: 'openTrade',
      meta: {
        title: 'openTrade',
        i18n: 'menus.openTrade'
      },
    }
</route>
<script setup>
import charts from '@/components/charts/charts.vue'
import tab1Page from './component/openTradeCom/tab-page.vue';
import TabTablePage from './component/openTradeCom/tab-table-page.vue';
import SearchPage from './component/openTradeCom/search-page.vue';
import holdPage from './component/openTradeCom/hold-page.vue';
import { depth, kline, } from '@/api/market'
import { getBalancePair } from '@/api/user';
import { swapOrderAdd, swapOrderCancel, orderList as swapOrderList, getPosition } from '@/api/swap'
import { useStore } from '@/stores/modules/index';
import Socket from '@/utils/Socket';
const activeName = ref('0')
let ws = null
const showLeft = ref(false)
const showBottom = ref(false)
const handleClickExchange = () => {
  showLeft.value = !showLeft.value
}
const marketList = computed(() => store.getMarketList)

const tab1PageBuyRef = ref()
const tab1PageSellRef = ref()
const orderList = ref([])
const orderStatus = ref(0)// 0已撤单 1未成交 2已成交 
const orderLoadStatus = ref(0)
const orderLoadStatus0 = ref(0)
const route = useRoute()
const tradingPairsId = ref()
const store = useStore();
const page = reactive({
  pageIndex: 1,
  pageSize: 20
})
const userBalanceInfo = ref({
  baseAsset: {}
})
const router = useRouter()
const userPositionData = ({})
const depthData = ref([])
const orderListStatus0 = ref([])
const getBalance = async () => {
  const { data, code } = await getBalancePair({ tradingPairsId: tradingPairsId.value })
  if (code == 200) {
    console.log(data)
    userBalanceInfo.value = data
  }
}
function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}
const getDepth = async () => {
  const { data, code } = await depth({ tradingPairsId: tradingPairsId.value })
  if (code == 200) {
    depthData.value = data
  }
}
const changeTab = (val) => {
  page.pageIndex = 1
  console.log(val)
  if (val == 0 || val == 1) {
    let params = {
      status: orderStatus.value == 0 ? 1 : 2,
      direction: val == 0 ? 'buy' : 'sell'
    }
    getOrderList(params)
  } else if (val == 2) {
    getOrderListStatus0()
  } else if (val == 3) {
    getPositionData()
  }
}
const addOrder = async (params) => {
  const { data, code } = await swapOrderAdd({
    tradingPairsId: tradingPairsId.value, ...params
  })
  if (code == 200) {
    showToast('购入成功')
    let params = {
      status: orderStatus.value == 0 ? 1 : 2,
      direction: activeName.value == 0 ? 'buy' : 'sell'
    }
    getOrderList(params)
  }
}
const cancelOrder = (val) => {
  console.log(val)
  let params = {
    id: val.id
  }
  swapOrderCancel(params).then(res => {
    if (res.code == 200) {
      showToast('撤单成功')
      let params = {
        status: orderStatus.value == 0 ? 1 : 2,
        direction: activeName.value == 0 ? 'buy' : 'sell'
      }
      getOrderList(params)
    }
  })
}
const loadMoreOrderList = () => {
  page.pageIndex++
  getOrderList()
}
const loadMoreOrderListStatus0 = () => {
  page.pageIndex++
  getOrderListStatus0()

}
const getPositionData = async () => {

  const { data, code } = await getPosition({
    tradingPairsId: tradingPairsId.value
  })
  if (code == 200) {
    userPositionData.value = data

  }
  console.log(data)
}
const getOrderListStatus0 = async (params = {}) => {
  orderLoadStatus.value = 1
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
    status: 0
  })
  if (code == 200) {
    // showToast('购入成功')
    if (!data.rows) {
      orderLoadStatus0.value = 3
      return
    }
    if (page.pageIndex == 1) {
      orderListStatus0.value = data.rows || []

    } else {
      orderListStatus0.value = [...orderListStatus0.value, ...(data.rows || [])]
    }
    if (data.total <= orderListStatus0.value.length) {
      orderLoadStatus0.value = 3
      return
    }
    orderLoadStatus0.value = 2

  }
}
const getOrderList = async (params = {}) => {
  orderLoadStatus.value = 1
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
  })
  if (code == 200) {
    // showToast('购入成功')
    if (!data.rows) {
      orderLoadStatus.value = 3
      return
    }
    if (page.pageIndex == 1) {
      orderList.value = data.rows || []

    } else {
      orderList.value = [...orderList.value, ...(data.rows || [])]
    }
    if (data.total <= orderList.value.length) {
      orderLoadStatus.value = 3
      return
    }
    orderLoadStatus.value = 2

  }

}
const handleClickSubmit = (params) => {
  addOrder(params)
}
const handleClickIndicatorTab = (val) => {
  console.log(val)
  orderList.value = []
  orderLoadStatus.value = 1
  page.pageIndex = 1

  orderStatus.value = val;
  if (val < 2) {
    let params = {
      status: val == 0 ? 1 : 2,
      direction: activeName.value == 0 ? 'buy' : 'sell'
    }
    getOrderList(params)
  } else if (val == 2) {
    getBalance()
  }

}
const SocketWs = () => {
  ws = new Socket('/wss');
  console.log(ws, 'kjhkjhkh')
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
const getKline = async () => {
  const res = await kline({ tradingPairsId: tradingPairsId.value, period: '1min' })
  // klineType.value.push(res.data[res.data.length - 1])
  store.setlistData(res.data[res.data.length - 1]);
}
const init = async () => {
  await getKline()
  await getDepth()
  await getBalance()
  SocketWs()
  // await getOrderList()
}
onUnmounted(() => {
  closews()
})
onMounted(async () => {
  if (route.query.id) {
    tradingPairsId.value = route.query.id
    await init()
    // showBottom.value = true

  }
})
</script>
<style lang="less" scoped>
.bottom-chart-line {
  padding: 12px 12px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
  background: #090c14;
  text-align: center;
}
</style>