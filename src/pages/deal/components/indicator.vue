<script setup>
import ipo from '../../ipo/index.vue'
import discount from '../../discount/index.vue'
import fund from '../../fund/index.vue'
import dividend from '../../dividend/index.vue'
import { addCommasToNumber } from '@/utils/tool'
import { useUserStore } from '@/stores'
import { assetsLogsGrid, getPosition, swapOrderAdd, swapOrderCancel, orderList as swapOrderList } from '@/api/swap'
import { useStore } from "@/stores/modules/index";
import { getCategoryPosition } from '@/api/market'
import { useI18n } from 'vue-i18n'
import EntrustItem from '@/pages/quotes/component/openTradeCom/EntrustItem.vue'

const props = defineProps({
  activeName: {
    type: String,
  },
})
const { t } = useI18n()
const orderLoadStatus = ref(0)
const userStore = useUserStore()
const assetsData = computed(() => userStore.userInfo.assetsData)

const userInfo = computed(() => userStore.userInfo)
const tabList = ref([
  {
    label: '折扣股',
    objKey: 'discountAssetsData',
    i18n: 'deal.discount',
    value: '2',
  },
  {
    label: '基金',
    objKey: 'fundAssetsData',
    i18n: 'deal.fund',

    value: '3',
  },
  {
    label: '股息',
    // objKey: 'dividendAssetsData',
    objKey: 'discountFundData',
    i18n: 'deal.dividend',

    value: '4',
  },
  {
    label: 'IPO',
    value: '1',
    objKey: 'ipoAssetsData',
    i18n: 'deal.IPO',

  },
  {
    label: '股票',
    i18n: 'Stocks',
    value: '1',
    // objKey: 'ipoAssetsData',
    objKey: 'assetsData',
  },
],
)

const activeIndex = ref(0)

function getUserInfoByObjKey(value) {
  for (const key in assetsData.value) {
    if (key == value) {
      return assetsData.value[key]
    }
  }
}

function changeTab(index) {
  // userStore.getAssetsData()

  if (index == 4) {
    getCategoryPositionData()
  }
  activeIndex.value = index
}

const page = reactive({
  pageIndex: 1,
  pageSize: 10,
})
const orderList = ref([])
const categoryPositionData = ref([])
async function getCategoryPositionData(params = {}) {
  const { data, code } = await getCategoryPosition({
    categoryId: props.activeName == '1' ? '200' : '201',
  })
  if (code === 200) {
    categoryPositionData.value = data || []
  }
}
const store = useStore();
watch(() => props.activeName, (newV) => {
  if (newV && activeIndex.value == 4) {
    getCategoryPositionData()
  }
})
watch(
  () => store.getklineList,
  (newV) => {
    if (newV && categoryPositionData.value && categoryPositionData.value.length) {
      categoryPositionData.value.forEach((e) => {
        let listItem = newV.find(
          (item) => item.tradingId == e.tradingPairsId
        );
        if (listItem) {
          e.close = listItem.tick.close;
        }
      })

    }
  }
);
async function getOrderList(params = {}) {
  orderLoadStatus.value = 1
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
    categoryId: props.activeName == '1' ? '200' : '201',
  })
  if (code == 200) {
    // showToast('购入成功')
    if (!data.rows) {
      if (page.pageIndex == 1) {
        orderList.value = []
      }
      orderLoadStatus.value = 3
      return
    }
    if (page.pageIndex == 1) {
      orderList.value = data.rows || []
    }
    else {
      orderList.value = [...orderList.value, ...(data.rows || [])]
    }
    if (data.total <= orderList.value.length) {
      orderLoadStatus.value = 3
      return
    }
    orderLoadStatus.value = 2
  }
}
function cancelOrder(val) {
  let params = {
    id: val.id,
  }
  swapOrderCancel(params).then((res) => {
    if (res.code == 200) {
      showToast(t('Order canceled successfully'))
      orderList.value = []

      if (val.type == 'status1') {
        getOrderListStatus0(params)
        return
      }
      getOrderList(params)
    }
  })
}
const showPicker = ref(false)
const amount = ref('')
const stockInfo = ref({})
async function handleClickSubmit(item) {
  amount.value = ''
  showPicker.value = true
  stockInfo.value = item
}
function confirm() {
  swapOrderAdd({
    tradingPairsId: stockInfo.value.tradingPairsId,
    direction: 'sell',
    amount: Number(amount.value),
    type: 1,
  }).then(({ data, code }) => {
    if (code === 200) {

      const toastText = 'Sell Success'
      showToast(t(toastText))
      setTimeout(() => {
        showPicker.value = false
        getCategoryPositionData()
      }, 500)
    }
  })
}

</script>

<template>
  <div class="indicator-content pb-12px">
    <div class="tab-box flex gap-4 px-12 py-12">
      <div v-for="(item, index) in tabList" :key="index"
        class="tab-item flex flex-1 items-center justify-center rounded-4 text-align-center line-height-24"
        :class="{ active: index === activeIndex }" @click="changeTab(index)">
        <span>{{ t(item.i18n) }}</span>
      </div>
    </div>

    <div v-if="userInfo && userInfo[tabList[activeIndex].objKey] && activeIndex !== 4" class="asset px-12 font-size-12">
      <div class="line flex">
        <div class="line-item flex-1 text-align-left">
          <p class="title">
            {{ t('deal.totalAmount') }}
          </p>
          <p v-show="activeName == '1'" class="content">
            {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalAmountUsd }}
          </p>
          <p v-show="activeName == '2'" class="content">
            {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalAmountBrl }}
          </p>
        </div>
        <div class="line-item flex-1 text-align-center">
          <p class="title">
            {{ t('deal.totalProfit') }}
          </p>
          <p v-show="activeName == '1'" class="content"
            :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitUsd >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitUsd < 0 }">
            {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalProfitUsd }}
          </p>
          <p v-show="activeName == '2'" class="content"
            :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitBrl >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitBrl < 0 }">
            {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalProfitBrl }}
          </p>
        </div>
        <div class="line-item flex-1 text-align-right">
          <p class="title">
            {{ t('deal.totalProfitRate') }}
          </p>
          <p v-if="activeName == '1'" class="content"
            :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitRateUsd >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitRateUsd < 0 }">
            {{ userInfo[tabList[activeIndex].objKey].totalProfitRateUsd }} %
          </p>
          <p v-if="activeName == '2'" class="content"
            :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitRateBrl >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitRateBrl < 0 }">
            {{ userInfo[tabList[activeIndex].objKey].totalProfitRateBrl }} %
          </p>
        </div>
      </div>
      <div class="line flex" />
    </div>
    <div class="divdiver" />
    <div v-if="activeIndex === 0" class="indicator-td flex">
      <discount :only-show-order="true" :category-id="activeName == '1' ? '200' : '201'" />
    </div>
    <div v-if="activeIndex === 1" class="indicator-td flex">
      <fund :only-show-order="true" />
    </div>
    <div v-if="activeIndex === 2" class="indicator-td flex">
      <dividend :only-show-order="true" :category-id="activeName == '1' ? '200' : '201'" />
    </div>
    <div v-if="activeIndex === 3" class="indicator-td flex">
      <ipo :only-show-order="true" />
    </div>
    <div v-if="activeIndex === 4" class="indicator-td flex flex-col px-12">
      <div v-for="(item, index) in categoryPositionData" :key="index" class="w-full flex flex-col gap-12px p-12">
        <div class="li flex items-center justify-between">
          <div class="left label">
            {{ t('Stock name') }}
          </div>
          <div class="right flex flex-shrink-0 items-center gap-12px text-align-left">
            <img :src="item.symbolLogo" alt="" class="block h-20 w-20 rounded-full"> {{ item.symbol }}
          </div>
        </div>
        <div class="li flex items-center justify-between">
          <div class="left label">
            {{ t('Current price') }}
          </div>
          <div class="right flex flex-shrink-0 items-center gap-12px text-align-left">
            {{ item.currency }} {{ item.close }}
          </div>
        </div>
        <div class="li flex items-center justify-between">
          <div class="left label">
            {{ t('Holding quantity') }}
          </div>
          <div class="right flex flex-shrink-0 items-center gap-12px text-align-left">
            {{ item.userAssetsAmount }}
          </div>
        </div>
        <div class="li flex items-center justify-between">
          <div class="left label">
            {{ t('Total price') }}
          </div>
          <div class="right flex flex-shrink-0 items-center gap-12px text-align-left">
            {{ item.currency }} {{ addCommasToNumber(item.close * item.userAssetsAmount) }}
          </div>
        </div>
        <div class="btn-box w-full flex justify-end">
          <van-button size="small" class="font-size-14!" @click="handleClickSubmit(item)">
            {{ t('Sell') }}
          </van-button>
        </div>
        <div class="divdiver" />
      </div>
      <empty v-if="categoryPositionData && categoryPositionData.length === 0" />
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
              {{
                t('confirm')
              }}
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
    }

    .active {
      background: var(--btn-bg);
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
