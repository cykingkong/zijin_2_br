<template>
  <!-- <VanNavBar :title="'身上'" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack" /> -->
  <div class="discont-content px-24 w-full">
    <template v-if="!onlyShowOrder">
      <!-- 自定义Tab组件 -->
      <div class="custom-tabs">
        <div class="tab-container">
          <div class="tab-item" :class="{ active: active === 0 }" @click="changeActive(0)">
            <svg class="w-17 h-16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.25 2.6665H3.58333C3.21514 2.6665 2.91666 2.96498 2.91666 3.33317V5.99984C2.91666 6.36803 3.21514 6.6665 3.58333 6.6665H6.25C6.61819 6.6665 6.91666 6.36803 6.91666 5.99984V3.33317C6.91666 2.96498 6.61819 2.6665 6.25 2.6665Z"
                :stroke="active === 0 ? '#0F172A' : '#94A3B8'" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12.9167 2.6665H10.25C9.88181 2.6665 9.58333 2.96498 9.58333 3.33317V5.99984C9.58333 6.36803 9.88181 6.6665 10.25 6.6665H12.9167C13.2849 6.6665 13.5833 6.36803 13.5833 5.99984V3.33317C13.5833 2.96498 13.2849 2.6665 12.9167 2.6665Z"
                :stroke="active === 0 ? '#0F172A' : '#94A3B8'" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M6.25 9.33301H3.58333C3.21514 9.33301 2.91666 9.63148 2.91666 9.99967V12.6663C2.91666 13.0345 3.21514 13.333 3.58333 13.333H6.25C6.61819 13.333 6.91666 13.0345 6.91666 12.6663V9.99967C6.91666 9.63148 6.61819 9.33301 6.25 9.33301Z"
                :stroke="active === 0 ? '#0F172A' : '#94A3B8'" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12.9167 9.33301H10.25C9.88181 9.33301 9.58333 9.63148 9.58333 9.99967V12.6663C9.58333 13.0345 9.88181 13.333 10.25 13.333H12.9167C13.2849 13.333 13.5833 13.0345 13.5833 12.6663V9.99967C13.5833 9.63148 13.2849 9.33301 12.9167 9.33301Z"
                :stroke="active === 0 ? '#0F172A' : '#94A3B8'" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="tab-text">{{ t("DiscountList") }}</span>
          </div>
          <div class="tab-item" :class="{ active: active === 1 }" @click="changeActive(1)">
            <svg class="w-17 h-16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.75 11.3332L6.75 7.33317L9.41667 9.99984L14.75 4.6665"
                :stroke="active === 1 ? '#0F172A' : '#94A3B8'" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M10.0833 4.6665H14.75V9.33317" :stroke="active === 1 ? '#0F172A' : '#94A3B8'"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <span class="tab-text">{{ t("OrderList") }}</span>
          </div>
        </div>
        <!-- Tab内容 -->
        <div v-if="active === 0" class="tab-content">
          <discont-item :item="item" v-for="(item, index) in list" :key="index"
            @handleClickBtn="handleClickBtn"></discont-item>

          <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
            v-show="skeleton && list.length == 0" v-for="i in 5" :key="i"></div>
          <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>

          <LoadMore :status="listStatus" @load-more="loadMore" />
        </div>
        <!-- Tab内容 -->
        <div v-if="active === 1" class="tab-content">
          <discont-item :item="item" v-for="(item, index) in orderList" :key="index" @handleClickBtn="handleClickBtn"
            :item-type="'order'" @reloadList="getOrderList" />
          <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
            v-show="skeleton && orderList.length == 0" v-for="i in 5" :key="i"></div>
          <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>

          <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
        </div>

      </div>
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
  page: 1,
  pageSize: 10,
});
const activeItem = ref({});
const listStatus = ref(3); // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(3); // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
  page.page = 1;
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
    if (page.page == 1) {
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
    if (page.page == 1) {
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
  page.page++;
  if (active.value == 0) {
    getDisountList();
  } else {
    getOrderList();
  }
};
const changeActive = (val: any) => {
  active.value = val;

  // skeleton.value = true;
  resetPage();
  if (val) {
    orderList.value = [];
    // getOrderList();
  } else {
    list.value = [];
    // getDisountList();
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
  // if (props.onlyShowOrder) {
  //   getOrderList();
  // } else {
  //   getDisountList();
  // }
  // allowMultipleToast()
  // navStore.setNavTitle("IPO");
  // route.meta.title = "IPO"; // 设置你需要的标题
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

// 自定义Tab样式
.custom-tabs {
  .tab-container {
    display: flex;
    background: #f8f9fd;
    border-radius: 8px;
    padding: 4px;
    margin: 16px 0;
    gap: 4px;
  }

  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
    color: #94a3b8;

    .tab-icon {
      width: 16px;
      height: 16px;
    }

    .tab-text {
      font-size: 14px;
      font-weight: 500;
    }

    &:hover {
      background: rgba(107, 57, 244, 0.1);
    }

    &.active {
      background: white;
      color: #1f2937;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
  }

  .tab-content {
    margin-top: 16px;
  }
}
</style>
