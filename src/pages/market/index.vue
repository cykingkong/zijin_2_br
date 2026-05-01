<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "@/router";
import { productList, userProductList } from "@/api/product";
import { addCommasToNumber } from "@/utils/tool";

const activeName = ref(0);
const searchMarkShow = ref(false);
const enumBtnText = {
  0: 'Sold out',
  1: 'Buy Now',
  2: 'Sold out',
  3: 'Pre-sale',
  4: 'Presente grátis'
}
const productTypeEnum = {
  1: "Dias alternados",
  2: "Cada Dias",
  3: "Cada Horas"
}
const renderLabel = (productType: number, incomeReleaseCycle: any) => {
  if (productType == 1) {
    return 'Dias alternados'
  } else if (productType == 2) {
    return `Cada ${incomeReleaseCycle} Dias`
  } else if (productType == 3) {
    return `Cada ${incomeReleaseCycle} Horas`
  }
}

const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const { t } = useI18n();
const listStatus = ref(1);
const stockSkeleton = ref(false);
const stockList = ref<any>([]);
const tabList = ref([]);
const search = ref("")
const userProductArr = ref([])
const categoryId = ref();

// ========== 倒计时相关 ==========
let countdownTimer: ReturnType<typeof setInterval> | null = null;

/**
 * 每秒对列表中所有有倒计时的产品进行减1操作
 */
const startCountdown = () => {
  countdownTimer = setInterval(() => {
    stockList.value.forEach((item: any) => {
      if (item.soldOutCountdown != null && item.soldOutCountdown > 0) {
        item.soldOutCountdown--;
      }
    });
  }, 1000);
}

const hasCountdown = (item: any) => {
  return item.soldOutCountdown != null && item.soldOutCountdown > 0;
}

const isCountdownSoldOut = (item: any) => {
  // soldOutCountdown 存在且已经倒计时到0
  return item.soldOutCountdown != null && item.soldOutCountdown <= 0 && item._hasCountdown;
}

const getProductStatus = (item: any) => isCountdownSoldOut(item) ? 2 : item.status;

const formatCountdown = (item: any) => {
  const totalSeconds = Math.max(0, item.soldOutCountdown || 0);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const time = [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  return days > 0 ? `${days}d ${time}` : time;
}

/**
 * 标记产品是否有倒计时（用于区分"从未有倒计时"和"倒计时结束"）
 */
const markCountdownFlag = (rows: any[]) => {
  rows.forEach((item) => {
    item._hasCountdown = item.soldOutCountdown != null && item.soldOutCountdown > 0;
  });
  return rows;
}

// ========== 接口请求 ==========
const getUserProArr = async () => {
  try {
    const res = await userProductList({
      page: 1,
      pageSize: 10,
    })
  } catch (error) {
    console.log(error);
  }
}

const getTabList = async () => {
  const { data, code } = await productList({
    pageIndex: 1,
    pageSize: 3,
  });
  if (code == 200) {
    tabList.value = data.classList.map((e) => {
      return {
        name: e.class_name,
        id: e.class_id,
      }
    }) || []
  }
}

const getProductList = async () => {
  if (page.pageIndex == 1) {
    stockSkeleton.value = true;
  }

  const { data, code } = await productList({
    classId: tabList.value[activeName.value]?.id || null,
    ...page,
    productName: search.value || null
  });
  if (code == 200) {
    console.log(stockSkeleton.value);
    tabList.value = data.classList.map((e) => {
      return {
        name: e.class_name,
        id: e.class_id,
      }
    }) || []
    if (!data.rows) {
      listStatus.value = 3;
      stockSkeleton.value = false;
      return;
    }
    if (page.pageIndex == 1) {
      stockList.value = markCountdownFlag(data.rows || []);
    } else {
      let result = markCountdownFlag(data.rows || []);
      stockList.value = stockList.value.concat(result);
    }
    stockSkeleton.value = false;

    if (stockList.value.length >= data.total) {
      listStatus.value = 3;
      return;
    }
    listStatus.value = 2;
    stockSkeleton.value = false;
  }
};

const tabChange = (item: any) => {
  console.log(item, activeName.value)
  page.pageIndex = 1;
  stockList.value = [];
  listStatus.value = 1;
  getProductList();
};

const handleClickStock = (item: any) => {
  router.push(`/market/productDetail?productId=${item.productId}`);
};

function toSearch() {
  page.pageIndex = 1;
  getProductList();
}

const loadMore = () => {
  page.pageIndex++;
  getProductList();
};

onMounted(async () => {
  startCountdown();
  await getTabList();
  await getProductList();
});

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<template>
  <div class="market relative overflow-hidden pb-[120px] bg-[#f7f7f7] min-h-screen pt-[20px]">
    <!-- Top Tabs -->
    <div class="sticky top-0 z-50 flex  items-center px-16 gap-8 overflow-x-auto flex-wrap">
      <div
        class="tab-item  flex flex-1 text-nowrap  items-center justify-center text-center border text-14 border-[#E5E5E5] border-solid rounded-[16px] py-4 px-6 h-40"
        :class="activeName == index ? 'bg-[#CED0D8] text-[#222222] font-bold' : 'text-[#999999]'"
        v-for="(item, index) in tabList" :key="index" @click="activeName = index; getProductList()">{{ item.name
        }}
      </div>
    </div>

    <!-- Product Grid -->
    <div v-if="stockSkeleton" class="product-list grid grid-cols-1 gap-x-[15px] gap-y-[16px] px-[16px] mt-[20px]">
      <div v-for="n in 6" :key="n" class="product-item skeleton-animation">
        <div
          class="img-box relative w-full aspect-square bg-[#F5F5F5] rounded-[20px] mb-[12px] flex items-center justify-center overflow-hidden h-[160px]">
          <div class="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        </div>
      </div>
    </div>

    <div v-else v-for="(item, index) in stockList" :key="index"
      class="mx-[16px] my-16 product-item product-item  bg-[#fff] px-[8px] py-[14px] rounded-[20px] relative"
      @click="handleClickStock(item)">
      <div class="tag px-4 h-13 bg-[#FF64641A] text-[9px] color-[#FF6464] absolute right-0 top-0" v-if="item.promote">
        {{ item.promote }}
      </div>
      <div class="top flex gap-[8px] pb-[13px] border-b-solid border-b-[1px] border-b-[#F5F5F5]">
        <div class="img w-68 h-68 flex-shrink-0 bg-[#555] rounded-[20px] overflow-hidden">
          <img v-if="item.productImage" :src="item.productImage" class="w-full h-full object-cover" />
        </div>
        <div class="info w-full">
          <div class="flex items-start justify-between gap-[8px]">
            <div class="title font-bold text-[14px] color-[#161616] flex-1">
              {{ item.productName || 'Product Name' }}
            </div>
            <div v-if="hasCountdown(item)" class="countdown text-[14px] color-[#FF6464] font-bold flex-shrink-0">
              {{ formatCountdown(item) }}
            </div>
          </div>
          <div class="desc text-[12px] color-[#8C91A2] font-normal">{{ item.levelLimit?'Lv '+ item.levelLimit +' e superior' : 'Lv 1  e superior' }}</div>
          <div class="flex justify-between items-end">
            <div class="price color-[#FF6464] font-[14px] font-bold flex flex-col">
               <div class="originalPrice text-[12px] line-through color-[#8C91A2]" v-if="item.originalPrice && item.originalPrice != item.discountPrice">
              R$  {{ addCommasToNumber(item.originalPrice) || '0.00' }}
            </div>
              R$ {{ addCommasToNumber(item.discountPrice) ||
              '0.00' }}</div>
            <div class="button text-[14px] font-bold text-[#fff]  px-[12px] py-[6px] rounded-[8px]"
              :class="getProductStatus(item) == 2 ? 'bg-[#CED0D8]' : 'bg-[#161616]'" @click="handleClickStock(item)">
              {{ t(enumBtnText[getProductStatus(item)]) }}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom flex pt-[13px]">
        <div class="item flex-1">
          <div class="label mb-4">Ciclo</div>
          <div class="value text-left">{{ item.incomeCycle || '0' }}</div>
        </div>
        <div class="item flex-1">
          <div class="label text-center mb-4">{{ renderLabel(item.productType, item.incomeReleaseCycle) }}</div>
          <div class="value text-center">R$ {{ addCommasToNumber(item.dailyIncome) || '0.00' }}</div>
        </div>
        <div class="item flex-1">
          <div class="label text-right mb-4">{{ t('Total Revenue') }}</div>
          <div class="value text-right">R$ {{ addCommasToNumber(item.totalIncome) || '0.00' }}</div>
        </div>
      </div>
    </div>
    <div class="list px-[20px] flex flex-col gap-[20px]">
    </div>

    <!-- Empty State -->
    <empty v-if="stockList && stockList.length == 0" :no-tips="true"></empty>
    <LoadMore :status="listStatus" @load-more="loadMore" />
  </div>
</template>

<route lang="json5">
{
  name: 'Market',
  meta: {
    title: 'Market',
    i18n: 'Product Center'
  },
}
</route>

<style lang="less" scoped>
.quotes {
  padding-bottom: calc(var(--van-tabbar-height) + 2px);
}

:deep(.van-tabs__wrap) {
  height: 44px;
}

:deep(.van-tab) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.van-tabs__line) {
  background: #333;
  height: 1px;
}

.skeleton-animation {
  animation: pulseskeleton 1s ease-in infinite;
}

@keyframes pulseskeleton {
  0% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.7;
  }
}

.label {
  font-family: Space Grotesk;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
}

.value {
  font-family: Space Grotesk;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;
}

.phone-input {
  border: 1px solid #F0F0F0;
  border-radius: 12px;
  background: #0000000D;

  :deep(.input-box) {
    height: 39px;
    margin-top: 0px;

    input {
      background: transparent;
    }
  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}

.sendCode {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #868c9a;
  color: #fff;
  background: #424242;
}

.tag {
  border-radius: 0 4px 0 4px;
}
</style>