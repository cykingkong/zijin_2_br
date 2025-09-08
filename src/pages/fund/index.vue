<template>
  <div class="discont-content px-24 w-full">
    <template v-if="!onlyShowOrder">
      <van-tabs v-model:active="active" @change="changeActive">
        <van-tab :title="t('fund')" class="mt-24px">
          <div class="discont-list flex flex-col pb-40">
            <fund-item :item="item" v-for="(item, index) in list" :key="index"
              @handleClickBtn="handleClickBtn"></fund-item>
            <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
              v-show="skeleton && list.length == 0" v-for="i in 5" :key="i"></div>
            <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>
            <LoadMore :status="listStatus" @load-more="loadMore" />
          </div>
        </van-tab>
        <van-tab :title="t('Order List')" class="mt-24px">
          <div class="discont-list flex flex-col pb-40">
            <fund-item :item="item" v-for="(item, index) in orderList" :key="index" @handleClickBtn="handleClickBtn"
              @handleClickOrder="handleClickOrder" :item-type="'order'"></fund-item>
            <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
              v-show="skeleton && orderList.length == 0" v-for="i in 5" :key="i"></div>
            <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>
            <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
          </div>
        </van-tab>
      </van-tabs>
    </template>
    <template v-else>
      <div class="discont-list flex flex-col pb-40">
        <fund-item v-for="(item, index) in orderList" :key="index" :item="item" @handleClickBtn="handleClickBtn"
          @handleClickOrder="handleClickOrder" :item-type="'order'" />
        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
          v-show="skeleton && orderList.length === 0" v-for="i in 5" :key="i" />
        <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>
        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
      </div>
    </template>

    <bottom-pop ref="bottomPopRef" @onConfirm="onConfirm" :item="activeItem" :active="list[active]"
      :popType="popType" />
  </div>
</template>
<route lang="json5">
    {
      name: 'fund',
      meta: {
        title: '基金',
        i18n:'fund'
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
    if (page.pageIndex == 1) {
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
    if (page.pageIndex == 1) {
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
  }, 80)

};
const handleClickOrder = async (val: any) => {
  try {
    let resCode = 0;
    if (val.status == 7) {
      if (val.type == 1) {
        // 续期
        const { data, code } = await fundOperate({
          id: val.id,
          type: 'renew'
        });
        resCode = code;
      } else {
        // 赎回
        const { data, code } = await fundOperate({
          id: val.id,
          type: 'redeem'
        });
        resCode = code;
      }
    }
    if (resCode == 200) {
      showToast(
        val.type == 1 ? t("Successfully redeemed") : t("Successfully renewed")
      );
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

        showToast({
          message: t("Successfully booked an appointment"),
          onClose: () => {
            active.value = 1;
            changeActive(1)
          }
        });
        // resetPage();
        // getDisountList();
      }
    } else {

      if (val.status == 1) {
        // 购买基金
        const { data, code } = await fundOperate({
          id: val.id,
          type: 'pay'
        });
        if (code == 200) {
          bottomPopRef.value.show(false);
          showToast({
            message: t("Purchase successful"),
            onClose: () => {
              resetPage();
              getOrderList();
            }
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
  } catch (error) { }
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
  if (props.onlyShowOrder) {
    getOrderList();
  } else {
    getDisountList();
  }
  allowMultipleToast()
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
</style>
