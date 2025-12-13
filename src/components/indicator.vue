<script setup>
import ipo from '@/pages/ipo/index.vue'
import discount from "@/pages/discount/index.vue";
import fund from "@/pages/fund/index.vue";
import { addCommasToNumber } from "@/utils/tool";
import { isLogin } from "@/utils/auth";

// 获取数字的绝对值
function getAbsoluteValue(num) {
  return Math.abs(num);
}
import { useUserStore } from "@/stores";
import {
  assetsLogsGrid,
  getPosition,
  swapOrderAdd,
  swapOrderCancel,
  orderList as swapOrderList,
} from "@/api/swap";
import { useStore } from "@/stores/modules/index";
import { getCategoryPosition, userOrderList } from "@/api/market";
import { useI18n } from "vue-i18n";

const props = defineProps({
  activeName: {
    type: String,
  },
});
const { t } = useI18n();
const orderLoadStatus = ref(0);
const userStore = useUserStore();
const assetsData = computed(() => userStore.userInfo.assetsData);

const userInfo = computed(() => userStore.userInfo);
const tabList = ref([
  {
    label: "Stock",
    i18n: "Stock",
    value: "1",
    objKey: "assetsData",
  },
  {
    label: "Discount",
    objKey: "discountAssetsData",
    i18n: "Discount",
    value: "2",
  },
  {
    label: "Fund",
    objKey: "fundAssetsData",
    i18n: "Fund",
    value: "3",
  },
  {
    label: "IPO",
    value: "4",
    objKey: "ipoAssetsData",
    i18n: "IPO",
  },
  // {
  //   label: '股息',
  //   // objKey: 'dividendAssetsData',
  //   objKey: 'discountFundData',
  //   i18n: 'deal.dividend',
  //   value: '4',
  // },
]);

const activeIndex = ref(0);
let refreshTimer = null; // 定时器变量

function getUserInfoByObjKey(value) {
  for (const key in assetsData.value) {
    if (key == value) {
      return assetsData.value[key];
    }
  }
}

function changeTab(index) {
  // userStore.getAssetsData()

  // 清除之前的定时器
  clearRefreshTimer();

  if (index == 0) {
    getCategoryPositionData();
    // 启动定时器，每30秒刷新一次
    startRefreshTimer();
  }
  activeIndex.value = index;
}

// 启动定时器
function startRefreshTimer() {
  refreshTimer = setInterval(() => {
    getCategoryPositionData({}, false); // 定时刷新时不显示loading
  }, 30000); // 30秒 = 30000毫秒
}

// 清除定时器
function clearRefreshTimer() {
  if (refreshTimer) {
    clearInterval(refreshTimer);
    refreshTimer = null;
  }
}
onMounted(() => {
  if (isLogin()) {
    changeTab(0);
  }
});

// 组件卸载时清除定时器
onBeforeUnmount(() => {
  clearRefreshTimer();
});

const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const orderList = ref([]);
const categoryPositionData = ref([]);
async function getCategoryPositionData(params = {}, showLoading = true) {
  const { data, code } = await userOrderList(
    {
      page: 1,
      size: 10,
    },
    showLoading
  );
  if (code === 200) {
    categoryPositionData.value = data.list || [];
  }
}
const store = useStore();
watch(
  () => props.activeName,
  (newV) => {
    if (newV && (activeIndex.value == 0 || activeIndex.value == 4)) {
      getCategoryPositionData();
    }
  }
);
watch(
  () => store.getklineList,
  (newV) => {
    if (
      newV &&
      categoryPositionData.value &&
      categoryPositionData.value.length
    ) {
      categoryPositionData.value.forEach((e) => {
        let listItem = newV.find((item) => item.tradingId == e.tradingPairsId);
        if (listItem) {
          e.close = listItem.tick.close;
        }
      });
    }
  }
);
async function getOrderList(params = {}) {
  orderLoadStatus.value = 1;
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
    categoryId: props.activeName == "1" ? "200" : "201",
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
}
function cancelOrder(val) {
  let params = {
    id: val.id,
  };
  swapOrderCancel(params).then((res) => {
    if (res.code == 200) {
      showToast(t("Order canceled successfully"));
      orderList.value = [];

      if (val.type == "status1") {
        getOrderListStatus0(params);
        return;
      }
      getOrderList(params);
    }
  });
}
const showPicker = ref(false);
const amount = ref("");
const stockInfo = ref({});
const router = useRouter();
function handleClickSubmit(item) {
  router.push({
    path: "/buy",
    query: {
      type: 1, // 根据 inputType 决定 query.type 的值
      symbol: item.symbol,
      buyType: "stock",
    },
  });
}
function confirm() {
  swapOrderAdd({
    tradingPairsId: stockInfo.value.tradingPairsId,
    direction: "sell",
    amount: Number(amount.value),
    type: 1,
  }).then(({ data, code }) => {
    if (code === 200) {
      const toastText = "Sell Success";
      showToast(t(toastText));
      setTimeout(() => {
        showPicker.value = false;
        getCategoryPositionData();
      }, 500);
    }
  });
}
</script>

<template>
  <div class="indicator-content pb-24px">
    <div class="tab-box flex gap-8px px-24 py-24">
      <div v-for="(item, index) in tabList" :key="index"
        class="tab-item flex flex-1 items-center justify-center rounded-4 text-align-center line-height-24 px-10px"
        :class="{ active: index === activeIndex }" @click="changeTab(index)">
        <span>{{ t(item.i18n) }}</span>
      </div>
    </div>

    <div v-if="activeIndex === 0" class="indicator-td flex flex-col px-24 gap-16">
      <div v-for="(item, index) in categoryPositionData" :key="index"
        class="w-full px-16 pt-9px pb-20px bg-#F3F4F6 rounded-12px" @click="handleClickSubmit(item)">
        <div class="li flex items-center justify-between">
          <div class="left label flex gap-16">
            <img :src="item.logo" alt="" class="block h-40 w-40 rounded-full" />
            <div class="info h-40 flex items-center">
              <div class="name">{{ item.symbol }}</div>
              <!-- <div class="name color-#6B7280 text-12px">{{ item.symbolId }}</div> -->
            </div>
          </div>
          <div class="right flex-shrink-0 gap-12px text-align-right h-40">
            <div class="num up text-14px">+ {{ item.number }}</div>
            <div class="num color-#6B7280 text-12px">{{ t("Quantity") }}</div>
          </div>
        </div>
        <div class="categoryPositionDivider w-full h-1px bg-#EBECEF mt-12px mb-12px"></div>
        <div class="li flex items-center justify-between">
          <div class="left label flex-1 flex gap-4px flex-col">
            <div class="label text-#6B7280 text-12px">
              {{ t("Asset value") }}
            </div>
            <div class="value text-#111827 text-16px">
              ₹{{ addCommasToNumber(item.buy_price) }}
            </div>
          </div>
          <div class="right flex-1 flex gap-4px flex-col flex-shrink-0 gap-12px text-align-right">
            <div class="label text-#6B7280 text-12px">{{ t("Profit") }}</div>
            <div class="value text-#111827 text-16px" v-if="item.profit >= 0">
              ₹{{ addCommasToNumber(item.profit) }}
            </div>
            <div class="value text-#111827 text-16px" v-else>
              -₹{{ addCommasToNumber(getAbsoluteValue(item.profit)) }}
            </div>
          </div>
        </div>
      </div>
      <empty v-if="categoryPositionData && categoryPositionData.length === 0" />
    </div>
    <div v-if="activeIndex === 1" class="indicator-td flex">
      <discount :only-show-order="true" :category-id="activeName == '1' ? '200' : '201'" />
    </div>
    <div v-if="activeIndex === 2" class="indicator-td flex">
      <fund :only-show-order="true" />
    </div>
    <div v-if="activeIndex === 3" class="indicator-td flex">
      <ipo :only-show-order="true" />
    </div>

    <van-popup v-model:show="showPicker" destroy-on-close round position="bottom" :safe-area-inset-bottom="true"
      z-index="10000">
      <div class="w-full flex flex-col gap-12 p-12">
        <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
          <div class="name font-size-14">
            {{ stockInfo.symbol }}
          </div>
        </div>
        <inputCom v-model:value="amount" :label="t('SellShare')" :placeholder="t('input.PleaseEnter')" />
        <div class="sell-tips font-size-18 font-500">
          {{ t("MinBuyShare") }}: {{ stockInfo.minOrderSize }}
        </div>
        <div class="w-full flex gap-12">
          <div class="btn-box flex-1">
            <van-button type="default" class="h-40!" plain block @click="showPicker = false">
              {{ t("cancel") }}
            </van-button>
          </div>
          <div class="btn-box flex-1">
            <van-button type="primary" class="h-40!" block @click="confirm">
              {{ t("confirm") }}
            </van-button>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<style lang="less" scoped>
.indicator-content {
  width: 100%;
  height: 100%;
  // background: var(--bg);

  .tab-box {
    width: 100%;

    .tab-item {
      font-size: 12px;
      transition: all 0.3s;
      background: #f8f9fd;
      color: #94a3b8;
      font-weight: 700;
      white-space: nowrap;
    }

    .active {
      background: #f8f5ff;
      color: #6b39f4;
    }
  }

  .indicator-th {
    font-size: 12px;
  }

  .indicator-td {
    // border-bottom: 1px solid #212C4E
  }
}

.divdiver {
  width: 100%;
  height: 2px;
  background: #363d51;
}
</style>
