<template>
  <!-- <VanNavBar :title="'身上'" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack" /> -->
  <div class="discont-content px-12 w-full">
    <template v-if="!onlyShowOrder">
      <van-tabs v-model:active="active" @change="changeActive">
        <van-tab :title="t('IPO List')">
          <div class="discont-list flex flex-col">
            <discont-item :item="item" v-for="(item, index) in list" :key="index"
              @handleClickBtn="handleClickBtn"></discont-item>

            <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
              v-show="skeleton && list.length == 0" v-for="i in 5" :key="i"></div>
            <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>

            <LoadMore :status="listStatus" @load-more="loadMore" />
          </div>
        </van-tab>
        <van-tab :title="t('IPO Order List')">
          <div class="discont-list flex flex-col pb-40">
            <discont-item :item="item" v-for="(item, index) in orderList" :key="index" @handleClickBtn="handleClickBtn"
              :item-type="'order'" @reloadList="getOrderList" />
            <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
              v-show="skeleton && orderList.length == 0" v-for="i in 5" :key="i"></div>
            <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>

            <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
          </div>
        </van-tab>
      </van-tabs>
    </template>
    <template v-else>
      <div class="discont-list flex flex-col pb-40">
        <discont-item :item="item" v-for="(item, index) in orderList" :key="index" @handleClickBtn="handleClickBtn"
          :item-type="'order'" @reloadList="getOrderList" />
        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
          v-show="skeleton && orderList.length == 0" v-for="i in 5" :key="i"></div>
        <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>
        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />

      </div>
    </template>

    <bottom-pop ref="bottomPopRef" @onConfirm="onConfirm" :item="activeItem" :active="list[active]"
      :popType="popType"></bottom-pop>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  ipoProductList,
  ipoOrderList,
  orderFullSubscribe,
  orderSubscribe,
  orderPay,
  ipoOrderSell,
} from "@/api/ipo";
import discontItem from "./component/discont-item.vue";
import LoadMore from "@/components/LoadMore.vue";
import bottomPop from "./component/bottom-pop.vue";
import { useLoadingStore } from "@/stores/modules/loading";
import { navTitleStore } from "@/stores/index";
import { showToast, showSuccessToast, allowMultipleToast } from "vant";

import { isLogin } from "@/utils/auth";
const { t } = useI18n();
const route = useRoute();
const navStore = navTitleStore();
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance();
const props = defineProps({
  onlyShowOrder: {
    type: Boolean,
    default: false,
  },
});

import dayjs from "dayjs";
const active = ref(0);
const list = ref([]);
const orderList = ref([]);
const popType = ref("buy"); // buy:购买  sell:出售
const skeleton = ref(false);
const router = useRouter();
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const activeItem = ref({});
const listStatus = ref(1); // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1); // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
  page.pageIndex = 1;
};
// watch(() => isLogin(), (val) => {
//     if (!val) {
//         router.push('/login')
//     }
// }, {
//     immediate: true
// })
const bottomPopRef = ref();
const getDisountList = async () => {
  skeleton.value = true;
  // resetPage()
  listStatus.value = 1;
  ipoProductList({
    ...page,
  }).then((res) => {
    if (!res.data.rows) {
      listStatus.value = 3;
      skeleton.value = false;
      return;
    }
    if (page.pageIndex == 1) {
      list.value =
        res.data.rows.map((e) => {
          return {
            ...e,
            percentage: (
              ((e.totalNum - e.subscribedNum) / e.totalNum) *
              100
            ) < 0 ? 0 : (
              ((e.totalNum - e.subscribedNum) / e.totalNum) *
              100
            ),
            formatSubTimeBegin: dayjs(e.subTimeBegin).format("DD/MM/YYYY "),
            formatSubTimeEnd: dayjs(e.subTimeEnd).format("DD/MM/YYYY "),
            formatWonTimeBegin: dayjs(e.wonTimeBegin).format("DD/MM/YYYY "),
            formatWonTimeEnd: dayjs(e.wonTimeEnd).format("DD/MM/YYYY "),
            formatMarketTime: dayjs(e.marketTime).format("DD/MM/YYYY "),
          };
        }) || [];
    } else {
      list.value = [
        ...list.value,
        ...(res.data.rows.map((e) => {
          return {
            ...e,
            percentage: (
              ((e.totalNum - e.subscribedNum) / e.totalNum) *
              100
            ).toFixed(2),
            formatSubTimeBegin: dayjs(e.subTimeBegin).format("DD/MM/YYYY "),
            formatSubTimeEnd: dayjs(e.subTimeEnd).format("DD/MM/YYYY "),
            formatWonTimeBegin: dayjs(e.wonTimeBegin).format("DD/MM/YYYY "),
            formatWonTimeEnd: dayjs(e.wonTimeEnd).format("DD/MM/YYYY "),
            formatMarketTime: dayjs(e.marketTime).format("DD/MM/YYYY "),
          };
        }) || []),
      ];
    }

    if (res.data.total <= list.value.length) {
      listStatus.value = 3;
      skeleton.value = false;
      return;
    }
    skeleton.value = false;
    listStatus.value = 2;
  }).catch((err) => {
    skeleton.value = false;
  });;
};
const getOrderList = async () => {
  skeleton.value = true;
  orderLoadStatus.value = 1;
  // resetPage()
  ipoOrderList({
    ...page,
  }).then((res) => {
    if (!res.data.rows) {
      orderLoadStatus.value = 3;
      skeleton.value = false;
      return;
    }
    if (page.pageIndex == 1) {
      orderList.value =
        res.data.rows.map((e) => {
          return {
            ...e,
            percentage: (
              ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) *
              100
            ).toFixed(2),
          };
        }) || [];
    } else {
      orderList.value = [
        ...orderList.value,
        ...(res.data.rows.map((e) => {
          return {
            ...e,
            percentage: (
              ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) *
              100
            ).toFixed(2),
          };
        }) || []),
      ];
    }
    if (res.data.total <= orderList.value.length) {
      orderLoadStatus.value = 3;
      skeleton.value = false;
      return;
    }
    skeleton.value = false;
    orderLoadStatus.value = 2;
  }).catch((err) => {
    skeleton.value = false;
  });
};
const loadMore = () => {
  page.pageIndex++;
  if (active.value == 0) {
    getDisountList();
  } else {
    getOrderList();
  }
};
const changeActive = (val: any) => {
  skeleton.value = true;
  resetPage();
  if (val) {
    getOrderList();
  } else {
    getDisountList();
  }
};

const handleClickBtn = (val: any) => {
  activeItem.value = val.item;
  popType.value = val.itemType;
  bottomPopRef.value.show(true);
};
const onConfirmOriginal = async (val: any) => {
  try {
    if (val.type == "ipo") {
      if (val.full) {
        // 全量
        const { data, code } = await orderFullSubscribe({
          ipoId: val.ipoId,
        });
        if (code == 200) {
          bottomPopRef.value.show(false);
          active.value = 1;
          changeActive(1)
          // getDisountList();
        }
        return;
      }
      const { data, code } = await orderSubscribe({
        ipoId: val.ipoId,
        number: val.number,
      });
      if (code == 200) {
        bottomPopRef.value.show(false);
        active.value = 1;
        changeActive(1)
        // getDisountList();
      }
      return;
    }
    //         getDisountList()
    //     }
    else {
      const { data, code } = await ipoOrderSell({
        id: val.ipoId,
      });
      if (code == 200) {
        bottomPopRef.value.show(false);
        showToast({
          message: t("Sold successfully"), onClose: () => {
            resetPage()
            getOrderList();
          }
        });
      }
    }
  } catch (error) { }
};
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});

onMounted(() => {
  if (props.onlyShowOrder) {
    getOrderList();
  } else {
    getDisountList();
  }
  allowMultipleToast()
  navStore.setNavTitle("IPO");
  route.meta.title = "IPO"; // 设置你需要的标题
});
onUnmounted(() => {
  navStore.setNavTitle("");
});
</script>
<route lang="json5">
    {
      name: 'IPO',
      meta: {
        title: 'IPO',
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

.discont-list {
  padding-bottom: var(--van-tabbar-height);
}
</style>
