<template>
  <div class="openTrade-content">
    <VanNavBar
      title=""
      :fixed="true"
      clickable
      placeholder
      :left-arrow="true"
      @click-left="onBack"
      z-index="999"
    >
      <template #title>
        <div class="flex flex-items-center gap-6">
          <van-icon
            name="exchange"
            @click="handleClickExchange"
            :size="20"
            class=".dark:text-white .light:text-black"
          />
          {{ listtext }}
        </div>
      </template>
    </VanNavBar>
    <van-tabs v-model:active="activeName" @change="changeTab">
      <van-tab :title="t('Buy')" :name="0">
        <tab1Page
          ref="tab1PageBuyRef"
          :tradingPairsId="tradingPairsId"
          :depthData="depthData"
          :listtext="listtext"
          :routeItem="routeItem"
          :userBalanceInfo="userBalanceInfo"
          :orderStatus="orderStatus"
          :orderLoadStatus="orderLoadStatus"
          :orderList="orderList"
          @handleClickSubmit="handleClickSubmit"
          @load-more="loadMoreOrderList"
          @handleClickIndicatorTab="handleClickIndicatorTab"
          @cancelOrder="cancelOrder"
          @to-detail="toDetail"
          v-if="activeName == 0"
        />
      </van-tab>
      <van-tab :title="t('Sell')" :name="1">
        <tab1Page
          ref="tab1PageSellRef"
          :tradingPairsId="tradingPairsId"
          :direction="2"
          :routeItem="routeItem"
          :listtext="listtext"
          :userBalanceInfo="userBalanceInfo"
          :orderStatus="orderStatus"
          :orderLoadStatus="orderLoadStatus"
          :depthData="depthData"
          @handleClickSubmit="handleClickSubmit"
          @load-more="loadMoreOrderList"
          @handleClickIndicatorTab="handleClickIndicatorTab"
          :orderList="orderList"
          v-if="activeName == 1"
        />
      </van-tab>
      <van-tab :title="t('Cancel order')" :name="2">
        <TabTablePage
          :table-th="[
            'Entrustment time',
            'Transaction Price',
            'Order Quantity',
            'operation',
          ]"
          :table-data="orderListStatus0"
          :order-load-status0="orderLoadStatus0"
          @load-more="loadMoreOrderListStatus0"
          @cancelOrder="cancelOrder"
        >
        </TabTablePage>
      </van-tab>
      <van-tab :title="t('Holdings')" :name="3">
        <holdPage :userPositionData="userPositionData"></holdPage>
      </van-tab>
    </van-tabs>

    <div
      class="fixed px-12 flex items-center justify-between bottom-0 w-full bottom-chart-line line-height-24 font-size-16"
      @click="showBottom = !showBottom"
    >
      {{ t("Introduction") }}<van-icon name="arrow-up" />
    </div>

    <!-- Popup -->
    <van-popup
      v-model:show="showLeft"
      position="left"
      :style="{ width: '80%', height: '100%' }"
    >
      <div class="pop-content flex-col flex">
        <van-search
          v-model="search"
          show-action
          :placeholder="t('input.PleaseEnter')"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch">{{ t("input.Search") }}</div>
          </template>
        </van-search>
        <div
          class="pop-th flex-justify-between flex font-size-14 text-coolGray my-12 px-12"
        >
          <div class="th-item">{{ t("Name") }}</div>
          <div class="th-item text-align-right">
            {{ t("Latest Price / 24H Change") }}
          </div>
        </div>
        <div
          class="td flex-justify-between flex font-size-14 py-12 px-12"
          v-for="(i, k) in marketList"
          :key="k"
          @click="changeTradingPairsId(i)"
        >
          <div class="th-item">{{ i.tradingInfo.baseAssetInfo.symbol }}</div>
          <div class="th-item text-align-right">
            <div class="t">
              {{
                i.tradingInfo.baseAssetInfo
                  ? i.tradingInfo.baseAssetInfo.unit
                  : ""
              }}
              {{ addCommasToNumber(i.lastPrice) }}
            </div>
            <div :class="i.dayIncrease >= 0 ? 'up' : 'down'">
              {{ i.dayIncrease }}%
            </div>
          </div>
        </div>
        <LoadMore
          :status="marketListLoadStatus"
          @load-more="loadMore"
        ></LoadMore>
      </div>
    </van-popup>
    <van-popup v-model:show="showBottom" position="bottom" :safe-area-inset-bottom="true">
      <div class="title px-12 py-12 font-size-14">{{ t("Introduction") }}</div>
      <div class="h-500 px-12 overflow-y-scroll pb-20px">
        <!-- <charts v-if="tradingPairsId" ref="EhartsData" :trading_pair_id="tradingPairsId" :itemsKey="1"></charts> -->
        <symbolDetail
          :baseAssetInfo="routeItem.tradingInfo.baseAssetInfo"
          v-if="tradingPairsId"
        ></symbolDetail>
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
import charts from "@/components/charts/charts.vue";
import tab1Page from "./component/openTradeCom/tab-page.vue";
import TabTablePage from "./component/openTradeCom/tab-table-page.vue";
import symbolDetail from "./component/openTradeCom/symbolDetail.vue";
import SearchPage from "./component/openTradeCom/search-page.vue";
import holdPage from "./component/openTradeCom/hold-page.vue";
import LoadMore from "@/components/LoadMore.vue";
import { showToast, showSuccessToast, allowMultipleToast } from "vant";
import { depth, kline } from "@/api/market";
import { getBalancePair } from "@/api/user";
import {
  swapOrderAdd,
  swapOrderCancel,
  orderList as swapOrderList,
  getPosition,
  assetsLogsGrid,
} from "@/api/swap";
import { market } from "@/api/market";
import { useStore } from "@/stores/modules/index";
import Socket from "@/utils/Socket";
import local from "@/utils/local";
import { addCommasToNumber } from "@/utils/tool";
allowMultipleToast();
const activeName = ref(0);
const { t } = useI18n();
let ws = null;
const showLeft = ref(false);
const showBottom = ref(false);
const handleClickExchange = () => {
  showLeft.value = !showLeft.value;
};
const rankInfo = ref();
const listtext = ref("");
const routeItem = ref("");
const search = ref("");
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const EhartsData = ref(null);

const marketList = ref([]);
const marketListLoadStatus = ref(0);
const categoryId = ref();
const marketPage = reactive({
  pageIndex: 1,
  pageSize: 20,
});
const loadMore = () => {
  marketPage.pageIndex++;
  getMarketList();
};
const getMarketList = async () => {
  marketListLoadStatus.value = 1;
  const { data, code } = await market({
    ...marketPage,
    categoryId: categoryId.value,
    symbol: search.value,
  });
  if (code == 200) {
    marketListLoadStatus.value = 2;

    if (!data.list) {
      marketListLoadStatus.value = 3;
      return;
    }
    if (marketPage.pageIndex == 1) {
      marketList.value = data.list || [];
    } else {
      marketList.value = marketList.value.concat(data.list || []);
    }
    if (data.total <= marketList.value.length) {
      marketListLoadStatus.value = 3;
      return;
    }
  }
};
const onSearch = () => {
  marketList.value = [];
  getMarketList({});
};
const tab1PageBuyRef = ref();
const tab1PageSellRef = ref();
const orderList = ref([]);
const orderStatus = ref(0); // 0已撤单 1未成交 2已成交
const orderLoadStatus = ref(0);
const orderLoadStatus0 = ref(0);
const route = useRoute();
const tradingPairsId = ref();
const store = useStore();

const userBalanceInfo = ref({
  baseAsset: {},
  quoteAsset: {},
});
const router = useRouter();
const userPositionData = ref();
const depthData = ref([]);
const orderListStatus0 = ref([]);
const getBalancePairInfo = async () => {
  const { data, code } = await getBalancePair({
    tradingPairsId: tradingPairsId.value,
  });
  if (code == 200) {
    console.log(data);
    userBalanceInfo.value = data;
  }
};
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const getDepth = async () => {
  const { data, code } = await depth({ tradingPairsId: tradingPairsId.value });
  if (code == 200) {
    depthData.value = data;
  }
};
const changeTab = (val) => {
  console.log(val, "val");
  page.pageIndex = 1;
  orderList.value = [];
  if (tradingPairsId.value) {
    getBalancePairInfo();
  }
  if (val == 0 || val == 1) {
    let params = {
      status: orderStatus.value == 0 ? 1 : 2,
      direction: val == 0 ? "buy" : "sell",
    };
    getOrderList(params);
  } else if (val == 2) {
    getOrderListStatus0();
  } else if (val == 3) {
    // if (!userPositionData.value) {
    getPositionData();

    // }
  }
};
const timer = ref(null);
const reloadOrderList = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
  if (orderStatus.value == 0 || activeName.value == 2) {
    if (activeName.value == 2) {
      getOrderListStatus0();
      return;
    }
    let p = {
      status: orderStatus.value == 0 ? 1 : 2,
      direction: activeName.value == 0 ? "buy" : "sell",
    };
    getOrderList(p);
  }
};
const addOrder = async (params) => {
  swapOrderAdd({
    tradingPairsId: tradingPairsId.value,
    ...params,
  }).then(({ data, code }) => {
    if (code == 200) {
      let p = {
        status: orderStatus.value == 0 ? 1 : 2,
        direction: activeName.value == 0 ? "buy" : "sell",
      };
      let toastText = p.direction == "buy" ? "Buy Success" : "Sell Success";
      showToast(t(toastText));
      getBalancePairInfo();

      getPositionData();
      getOrderList(p);
      // 如果是当前委托，则定时5秒后刷新订单列表,如果再次购买，则将之前的5秒定时器重设为5秒
      if (orderStatus.value == 0 || activeName.value == 2) {
        if (timer.value) {
          clearTimeout(timer.value);
          timer.value = null;
        }
        timer.value = setTimeout(() => {
          reloadOrderList();
        }, 5500);
      }
    }
  });
};
const cancelOrder = (val) => {
  let params = {
    id: val.id,
  };
  swapOrderCancel(params).then((res) => {
    if (res.code == 200) {
      showToast(t("Cancel order Success"));
      orderList.value = [];
      let params = {
        status: orderStatus.value == 0 ? 1 : 2,
      };
      getBalancePairInfo();
      getPositionData();
      if (val.type == "status1") {
        getOrderListStatus0(params);
        return;
      }
      getOrderList(params);
    }
  });
};
const toDetail = () => {
  router.push(
    "/quotes/detail?id=" +
      tradingPairsId.value +
      "&categoryId=" +
      categoryId.value
  );
};
const loadMoreOrderList = () => {
  page.pageIndex++;
  getOrderList();
};
const loadMoreOrderListStatus0 = () => {
  page.pageIndex++;
  getOrderListStatus0();
};
const getPositionData = async () => {
  const { data, code } = await getPosition({
    tradingPairsId: tradingPairsId.value,
  });
  if (code == 200) {
    // 判断data返回的数据是否为{}
    // if (!Object.keys(data).length) {
    userPositionData.value = data;

    // }
    console.log(userPositionData.value);
  }
};
const getOrderListStatus0 = async (params = {}) => {
  orderLoadStatus.value = 1;
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
    status: 1,
    tradingPairsId: tradingPairsId.value,
  });
  if (code == 200) {
    // showToast('购入成功')
    if (!data.rows) {
      if (page.pageIndex == 1) {
        orderListStatus0.value = [];
      }
      orderLoadStatus0.value = 3;
      return;
    }
    if (page.pageIndex == 1) {
      orderListStatus0.value = data.rows || [];
    } else {
      orderListStatus0.value = [
        ...orderListStatus0.value,
        ...(data.rows || []),
      ];
    }
    if (data.total <= orderListStatus0.value.length) {
      orderLoadStatus0.value = 3;
      return;
    }
    orderLoadStatus0.value = 2;
  }
};
const getOrderList = async (params = {}) => {
  orderLoadStatus.value = 1;
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
    tradingPairsId: tradingPairsId.value,
  });
  if (code == 200) {
    // showToast('购入成功')
    if (!data.rows) {
      if (page.pageIndex == 1) {
        orderList.value = [];
      }
      orderLoadStatus.value = 3;
      return;
    }
    if (page.pageIndex == 1) {
      orderList.value = data.rows || [];
    } else {
      orderList.value = [...orderList.value, ...(data.rows || [])];
    }
    if (data.total <= orderList.value.length) {
      orderLoadStatus.value = 3;
      return;
    }
    orderLoadStatus.value = 2;
  }
};
const changeTradingPairsId = async (item) => {
  await closews();
  if (item.tradingPairsId != tradingPairsId.value) {
    console.log(EhartsData.value, "EhartsData.value");
    if (EhartsData.value) {
      EhartsData.value.childInte();
    }
  }
  routeItem.value = item;
  listtext.value =
    item.tradingInfo.baseAssetInfo.name +
    "/" +
    item.tradingInfo.quoteAssetInfo.name;
  tradingPairsId.value = item.tradingPairsId;
  orderList.value = [];
  local.setlocal("rankInfo", item);
  // 更新浏览器URL
  const currentCategoryId = route.query.categoryId || categoryId.value; // 保留现有的categoryId
  const newUrl = `${window.location.pathname}?id=${item.tradingPairsId}${
    currentCategoryId ? "&categoryId=" + currentCategoryId : ""
  }`;
  window.history.replaceState(null, "", newUrl);
  getPositionData();

  await init();
  showLeft.value = false;
  SocketWs();
};
const handleClickSubmit = (params) => {
  addOrder(params);
};

const handleClickIndicatorTab = (val) => {
  // 切换委托状态
  orderList.value = [];
  orderLoadStatus.value = 1;
  page.pageIndex = 1;
  orderStatus.value = val;
  if (val < 2) {
    let params = {
      status: val == 0 ? 1 : 2,
      direction: activeName.value == 0 ? "buy" : "sell",
    };
    getOrderList(params);
  } else if (val == 2) {
    getBalancePairInfo();
  }
};
const SocketWs = () => {
  ws = new Socket("/wss");
  console.log(ws, "kjhkjhkh");
  ws.on("open", () => {
    ws.send({
      action: "Subscribe",
      params: {
        tradingPairsId: tradingPairsId.value,
        period: "depth",
      },
    });
  });
  ws.on("message", (res) => {
    if (res.code == 200 && JSON.stringify(res.data) != "{}" && res.msgType) {
      asks.value = res.data.tick.asks;
      bids.value = res.data.tick.bids;
    }
  });
};
const closews = () => {
  if (ws) {
    ws.send({
      action: "UnSubscribe",
      params: {
        tradingPairsId: tradingPairsId.value,
        period: "depth",
      },
    });
  }
};
const getKline = async () => {
  const res = await kline({
    tradingPairsId: tradingPairsId.value,
    period: "1min",
  });
  // klineType.value.push(res.data[res.data.length - 1])
  store.setlistData(res.data[res.data.length - 1]);
};
const init = async () => {
  await getKline();
  await getDepth();
  await getBalancePairInfo();
  await getPositionData();

  SocketWs();
  let params = {
    status: orderStatus.value == 0 ? 1 : 2,
    direction: "buy",
  };
  if (tab1PageBuyRef.value) {
    params.direction = "buy";
  } else if (tab1PageSellRef.value) {
    params.direction = "sell";
  }
  await getOrderList(params);
};
onUnmounted(() => {
  closews();
});
onMounted(async () => {
  if (route.query.categoryId) {
    categoryId.value = route.query.categoryId;
    await getMarketList();
  }
  if (route.query.type) {
    activeName.value = Number(route.query.type);
  }
  if (route.query.id) {
    tradingPairsId.value = route.query.id;
    routeItem.value = local.getlocal("rankInfo");

    listtext.value =
      routeItem.value.tradingInfo.baseAssetInfo.name +
      "/" +
      routeItem.value.tradingInfo.quoteAssetInfo.name;
    await init();
    // showBottom.value = true
  }
});
</script>
<style lang="less" scoped>
.bottom-chart-line {
  padding: 12px 12px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
  background: #090c14;
  text-align: center;
}
</style>