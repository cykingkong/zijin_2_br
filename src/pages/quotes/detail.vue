<template>
  <div class="detail  pb-120 ">
    <VanNavBar :title="listtext" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack">
      <template #title>
        <div class="flex items-center color-#000 gap-8px" @click="handleClickPop">
          {{ listtext }}

          <van-icon name="arrow" color="#000" />

        </div>
      </template>
    </VanNavBar>

    <!-- <userBalance :data="userBalanceInfo"></userBalance> -->

    <!-- <div class="flex px-24">
      <div class="l flex flex-1 flex-col gap-12">
        <div class="picker flex items-center" @click="handleClickPop">
          {{ listtext }}
          <van-icon style="margin-left: 5px" name="arrow-down" />
        </div>
        <div class="" :style="{
          color:
            klineData.dayIncrease < 0
              ? 'rgb(255, 72, 52)'
              : 'rgb(0, 197, 114)',
        }">
          {{ addCommasToNumber(klineData.close) }}
        </div>
        <div class="">
          <span :style="{
            color:
              klineData.dayIncrease < 0
                ? 'rgb(255, 72, 52)'
                : 'rgb(0, 197, 114)',
          }">{{ klineData.dayIncrease }}%</span>
        </div>
      </div>
      <div class="options-h flex-1 font-size-12 line-height-25">
        <div class="flex justify-between items-center">
          <div class="text-blueGray-400">{{ t("Highest price") }}</div>
          <div>{{ addCommasToNumber(klineData.high) }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-blueGray-400">{{ t("Lowest price") }}</div>
          <div>{{ addCommasToNumber(klineData.low) }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-blueGray-400">{{ t("Open price") }}</div>
          <div>{{ addCommasToNumber(klineData.open) }}</div>
        </div>
        <div class="flex justify-between items-center">
          <div class="text-blueGray-400">{{ t("Close price") }}</div>
          <div>{{ addCommasToNumber(klineData.close) }}</div>
        </div>
      </div>
    </div> -->
    <div class="h-600 " v-if="routeItem">
      <klineDetailWidget :symbol="routeItem.tradingview_name"></klineDetailWidget>
    </div>
    <!-- <div class="h-500 fixed right-[-1000px]">
      <charts v-if="tradingPairsId" ref="EhartsDataRef" :trading_pair_id="Number(tradingPairsId)"></charts>
    </div> -->
    <div class="MarketStatistics px-24 py-24" v-if="false">
      <div class="title text-20px font-700 flex items-center gap-8px">Market Statistics <img
          src="@/assets/image/question.svg" alt="" class="w-16 h-16 "></div>
      <div class="options-h flex-1 font-size-12 flex line-height-25 gap-20">
        <div class="flex-1 flex options-h-item justify-between items-center h-44px">
          <div class="text-blueGray-400">{{ t("Highest price") }}</div>
          <div>{{ addCommasToNumber(klineData.high) }}</div>
        </div>
        <div class="flex-1 flex options-h-item justify-between items-center h-44px">
          <div class="text-blueGray-400">{{ t("Lowest price") }}</div>
          <div>{{ addCommasToNumber(klineData.low) }}</div>
        </div>
      </div>
      <div class="options-h flex-1 font-size-12 flex line-height-25 gap-20">

        <div class="flex-1 flex options-h-item justify-between items-center h-44px">
          <div class="text-blueGray-400">{{ t("Open price") }}</div>
          <div>{{ addCommasToNumber(klineData.open) }}</div>
        </div>
        <div class="flex-1 flex options-h-item justify-between items-center h-44px">
          <div class="text-blueGray-400">{{ t("Close price") }}</div>
          <div>{{ addCommasToNumber(klineData.close) }}</div>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 w-full left-0 flex justify-center bottom-btn-box z-99">
      <div class="btn-box flex gap-30">
        <div class="b1 flex-1 w-140">
          <van-button type="primary" block color="#1BC256" @click="handelClickBtn(0)">{{ t("Buy") }}</van-button>
        </div>
        <div class="b1 flex-1 w-140">
          <van-button type="primary" color="#E82C81" block @click="handelClickBtn(1)">{{ t("Sell") }}</van-button>
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
import { ref, reactive, onBeforeUnmount } from "vue";
import { getBalancePair } from "@/api/user";
import { depth, kline } from "@/api/market";
import { assetsDetail } from "@/api/stock";
import { useStore } from "@/stores/modules/index";
import { addCommasToNumber } from "@/utils/tool";
import Socket from "@/utils/Socket.js";
import local from "@/utils/local";
import charts from "@/components/charts/charts.vue";
import { assetsList } from "@/api/stock";
import klineDetailWidget from "./component/klineDetailWidget.vue";
const tradingPairsId = ref();

const categoryId = ref();
const { t } = useI18n();
const store = useStore();
const EhartsDataRef = ref(null);
const router = useRouter();
const listtext = ref("");
const routeItem = ref(null);
const columns = ref([]);
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
let ws = reactive(null);
const showPicker = ref(false);
const handleClickPop = () => {
  if (!canPick.value) {
    return;
  }
  showPicker.value = true;
};
const canPick = ref(false);

const getMarketList = async () => {
  const { data, code } = await assetsList({
    page: 1,
    size: 500,
    type: '0'
  });
  if (code == 200) {
    columns.value = data.list.map((e) => {
      return {
        ...e,
        text:
          e.name,

        value: e.asset_id,
      };
    });
    canPick.value = true;
  }
};
const onConfirm = async ({ selectedOptions }) => {
  await getStockDetail({
    symbol: selectedOptions[0].symbol
  })

  showPicker.value = false;

};
const klineData = computed(() => {
  console.log(store.getlistData, "klineData");
  return store.getlistData;
});

const route = useRoute();
const time = ref(["1m", "5m", "15m", "30m", "60m", "4h", "1d", "1w"]);
const userBalanceInfo = ref({
  baseAsset: {},
});
const depthData = ref([]);
const asks = ref([]);
const bids = ref([]);
const getBalance = async () => {
  const { data, code } = await getBalancePair({
    tradingPairsId: tradingPairsId.value,
  });
  if (code == 200) {
    console.log(data);
    userBalanceInfo.value = data;
  }
};
const getDepth = async () => {
  const { data, code } = await depth({ tradingPairsId: tradingPairsId.value });
  if (code == 200) {
    asks.value = data.asks;
    bids.value = data.bids;
  }
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
const SocketWs = () => {
  ws = new Socket("/wss");
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
const handelClickBtn = (inputType) => {
  // 参数名建议修改以避免与 query 中的 'type' 混淆
  router.push({
    path: "/buy",
    query: {
      type: inputType, // 根据 inputType 决定 query.type 的值
      symbol: routeItem.value.symbol,
      buyType: 'stock'
    },
  });
};
const getStockDetail = async (params) => {
  const { data, code } = await assetsDetail(params);
  if (code == 200) {
    console.log(data);
    routeItem.value = data;
    listtext.value = data.name
  }

}
onMounted(async () => {
  await getStockDetail({
    symbol: route.query.symbol
  })
  await getMarketList();

  // if (route.query.categoryId) {
  //   categoryId.value = route.query.categoryId;
  // }
  // if (route.query.id) {
  //   tradingPairsId.value = route.query.id;

  //   // routeItem.value = local.getlocal("rankInfo");

  //   // listtext.value =
  //   //   routeItem.value.tradingInfo.baseAssetInfo.name +
  //   //   "/" +
  //   //   routeItem.value.tradingInfo.quoteAssetInfo.name;
  //   await getStockDetail({
  //     symbol: route.query.symbol
  //   })
  //   // await getDepth();
  //   // await getBalance();
  //   // SocketWs();
  // }
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount", EhartsDataRef.value, tradingPairsId.value);
  // EhartsDataRef.value.close();
  closews();
});
</script>
<style lang="less" scoped>
.bottom-btn-box {
  padding-top: 12px;
  background: white;
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
}

.options-h-item {
  border-bottom: 1px solid #E2E8F0;
}
</style>
