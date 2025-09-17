<template>
  <div class="discont-content px-24 w-full">
    <VanNavBar
      title=""
      :fixed="true"
      clickable
      :left-arrow="true"
      @click-left="onBack"
      v-if="!onlyShowOrder"
      z-index="999"
    >
      <template #title>
        <div class="flex flex-items-center gap-6">{{ t("Discount") }}</div>
      </template>
    </VanNavBar>
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

            <span class="tab-text">{{ t("DiscountList") }}</span>
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
            <discont-item
              :item="item"
              v-for="(item, index) in list"
              :key="index"
              @handleClickBtn="handleClickBtn"
            ></discont-item>
            <div
              class="skeleton d w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
              :class="listSkeleton && list.length == 0"
              v-show="listSkeleton && list.length == 0"
              v-for="i in 5"
              :key="i"
            ></div>
            <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>
            <LoadMore :status="listStatus" @load-more="loadMore" />
          </div>
        </div>
        <div v-if="active === 1" class="tab-content">
          <div class="discont-list flex flex-col pb-40">
            <discont-item
              :item="item"
              v-for="(item, index) in orderList"
              :key="index"
              @handleClickBtn="handleClickBtn"
              :item-type="'order'"
            ></discont-item>
            <div
              class="skeleton o w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
              :class="orderSkeleton && orderList.length == 0"
              v-if="orderSkeleton && orderList.length == 0"
              v-for="i in 5"
              :key="i"
            ></div>
            <empty
              v-if="orderList.length == 0 && !orderSkeleton"
              :noTips="true"
            ></empty>
            <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="discont-list flex flex-col pb-40">
        <discont-item
          :item="item"
          v-for="(item, index) in orderList"
          :key="index"
          @handleClickBtn="handleClickBtn"
          :item-type="'order'"
        ></discont-item>
        <div
          class="skeleton else w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
          v-if="orderSkeleton && orderList.length == 0"
          v-for="i in 5"
          :key="i"
        ></div>
        <empty
          v-if="orderList.length == 0 && !orderSkeleton"
          :noTips="true"
        ></empty>
        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
      </div>
    </template>
    <bottom-pop
      ref="bottomPopRef"
      @onConfirm="onConfirm"
      :item="activeItem"
      :active="list[active]"
      :popType="popType"
    ></bottom-pop>
  </div>
</template>
<script setup lang="ts">
import {
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  discountList,
  discountOrderList,
  discountOrderBuy,
  discountOrderSell,
} from "@/api/bond";
import { showToast, allowMultipleToast } from "vant";

import { useStore } from "@/stores/modules/index";
import discontItem from "./component/discont-item.vue";
import bottomPop from "./component/bottom-pop.vue";
import LoadMore from "@/components/LoadMore.vue";
import { useLoadingStore } from "@/stores/modules/loading";
import { navTitleStore } from "@/stores/index";
const navStore = navTitleStore();
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance();
const props = defineProps({
  onlyShowOrder: {
    type: Boolean,
    default: false,
  },
  categoryId: {
    type: String,
    default: "",
  },
});
const categoryId = ref<any>("");
const orderList = ref([]);

watch(
  () => props.categoryId,
  (newV) => {
    if (newV && categoryId.value != newV && categoryId.value != "") {
      categoryId.value = newV;
      orderList.value = [];
      // 只有在onlyShowOrder模式下才调用getOrderList
      if (props.onlyShowOrder) {
        getOrderList();
      }
      return;
    }
    categoryId.value = newV;
  },
  {
    immediate: true,
  }
);
const active = ref(0);
const list = ref([]);
const popType = ref("buy"); // buy:购买  sell:出售
const skeleton = ref(false);
const listSkeleton = ref(false);
const orderSkeleton = ref(false);
const page = reactive({
  page: 1,
  size: 4,
});
const { t } = useI18n();
const activeItem = ref({});
const listStatus = ref(1); // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1); // 1:加载中 2:加载完成 3:没有更多数据
let discountUpdateTimer = ref<NodeJS.Timeout | null>(null);
let orderUpdateTimer = ref<NodeJS.Timeout | null>(null);

const resetPage = () => {
  page.pageIndex = 1;
};

// 定时更新折扣列表价格（不显示loading）
const updateDiscountListPrices = async () => {
  try {
    console.log("正在更新折扣列表价格...", {
      categoryId: categoryId.value,
      listLength: list.value.length,
    });
    const res = await discountList(
      {
        page: 1,
        size: list.value.length, // 获取当前列表长度的数据
        categoryId: categoryId.value,
      },
      { showLoading: false }
    ); // 不显示loading

    console.log("接口返回数据:", res.data);
    if (res.data && res.data.list) {
      console.log(
        "开始更新列表项，当前列表长度:",
        list.value.length,
        "新数据长度:",
        res.data.list.length
      );
      // 更新现有列表中的价格信息
      list.value.forEach((currentItem, index) => {
        const newItem = res.data.list.find(
          (item: any) =>
            item.id === currentItem.id ||
            item.tradingPairsId === currentItem.tradingPairsId
        );
        if (newItem) {
          console.log(`更新第${index}项:`, {
            old: {
              close: currentItem.close,
              discountPrice: currentItem.discountPrice,
            },
            new: {
              price: newItem.price,
              discount_price: newItem.discount_price,
            },
          });
          // 只更新价格相关字段，保持其他字段不变
          currentItem.close = newItem.price; // 使用price字段而不是close
          currentItem.discountPrice = newItem.discount_price; // 使用discount_price字段
          currentItem.percentage = (
            ((newItem.total_quantity - newItem.available_quantity) /
              newItem.total_quantity) *
            100
          ).toFixed(2);
        } else {
          console.log(`第${index}项未找到匹配数据:`, currentItem);
        }
      });
      console.log("价格更新完成");
    } else {
      console.log("接口返回数据为空或格式不正确");
    }
  } catch (error) {
    console.error("更新折扣列表价格失败:", error);
  }
};

// 启动定时更新
const startDiscountUpdate = () => {
  console.log(discountUpdateTimer.value, "discountUpdateTimer.value");
  if (discountUpdateTimer.value) {
    clearInterval(discountUpdateTimer.value);
  }
  console.log("启动定时更新");
  discountUpdateTimer.value = setInterval(() => {
    console.log("折扣列表定时器触发", {
      active: active.value,
      onlyShowOrder: props.onlyShowOrder,
    });
    if (active.value === 0 && !props.onlyShowOrder) {
      console.log("开始更新折扣列表价格");
      updateDiscountListPrices();
    } else {
      console.log("折扣列表定时器跳过更新 - 当前不在折扣列表tab");
    }
  }, 10000); // 10秒更新一次
};

// 停止定时更新
const stopDiscountUpdate = () => {
  if (discountUpdateTimer.value) {
    clearInterval(discountUpdateTimer.value);
    discountUpdateTimer.value = null;
  }
};

// 定时更新订单列表价格和收益（不显示loading）
const updateOrderListPrices = async () => {
  try {
    console.log("正在更新订单列表价格...", {
      categoryId: categoryId.value,
      orderListLength: orderList.value.length,
    });
    const res = await discountOrderList(
      {
        page: 1,
        size: orderList.value.length, // 获取当前订单列表长度的数据
        categoryId: categoryId.value,
      },
      { showLoading: false }
    ); // 不显示loading

    console.log("订单接口返回数据:", res.data);
    if (res.data && res.data.list) {
      console.log(
        "开始更新订单列表项，当前列表长度:",
        orderList.value.length,
        "新数据长度:",
        res.data.list.length
      );
      // 更新现有订单列表中的价格和收益信息
      orderList.value.forEach((currentItem, index) => {
        const newItem = res.data.list.find(
          (item: any) =>
            item.id === currentItem.id ||
            item.tradingId === currentItem.tradingId
        );
        if (newItem) {
          console.log(`更新订单第${index}项:`, {
            old: {
              close: currentItem.close,
              discountPrice: currentItem.discountPrice,
              earnings: currentItem.earnings,
              earningRate: currentItem.earningRate,
              income: currentItem.income,
              income_price: currentItem.income_price,
            },
            new: {
              close: newItem.close,
              discountPrice: newItem.discountPrice,
              salePrice: newItem.salePrice,
              status: newItem.status,
            },
          });
          // 更新价格相关字段
          currentItem.close = newItem.close;
          currentItem.discountPrice = newItem.discountPrice;
          currentItem.salePrice = newItem.salePrice;
          // currentItem.status = newItem.status

          // 重新计算收益和收益率
          if (currentItem.status == 1) {
            // 未售出状态：基于当前市价计算
            currentItem.earnings =
              (
                (currentItem.close - currentItem.discountPrice) *
                currentItem.purchaseQuantity
              ).toFixed(2) || 0;
            currentItem.earningRate = (
              ((currentItem.close - currentItem.discountPrice) /
                currentItem.close) *
              100
            ).toFixed(2);
            // 更新组件中使用的字段
            currentItem.income = currentItem.income; // 收益率百分比
            currentItem.income_price = currentItem.income_price; // 收益金额
          } else {
            // 已售出状态：基于售出价计算
            currentItem.earnings =
              (
                (currentItem.salePrice - currentItem.discountPrice) *
                currentItem.purchaseQuantity
              ).toFixed(2) || 0;
            currentItem.earningRate = currentItem.salePrice
              ? (
                  ((currentItem.salePrice - currentItem.discountPrice) /
                    currentItem.salePrice) *
                  100
                ).toFixed(2)
              : 0;
            // 更新组件中使用的字段
            currentItem.income = currentItem.income; // 收益率百分比
            currentItem.income_price = currentItem.income_price; // 收益金额
          }
        } else {
          console.log(`订单第${index}项未找到匹配数据:`, currentItem);
        }
      });
      console.log("订单价格更新完成");
    } else {
      console.log("订单接口返回数据为空或格式不正确");
    }
  } catch (error) {
    console.error("更新订单列表价格失败:", error);
  }
};

// 启动订单列表定时更新
const startOrderUpdate = () => {
  console.log(orderUpdateTimer.value, "orderUpdateTimer.value");
  if (orderUpdateTimer.value) {
    clearInterval(orderUpdateTimer.value);
  }
  console.log("启动订单列表定时更新");
  orderUpdateTimer.value = setInterval(() => {
    console.log("订单列表定时器触发", {
      active: active.value,
      onlyShowOrder: props.onlyShowOrder,
    });
    if ((active.value === 1 && !props.onlyShowOrder) || props.onlyShowOrder) {
      console.log("开始更新订单列表价格");
      updateOrderListPrices();
    } else {
      console.log("订单列表定时器跳过更新 - 当前不在订单列表tab");
    }
  }, 10000); // 10秒更新一次
};

// 停止订单列表定时更新
const stopOrderUpdate = () => {
  if (orderUpdateTimer.value) {
    clearInterval(orderUpdateTimer.value);
    orderUpdateTimer.value = null;
  }
};

const bottomPopRef = ref();
const getDisountList = async () => {
  // resetPage()
  console.log(123123123);
  listStatus.value = 1;
  if (page.pageIndex == 1) {
    listSkeleton.value = true;
  }
  discountList({
    ...page,
    categoryId: categoryId.value,
  }).then((res) => {
    if (!res.data.list) {
      listStatus.value = 3;
      listSkeleton.value = false;
      return;
    }

    if (page.pageIndex == 1) {
      list.value =
        res.data.list.map((e) => {
          return {
            ...e,
            percentage: (
              ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) *
              100
            ).toFixed(2),
          };
        }) || [];
    } else {
      let result = res.data.list.map((e) => {
        return {
          ...e,
          percentage: (
            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) *
            100
          ).toFixed(2),
        };
      });
      list.value = list.value.concat(result);
    }

    // 根据新的分页格式判断是否还有更多数据
    if (!res.data.pagination.has_more) {
      listStatus.value = 3;
      listSkeleton.value = false;
      startDiscountUpdate();

      return;
    }

    listSkeleton.value = false;
    listStatus.value = 2;
    console.log("1231231");
    // 启动定时更新
    startDiscountUpdate();
  });
};
const getOrderList = async () => {
  orderLoadStatus.value = 1;
  orderSkeleton.value = true;
  discountOrderList({
    ...page,
    categoryId: categoryId.value,
  }).then((res) => {
    if (!res.data.list) {
      orderLoadStatus.value = 3;
      orderSkeleton.value = false;
      return;
    }
    if (page.pageIndex == 1) {
      orderList.value =
        res.data.list.map((e) => {
          if (e.status == 1) {
            return {
              ...e,
              // percentage: (
              //     ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
              // ).toFixed(2),
              // earnings: ((e.close - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
              // earningRate: ((e.close - e.discountPrice) / e.close * 100).toFixed(2)
            };
          } else {
            return {
              ...e,
              // percentage: (
              //     ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
              // ).toFixed(2),
              // earnings: ((e.salePrice - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
              // earningRate: e.salePrice ? ((e.salePrice - e.discountPrice) / e.salePrice * 100).toFixed(2) : 0
            };
          }
        }) || [];
    } else {
      let result = res.data.list
        ? res.data.list.map((e) => {
            if (e.status == 1) {
              return {
                ...e,
                // percentage: (
                //     ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                // ).toFixed(2),
                // earnings: ((e.close - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                // earningRate: ((e.close - e.discountPrice) / e.close * 100).toFixed(2)
              };
            } else {
              return {
                ...e,
                // percentage: (
                //     ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                // ).toFixed(2),
                // earnings: ((e.salePrice - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                // earningRate: e.salePrice ? ((e.salePrice - e.discountPrice) / e.salePrice * 100).toFixed(2) : 0
              };
            }
          })
        : [];
      orderList.value = orderList.value.concat(result);
    }
    if (!res.data.pagination.has_more) {
      orderLoadStatus.value = 3;
      orderSkeleton.value = false;
      // 启动订单列表定时更新
      startOrderUpdate();
      return;
    }
    orderSkeleton.value = false;
    orderLoadStatus.value = 2;
    // 启动订单列表定时更新
    startOrderUpdate();
  });
};
const store = useStore();
watch(
  () => store.klineList,
  (newV) => {
    if (newV && list.value.length) {
      list.value.forEach((el) => {
        let listItem = newV.find((item: any) => {
          return item.tradingId == el.tradingPairsId;
        });
        if (listItem) {
          if (listItem.tradingId == el.tradingPairsId) {
            el.close = listItem.tick.close;
          }
        }
      });
    }
    if (newV && orderList.value.length) {
      orderList.value.forEach((el) => {
        let listItem = newV.find((item) => item.tradingId == el.tradingPairsId);
        if (listItem) {
          if (listItem.tradingId == el.tradingPairsId) {
            el.close = listItem.tick.close;
            if (el.status == 1) {
              el.earnings =
                ((el.close - el.discountPrice) * el.purchaseQuantity).toFixed(
                  2
                ) || 0; // 收益，
              el.earningRate = (
                ((el.close - el.discountPrice) / el.close) *
                100
              ).toFixed(2); // 收益率
            } else {
              el.earnings =
                (
                  (el.salePrice - el.discountPrice) *
                  el.purchaseQuantity
                ).toFixed(2) || 0; // 收益，
              el.earningRate = el.salePrice
                ? (
                    ((el.salePrice - el.discountPrice) / el.salePrice) *
                    100
                  ).toFixed(2)
                : 0; // 收益率
            }
          }
        }
      });
    }
  }
);
const changeActive = (val: any) => {
  resetPage();
  active.value = val;
  if (val) {
    // 切换到订单列表，停止折扣列表定时更新，启动订单列表定时更新
    stopDiscountUpdate(); // 停止折扣产品列表定时刷新
    orderList.value = [];
    listSkeleton.value = false; // 隐藏列表骨架屏
    getOrderList(); // 这会自动启动订单列表定时更新
  } else {
    // 切换到折扣列表，停止订单相关定时器，启动折扣列表定时更新
    stopOrderUpdate(); // 停止订单列表定时刷新
    orderList.value = [];
    orderSkeleton.value = false; // 隐藏订单骨架屏
    getDisountList(); // 这会自动启动折扣列表定时更新
  }
};
const loadMore = () => {
  // 确保每次点击都递增页码
  const originalPageIndex = page.pageIndex;
  page.pageIndex += 1;

  // 调试日志
  console.log(
    "Loading more. New pageIndex:",
    page.pageIndex,
    "Original:",
    originalPageIndex,
    "Mode:",
    props.onlyShowOrder ? "OrderOnly" : "Normal"
  );

  if (props.onlyShowOrder) {
    console.log("Fetching order list with page:", page);
    getOrderList();
  } else {
    console.log(
      "Fetching",
      active.value === 0 ? "discount" : "order",
      "list with page:",
      page
    );
    active.value === 0 ? getDisountList() : getOrderList();
  }
};
const handleClickBtn = (val: any) => {
  // activeItem.value = val.item;
  // popType.value = val.itemType;
  // bottomPopRef.value.show(true);

  localStorage.setItem("dataInfo", JSON.stringify(val));
  router.push({
    path: "/buy",
    query: {
      type: 1,
      buyType: "discount",
    },
    replace: true,
  });
};
const onConfirmOriginal = async (val: any) => {
  console.log(val);
  try {
    if (val.type == "discount") {
      const { data, code } = await discountOrderBuy({
        ...val,
      });
      if (code == 200) {
        console.log(data);
        bottomPopRef.value.show(false);
        showToast({
          message: t("Order placed successfully"),
          onClose: () => {
            active.value = 1;
            changeActive(1);
          },
        });
        // resetPage()
        // getDisountList()
      }
    } else {
      const { data, code } = await discountOrderSell({
        id: val.id,
      });
      if (code == 200) {
        console.log(data);
        bottomPopRef.value.show(false);
        showToast({
          message: t("Sold successfully"),
          onClose: () => {
            resetPage();
            getOrderList();
          },
        });
      }
    }
  } catch (error) {}
};
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});
const router = useRouter();
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const route = useRoute();

onMounted(() => {
  // 确保skeleton初始状态为false
  skeleton.value = false;
  listSkeleton.value = false;
  orderSkeleton.value = false;

  if (route.query.categoryId) {
    categoryId.value = route.query.categoryId;
  }

  // 检查路由参数 tab，如果 tab=1 则切换到订单列表
  if (route.query.tab === "1") {
    active.value = 1;
    getOrderList();
  } else if (props.onlyShowOrder) {
    getOrderList();
  } else {
    getDisountList();
  }
  allowMultipleToast();
  // navStore.setNavTitle('折扣股')
  route.meta.title = "折扣股"; // 设置你需要的标题
});
onUnmounted(() => {
  // 清理所有定时器
  stopDiscountUpdate();
  stopOrderUpdate();
  // navStore.setNavTitle('')
});
</script>
<!-- <route lang="json5">
    {
      name: 'discount',
      meta: {
        title: '折扣股',
      },
    }
</route> -->
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
