<template>
  <div class="discont-content px-24 w-full">
    <template v-if="!onlyShowOrder">
      <!-- 自定义Tab组件 -->
      <div class="custom-tabs">
        <div class="tab-container">
          <div
            class="tab-item"
            :class="{ active: active === 0 }"
            @click="changeActive(0)"
          >
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.25 2.6665H3.58333C3.21514 2.6665 2.91666 2.96498 2.91666 3.33317V5.99984C2.91666 6.36803 3.21514 6.6665 3.58333 6.6665H6.25C6.61819 6.6665 6.91666 6.36803 6.91666 5.99984V3.33317C6.91666 2.96498 6.61819 2.6665 6.25 2.6665Z"
                stroke="#0F172A"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.9167 2.6665H10.25C9.88181 2.6665 9.58333 2.96498 9.58333 3.33317V5.99984C9.58333 6.36803 9.88181 6.6665 10.25 6.6665H12.9167C13.2849 6.6665 13.5833 6.36803 13.5833 5.99984V3.33317C13.5833 2.96498 13.2849 2.6665 12.9167 2.6665Z"
                stroke="#0F172A"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.25 9.33301H3.58333C3.21514 9.33301 2.91666 9.63148 2.91666 9.99967V12.6663C2.91666 13.0345 3.21514 13.333 3.58333 13.333H6.25C6.61819 13.333 6.91666 13.0345 6.91666 12.6663V9.99967C6.91666 9.63148 6.61819 9.33301 6.25 9.33301Z"
                stroke="#0F172A"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M12.9167 9.33301H10.25C9.88181 9.33301 9.58333 9.63148 9.58333 9.99967V12.6663C9.58333 13.0345 9.88181 13.333 10.25 13.333H12.9167C13.2849 13.333 13.5833 13.0345 13.5833 12.6663V9.99967C13.5833 9.63148 13.2849 9.33301 12.9167 9.33301Z"
                stroke="#0F172A"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span class="tab-text">{{ t("FundList") }}</span>
          </div>
          <div
            class="tab-item"
            :class="{ active: active === 1 }"
            @click="changeActive(1)"
          >
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.75 11.3332L6.75 7.33317L9.41667 9.99984L14.75 4.6665"
                stroke="#94A3B8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10.0833 4.6665H14.75V9.33317"
                stroke="#94A3B8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span class="tab-text">{{ t("OrderList") }}</span>
          </div>
        </div>

        <!-- Tab内容 -->
        <div v-if="active === 0" class="tab-content">
          <div class="discont-list flex flex-col pb-40">
            <fund-item
              :item="item"
              v-for="(item, index) in list"
              :key="index"
              @handleClickBtn="handleClickBtn"
            ></fund-item>
            <div
              class="skeleton 1 w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
              v-if="skeleton && list.length == 0"
              v-for="i in 5"
              :key="i"
            ></div>
            <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>
            <LoadMore :status="listStatus" @load-more="loadMore" />
          </div>
        </div>
        <div v-if="active === 1" class="tab-content">
          <div class="discont-list flex flex-col pb-40">
            <fund-item
              :item="item"
              v-for="(item, index) in orderList"
              :key="index"
              @handleClickBtn="handleClickBtn"
              @handleClickOrder="handleClickOrder"
              :item-type="'order'"
            ></fund-item>
            <div
              class="skeleton 2 w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
              v-if="skeleton && orderList.length == 0"
              v-for="i in 5"
              :key="i"
            ></div>
            <empty
              v-if="orderList.length == 0 && !skeleton"
              :noTips="true"
            ></empty>
            <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
          </div>
        </div>
      </div>
      <!-- <van-tabs v-model:active="active" @change="changeActive">
        <van-tab :title="t('fund')" class="mt-24px">
       
        </van-tab>
        <van-tab :title="t('Order List')" class="mt-24px">
         
        </van-tab>
      </van-tabs> -->
    </template>
    <template v-else>
      <div class="discont-list flex flex-col pb-40">
        <fund-item
          v-for="(item, index) in orderList"
          :key="index"
          :item="item"
          @handleClickBtn="handleClickBtn"
          @handleClickOrder="handleClickOrder"
          :item-type="'order'"
        />
        <div
          class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
          v-show="skeleton && orderList.length === 0"
          v-for="i in 5"
          :key="i"
        />
        <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>
        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
      </div>
    </template>

    <bottom-pop
      ref="bottomPopRef"
      @onConfirm="onConfirm"
      :item="activeItem"
      :active="list[active]"
      :popType="popType"
    />
  </div>
</template>
<route lang="json5">
    {
      name: 'Fund',
      meta: {
        title: '基金',
        i18n:'Fund'
      },
    }
</route>
<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  fundProductList,
  fundOrderList,
  fundSubscribe,
  fundOperate,
  orderReNew,
  orderRedeem,
} from "@/api/bond";
import fundItem from "./component/fund-item.vue";
import LoadMore from "@/components/LoadMore.vue";
import bottomPop from "./component/bottom-pop.vue";
import { useLoadingStore } from "@/stores/modules/loading";
import { showToast, showSuccessToast, allowMultipleToast } from "vant";

import { navTitleStore } from "@/stores/index";
const navStore = navTitleStore();
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance();
const props = defineProps({
  onlyShowOrder: {
    type: Boolean,
    default: false,
  },
});
const active = ref(0);
const list = ref([]);
const orderList = ref([]);
const popType = ref("reserve"); // Reserve:预约  Redeem:赎回 Pay:支付 ReNew:续费
const skeleton = ref(false);
const page = reactive({
  pageIndex: 1,
  pageSize: 20,
});
const { t } = useI18n();
const activeItem = ref({});
const listStatus = ref(1); // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1); // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
  page.pageIndex = 1;
};
const bottomPopRef = ref();
const getDisountList = async () => {
  skeleton.value = true;
  // resetPage()
  listStatus.value = 1;
  fundProductList({
    assetId: categoryId.value,
    ...page,
  }).then((res) => {
    if (!res.data.list) {
      skeleton.value = false;
      listStatus.value = 3;
      return;
    }
    if (page.page == 1) {
      list.value = res.data.list || [];
    } else {
      list.value = list.value.concat(res.data.list || []);
    }
    if (!res.data.pagination.has_more) {
      listStatus.value = 3;
      skeleton.value = false;
      return;
    }
    skeleton.value = false;
    listStatus.value = 2;
  });
};
const getOrderList = async () => {
  skeleton.value = true;
  orderLoadStatus.value = 1;
  // resetPage()
  fundOrderList({
    assetId: categoryId.value,
    ...page,
  }).then((res) => {
    if (!res.data.list) {
      orderLoadStatus.value = 3;
      skeleton.value = false;
      return;
    }
    if (page.page == 1) {
      orderList.value = res.data.list || [];
    } else {
      orderList.value = orderList.value.concat(res.data.list || []);
    }
    if (!res.data.pagination.has_more) {
      orderLoadStatus.value = 3;
      skeleton.value = false;
      return;
    }
    skeleton.value = false;
    orderLoadStatus.value = 2;
  });
};
const changeActive = (val: any) => {
  skeleton.value = true;
  resetPage();
  active.value = val;
  if (val) {
    orderList.value = [];
    getOrderList();
  } else {
    list.value = [];
    getDisountList();
  }
};
const loadMore = () => {
  page.pageIndex += 1; // 统一先递增页码
  props.onlyShowOrder
    ? getOrderList()
    : active.value === 0
    ? getDisountList()
    : getOrderList();
};
const handleClickBtn = (val: any) => {
  activeItem.value = val.item;
  popType.value = val.itemType;
  setTimeout(() => {
    bottomPopRef.value.show(true);
  }, 80);
};
const handleClickOrder = async (val: any) => {
  try {
    let resCode = 0;
    if (val.status == 7) {
      if (val.type == 1) {
        // 续期
        const { data, code } = await fundOperate({
          id: val.id,
          type: "renew",
        });
        resCode = code;
      } else {
        // 赎回
        const { data, code } = await fundOperate({
          id: val.id,
          type: "redeem",
        });
        resCode = code;
      }
    }
    if (resCode == 200) {
      showSuccessToast();
      resetPage();
      getOrderList();
    }
  } catch (error) {
    console.log(error);
  }
};
const onConfirmOriginal = async (val: any) => {
  try {
    if (val.type == "fund") {
      const { data, code } = await fundSubscribe({
        ...val,
      });
      if (code == 200) {
        bottomPopRef.value.show(false);

        showSuccessToast({
          message: t(""),
          onClose: () => {
            active.value = 1;
            changeActive(1);
          },
        });
        // resetPage();
        // getDisountList();
      }
    } else {
      if (val.status == 1) {
        // 购买基金
        const { data, code } = await fundOperate({
          id: val.id,
          type: "pay",
        });
        if (code == 200) {
          bottomPopRef.value.show(false);
          showSuccessToast({
            message: t(""),
            onClose: () => {
              resetPage();
              getOrderList();
            },
          });
        }
      }
      // const { data, code } = await orderPay({
      //     id: val.id
      // })
      // if (code == 200) {
      //     console.log(data)
      //     showToast('出售成功')
      //     bottomPopRef.value.show(false)
      //     getOrderList()

      // }
    }
  } catch (error) {}
};
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});
const route = useRoute();
const categoryId = ref<any>("");
onMounted(() => {
  if (route.query.categoryId) {
    categoryId.value = route.query.categoryId;
  }

  // 检查 query 参数 tab 为 1 时切换到订单列表
  if (route.query.tab === "1") {
    active.value = 1;
    getOrderList();
  } else if (props.onlyShowOrder) {
    getOrderList();
  } else {
    getDisountList();
  }
  allowMultipleToast();
  // navStore.setNavTitle('基金')
});
onUnmounted(() => {
  // navStore.setNavTitle('')
});
</script>
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
