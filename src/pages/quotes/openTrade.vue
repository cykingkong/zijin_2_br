<template>
  <div class="openTrade-content">
    <VanNavBar title="123" :fixed="true" clickable placeholder :left-arrow="true">

      <template #title>
        <div class="flex flex-items-center gap-6"><van-icon name="exchange" @click="handleClickExchange" />LEAD</div>

      </template>
    </VanNavBar>
    <van-tabs v-model:active="activeName" @change="changeTab">
      <van-tab title="买入" :name="0">
        <tab1Page ref="tab1PageBuyRef" :tradingPairsId="tradingPairsId" :depthData="depthData"
          :userBalanceInfo="userBalanceInfo" :orderStatus="orderStatus" :orderList="orderList"
          @handleClickSubmit="handleClickSubmit" @handleClickIndicatorTab="handleClickIndicatorTab"
          @cancelOrder="cancelOrder" />
      </van-tab>
      <van-tab title="卖出" :name="1">
        <tab1Page ref="tab1PageSellRef" :tradingPairsId="tradingPairsId" :direction="2"
          :userBalanceInfo="userBalanceInfo" :depthData="depthData" @handleClickSubmit="handleClickSubmit"
          @handleClickIndicatorTab="handleClickIndicatorTab" :orderList="orderList" />
      </van-tab>
      <van-tab title="撤单" :name="2">
        <TabTablePage :table-th="['委托时间', '委託/成交價', '委托数量', '状态']" :table-data="[]"></TabTablePage>
      </van-tab>
      <van-tab title="持仓" :name="3">
        <TabTablePage :table-th="['市值', '总盈亏', '持仓/可用', '成本/现价', '当日盈亏']" :table-data="[]" :td-type="2"></TabTablePage>

      </van-tab>
      <van-tab title="查询" :name="4">
        <SearchPage></SearchPage>
      </van-tab>
    </van-tabs>



    <!-- Popup -->
    <van-popup v-model:show="showLeft" position="left" :style="{ width: '80%', height: '100%' }">
      <div class="pop-content flex-col flex">
        <div class="pop-th flex-justify-between flex font-size-14 text-coolGray  my-12 px-12">
          <div class="th-item">名称</div>
          <div class="th-item text-align-right">最新价格/24H涨跌</div>
        </div>
        <div class="td flex-justify-between flex font-size-12  py-12 px-12" v-for="i in 100">
          <div class="th-item">LDSE</div>
          <div class="th-item text-align-right">
            <div class="t">0.33323123</div>
            <div class="up">-0.1</div>
          </div>
        </div>
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
const activeName = ref('0')
import tab1Page from './component/openTradeCom/tab-page.vue';
import TabTablePage from './component/openTradeCom/tab-table-page.vue';
import SearchPage from './component/openTradeCom/search-page.vue';
import { depth, kline, } from '@/api/market'
import { getBalancePair } from '@/api/user';
import { swapOrderAdd, swapOrderCancel, orderList as swapOrderList } from '@/api/swap'
import { useStore } from '@/stores/modules/index';

const showLeft = ref(false)
const handleClickExchange = () => {
  showLeft.value = !showLeft.value
}
const tab1PageBuyRef = ref()
const tab1PageSellRef = ref()
const orderList = ref([])
const orderStatus = ref(0)// 0已撤单 1未成交 2已成交 
const route = useRoute()
const tradingPairsId = ref()
const store = useStore();
const page = reactive({
  pageIndex: 1,
  pageSize: 10
})
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
const changeTab = (val) => {

  if (val == 0 || val == 1) {
    let params = {
      status: orderStatus.value == 0 ? 1 : 2,
      direction: val == 0 ? 'buy' : 'sell'
    }
    getOrderList(params)
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
const getOrderList = async (params = {}) => {

  const { data, code } = await swapOrderList({
    ...page,
    ...params,

  })
  if (code == 200) {
    // showToast('购入成功')
    orderList.value = data.rows || []
  }

}
const handleClickSubmit = (params) => {
  addOrder(params)
}
const handleClickIndicatorTab = (val) => {
  console.log(val)
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
const getKline = async () => {
  const res = await kline({ tradingPairsId: tradingPairsId.value, period: '1min' })
  // klineType.value.push(res.data[res.data.length - 1])
  store.setlistData(res.data[res.data.length - 1]);
}
const init = async () => {
  await getKline()
  await getDepth()
  await getBalance()
  // await getOrderList()
}
onMounted(async () => {
  if (route.query.id) {
    tradingPairsId.value = route.query.id
    init()


  }
})
</script>