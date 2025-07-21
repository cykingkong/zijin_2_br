<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  discountList,
  discountOrderBuy,
  discountOrderList,
  discountOrderSell,
} from '@/api/bond'
import discontItem from './component/discont-item.vue'
import bottomPop from './component/bottom-pop.vue'
import LoadMore from '@/components/LoadMore.vue'
import { allowMultipleToast, showToast } from 'vant'

import { useLoadingStore } from '@/stores/modules/loading'
import { useStore } from '@/stores/modules/index'

const props = defineProps({
  onlyShowOrder: {
    type: Boolean,
    default: false,
  },

  categoryId: {
    type: String,
    default: '',
  },
})
const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()
const categoryId = ref<any>()
const orderList = ref([])

const active = ref(0)
const list = ref([])
const popType = ref('buy') // buy:购买  sell:出售
const skeleton = ref(false)
const page = reactive({
  pageIndex: 1,
  pageSize: 4,
})
const activeItem = ref({})
const listStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
function resetPage() {
  page.pageIndex = 1
}
const router = useRouter()
function onBack() {
  if (window.history.state.back)
    history.back()
  else router.replace('/')
}
const { t } = useI18n()
const bottomPopRef = ref()
async function getDisountList() {
  // resetPage()
  listStatus.value = 1
  discountList({
    ...page,
    categoryId: categoryId.value,
    isDividend: 1,
  }).then((res) => {
    if (!res.data.rows) {
      listStatus.value = 3
      skeleton.value = false

      return
    }
    if (page.pageIndex == 1) {
      list.value
        = res.data.rows.map((e) => {
          return {
            ...e,
            percentage: (
              ((e.totalQuantity - e.availableQuantity) / e.totalQuantity)
              * 100
            ).toFixed(2),
          }
        }) || []
    }
    else {
      let result = res.data.rows.map((e) => {
        return {
          ...e,
          percentage: (
            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity)
            * 100
          ).toFixed(2),
        }
      })
      list.value = list.value.concat(result)
    }
    if (res.data.total <= list.value.length) {
      listStatus.value = 3
      skeleton.value = false
      return
    }
    // list.value = res.data.rows.map((e) => {
    //     return {
    //         ...e,
    //         percentage: (
    //             ((e.totalQuantity - e.availableQuantity) /
    //                 e.totalQuantity) *
    //             100
    //         ).toFixed(2)
    //     }
    // }) || []
    skeleton.value = false
    listStatus.value = 2
  })
}
async function getOrderList() {
  orderLoadStatus.value = 1
  skeleton.value = true
  discountOrderList({
    isDividend: 1,
    categoryId: categoryId.value,
    ...page,
  }).then((res) => {
    if (!res.data.rows) {
      console.log(123)
      orderLoadStatus.value = 3
      skeleton.value = false
      return
    }
    if (page.pageIndex == 1) {
      orderList.value
        = res.data.rows.map((e) => {
          if (e.status == 3) {
            return {
              ...e,
              percentage: (
                ((e.totalQuantity - e.availableQuantity) / e.totalQuantity)
                * 100
              ).toFixed(2),
              //  discountPrice 购买价格  purchasePrice 市场价
              giftDividend:
                (
                  e.discountPrice
                  * e.purchaseQuantity
                  * (e.dividendInfo.totalYield / 100)
                ).toFixed(2) || 0, //  赠送股息金额
              earnings:
                (
                  (e.freezePrice - e.discountPrice)
                  * e.purchaseQuantity
                ).toFixed(2) || 0, // 收益，
              earningRate: (
                ((e.freezePrice - e.discountPrice) / e.freezePrice)
                * 100
              ).toFixed(2),
            }
          }
          return {
            ...e,
            percentage: (
              ((e.totalQuantity - e.availableQuantity) / e.totalQuantity)
              * 100
            ).toFixed(2),
            //  discountPrice 购买价格  purchasePrice 市场价
            giftDividend:
              (
                e.discountPrice
                * e.purchaseQuantity
                * (e.dividendInfo.totalYield / 100)
              ).toFixed(2) || 0, //  赠送股息金额
            earnings:
              (
                (e.close - e.discountPrice)
                * e.purchaseQuantity
              ).toFixed(2) || 0, // 收益，
            earningRate: (
              ((e.close - e.discountPrice) / e.close)
              * 100
            ).toFixed(2),
          }
        }) || []
    }
    else {
      let result = res.data.rows.map((e) => {
        console.log(
          e.discountPrice * e.purchaseQuantity * e.dividendInfo.totalYield,
          'e.discountPrice * e.purchaseQuantity * e.dividendInfo.totalYield',
        )
        if (e.status == 3) {
          return {
            ...e,
            percentage: (
              ((e.totalQuantity - e.availableQuantity) / e.totalQuantity)
              * 100
            ).toFixed(2),
            //  discountPrice 购买价格  purchasePrice 市场价
            giftDividend:
              (
                e.discountPrice
                * e.purchaseQuantity
                * (e.dividendInfo.totalYield / 100)
              ).toFixed(2) || 0, //  赠送股息金额
            earnings:
              (
                (e.freezePrice - e.discountPrice)
                * e.purchaseQuantity
              ).toFixed(2) || 0, // 收益，
            earningRate: (
              ((e.freezePrice - e.discountPrice) / e.freezePrice)
              * 100
            ).toFixed(2),
          }
        }
        return {
          ...e,
          percentage: (
            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity)
            * 100
          ).toFixed(2),
          giftDividend:
            (
              e.discountPrice
              * e.purchaseQuantity
              * (e.dividendInfo.totalYield / 100)
            ).toFixed(2) || 0, //  赠送股息金额
          earnings:
            ((e.close - e.discountPrice) * e.purchaseQuantity).toFixed(
              2,
            ) || 0, // 收益，
          earningRate: (
            ((e.close - e.discountPrice) / e.close)
            * 100
          ).toFixed(2),
        }
      })
      orderList.value = orderList.value.concat(result)
    }
    if (res.data.total <= orderList.value.length) {
      orderLoadStatus.value = 3
      skeleton.value = false
      return
    }
    skeleton.value = false
    orderLoadStatus.value = 2
  })
}
async function reloadOrderList(val) {
  console.log('123123', val)
  await resetPage()
  await getOrderList()
}
const store = useStore()
watch(
  () => props.categoryId,
  (newV) => {
    if (newV && categoryId.value != newV && categoryId.value != '') {
      categoryId.value = newV
      orderList.value = []
      getOrderList()
      return
    }
    categoryId.value = newV
  },
  {
    immediate: true,
  },
)
watch(
  () => store.getklineList,
  (newV) => {
    if (newV && list.value.length) {
      list.value.forEach((el) => {
        let listItem = newV.find((item: any) => {
          return item.tradingId == el.tradingPairsId
        })
        console.log(listItem, 'listItem')
        if (listItem) {
          if (listItem.tradingId == el.tradingPairsId) {
            el.close = listItem.tick.close
            el.discountPrice
              = (el.close * (el.discountRate / 100)).toFixed(2) || 0 // 优惠价格
          }
        }
      })
    }
    if (newV && orderList.value.length) {
      orderList.value.forEach((el) => {
        let listItem = newV.find(item => item.tradingId == el.tradingPairsId)
        if (listItem) {
          if (listItem.tradingId == el.tradingPairsId && el.status != 3) {
            /**
             * (市场价-购买价)/市场价 = 收益率
             * (市场价-购买价)*数量 = 收益
             *  购买价格 * 数量 * 赠送比例 = 赠送股息金额
             */
            el.close = listItem.tick.close
            // el.discountPrice =
            //   (el.close * (el.discountRate / 100)).toFixed(2) || 0; // 优惠价格
            el.giftDividend
              = (
                el.discountPrice
                * el.purchaseQuantity
                * (el.dividendInfo.totalYield / 100)
              ).toFixed(2) || 0 //  赠送股息金额
            el.earnings
              = ((el.close - el.discountPrice) * el.purchaseQuantity).toFixed(
                2,
              ) || 0 // 收益，
            el.earningRate = (
              ((el.close - el.discountPrice) / el.close)
              * 100
            ).toFixed(2) // 收益率
          }
        }
      })
    }
  },
)
function changeActive(val: any) {
  resetPage()
  skeleton.value = true
  if (val) {
    orderList.value = []
    getOrderList()
  }
  else {
    list.value = []
    getDisountList()
  }
}
function loadMore() {
  // 确保每次点击都递增页码
  page.pageIndex += 1
  if (props.onlyShowOrder) {
    getOrderList()
  }
  else {
    active.value === 0 ? getDisountList() : getOrderList()
  }
}
function handleClickBtn(val: any) {
  activeItem.value = val.item
  popType.value = val.itemType
  bottomPopRef.value.show(true)
}
async function onConfirmOriginal(val: any) {
  console.log(val)
  try {
    if (val.type == 'discount') {
      const { data, code } = await discountOrderBuy({
        ...val,
      })
      if (code == 200) {
        console.log(data)
        bottomPopRef.value.show(false)

        showToast({
          message: t('Order placed successfully'),
          onClose: () => {
            active.value = 1
            changeActive(1)
          },
        })
        // resetPage();
        // getDisountList();
      }
    }
    else {
      const { data, code } = await discountOrderSell({
        id: val.id,
      })
      if (code == 200) {
        console.log(data)
        bottomPopRef.value.show(false)
        showToast({
          message: t('Sold successfully'),
          onClose: () => {
            resetPage()
            getOrderList()
          },
        })
      }
    }
  }
  catch (error) { }
}
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
})
const route = useRoute()

onMounted(() => {
  if (route.query.categoryId) {
    categoryId.value = route.query.categoryId
  }
  if (props.onlyShowOrder) {
    getOrderList()
  }
  else {
    getDisountList()
  }
  allowMultipleToast()
  route.meta.title = '股息' // 设置你需要的标题
})
</script>

<template>
  <div class="discont-content w-full px-12">
    <VanNavBar v-if="!onlyShowOrder" title="" :fixed="true" placeholder clickable :left-arrow="true" z-index="999"
      @click-left="onBack">
      <template #title>
        <div class="flex gap-6 flex-items-center">
          {{ t("dividend") }}
        </div>
      </template>
    </VanNavBar>
    <template v-if="!onlyShowOrder">
      <van-tabs v-model:active="active" @change="changeActive">
        <!-- 折扣股玩法 -->
        <van-tab :title="t('dividend list')">
          <div class="discont-list flex flex-col pb-40">
            <discont-item v-for="(item, index) in list" :key="index" :item="item" @handle-click-btn="handleClickBtn" />
            <div v-for="i in 5" v-show="skeleton && list.length == 0" :key="i"
              class="1 skeleton skeleton-animation mt-12 h-170 w-full rounded-10px bg-coolgray" />
            <empty v-if="list.length == 0 && !skeleton" :no-tips="true" />
            <LoadMore :status="listStatus" @load-more="loadMore" />
          </div>
        </van-tab>
        <van-tab :title="t('Order List')">
          <div class="discont-list flex flex-col pb-40">
            <discont-item v-for="(item, index) in orderList" :key="index" :item="item" :index="item.tradingPairsId"
              item-type="order" @handle-click-btn="handleClickBtn" @reload-order-list="reloadOrderList" />
            <div v-for="i in 5" v-show="skeleton && orderList.length == 0" :key="i"
              class="2 skeleton skeleton-animation mt-12 h-170 w-full rounded-10px bg-coolgray" />
            <empty v-if="orderList.length == 0 && !skeleton" :no-tips="true" />
            <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
          </div>
        </van-tab>
      </van-tabs>
    </template>
    <template v-else>
      <div class="discont-list flex flex-col pb-40">
        <discont-item v-for="(item, index) in orderList" :key="index" :item="item" item-type="order"
          @handle-click-btn="handleClickBtn" @reload-order-list="reloadOrderList" />
        <div v-if="skeleton && orderList.length == 0" class="skeleton-box">
          <div v-for="i in 5" :key="i"
            class="3 skeleton skeleton-animation mt-12 h-170 w-full rounded-10px bg-coolgray" />
        </div>
        <empty v-if="orderList.length == 0 && !skeleton" :no-tips="true" />
        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
      </div>
    </template>
    <bottom-pop ref="bottomPopRef" :item="activeItem" :active="list[active]" :pop-type="popType"
      @on-confirm="onConfirm" />
  </div>
</template>

<route lang="json5">
    {
      name: 'dividend',
      meta: {
        title: '股息',
        i18n:"dividend"
      },
    }
</route>

<style lang="less" scoped>
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
</style>
