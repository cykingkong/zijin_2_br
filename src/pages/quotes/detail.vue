<template>
  <div class="detail px-12 pb-120 pt-12">
    <VanNavBar :title="listtext" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack" />

    <!-- <userBalance :data="userBalanceInfo"></userBalance> -->

    <div class="flex">
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
    </div>
    <div class="h-500">
      <charts v-if="tradingPairsId" ref="EhartsDataRef" :trading_pair_id="Number(tradingPairsId)"></charts>
    </div>
    <div class="w-full mt-12">
      <div class="flex th gap-12 mb-6 text-blueGray-400 font-size-12">
        <div class="l flex-1">{{ t("Buy") }}</div>
        <div class="l flex-1">{{ t("Sell") }}</div>
      </div>
      <div class="flex td gap-12 font-size-14">
        <div class="l flex-1">
          <div class="w-full flex mb-6" v-for="(item, index) in asks" :key="index">
            <div class="l flex-1">{{ addCommasToNumber(item[0]) }}</div>
            <div class="l flex-1 text-right up">{{ item[1] }}</div>
          </div>
        </div>
        <div class="l flex-1">
          <div class="w-full flex mb-6" v-for="(item, index) in bids" :key="index">
            <div class="l flex-1 down">{{ item[1] }}</div>
            <div class="l flex-1 text-right">
              {{ addCommasToNumber(item[0]) }}
            </div>
          </div>
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
import { useStore } from "@/stores/modules/index";
import { addCommasToNumber } from "@/utils/tool";
import Socket from "@/utils/Socket.js";
import local from "@/utils/local";
import charts from "@/components/charts/charts.vue";
import { market } from "@/api/market";

const tradingPairsId = ref();

const categoryId = ref();
const { t } = useI18n();
const store = useStore();
const EhartsDataRef = ref(null);
const router = useRouter();
const listtext = ref("");
const routeItem = ref("");
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
  const { data, code } = await market({
    pageIndex: 1,
    pageSize: 500,
    categoryId: categoryId.value,
  });
  if (code == 200) {
    columns.value = data.list.map((e) => {
      return {
        ...e,
        text:
          e.tradingInfo.baseAssetInfo.name +
          "/" +
          e.tradingInfo.quoteAssetInfo.name,
        value: e.tradingPairsId,
      };
    });
    canPick.value = true;
  }
};
const onConfirm = async ({ selectedOptions }) => {
  await closews();
  if (selectedOptions[0].tradingPairsId != tradingPairsId.value) {
    EhartsDataRef.value.childInte();
  }
  const item = selectedOptions[0];
  listtext.value =
    item.tradingInfo.baseAssetInfo.name +
    "/" +
    item.tradingInfo.quoteAssetInfo.name;
  tradingPairsId.value = item.tradingPairsId;
  router.replace({
    query: {
      ...route.query,
      id: item.tradingPairsId,
    },
  });
  local.setlocal("rankInfo", selectedOptions[0]);
  showPicker.value = false;
  SocketWs();
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
    path: "/quotes/openTrade",
    query: {
      type: inputType, // 根据 inputType 决定 query.type 的值
      id: tradingPairsId.value,
      categoryId: categoryId.value,
    },
  });
};

onMounted(async () => {
  if (route.query.categoryId) {
    categoryId.value = route.query.categoryId;
  }
  if (route.query.id) {
    tradingPairsId.value = route.query.id;
    routeItem.value = local.getlocal("rankInfo");
    listtext.value =
      routeItem.value.tradingInfo.baseAssetInfo.name +
      "/" +
      routeItem.value.tradingInfo.quoteAssetInfo.name;
    await getMarketList();
    await getDepth();
    await getBalance();
    SocketWs();
  }
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount", EhartsDataRef.value, tradingPairsId.value);
  EhartsDataRef.value.close();
  closews();
});
</script>
<style lang="less" scoped>
.bottom-btn-box {
  padding-top: 12px;
  background: white;
  padding-bottom: calc(env(safe-area-inset-bottom) + 12px);
}
</style>
