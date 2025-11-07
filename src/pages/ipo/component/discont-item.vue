<template>
  <div class="discont-item-content w-full px-12 py-24 flex flex-col gap-18px" v-if="props.itemType == 'ipo'">
    <ipoItemTop :item="_item"></ipoItemTop>
    <div class="divdiver"></div>
    <ipoItemCenter :item="_item"></ipoItemCenter>
    <ipoItemInfo :item="_item"></ipoItemInfo>
    <!-- <div class="li">
      <div class="li-l w-70%">
        <van-progress :percentage="_item.percentage" stroke-width="8px" track-color="#1989fa" color="#e5e5e5"
          :show-pivot="false" />
      </div> 
    </div>-->
    <div class="flex gap-12 pt-0px">
      <div class="flex-1 flex  justify-center">
        <van-button type="primary" block :color="item.status == 1 ? '#007aff' : '#007aff'" @click="handleClickDetail"
          class="h-35px! w-130px! rounded-16px!">{{
            t("Introduction")
          }}</van-button>
      </div>
      <!-- <div class="flex-1">
        <van-button type="primary" :color="item.status == 1 ? '#007aff' : '#ccc'" block
          @click="handleClickCreditPage">{{ t("Margin financing") }}</van-button>
      </div> -->
      <div class="flex-1 flex justify-center">
        <van-button type="primary" block @click="handleClickSubmit" class="h-35px! w-130px! rounded-16px!"
          :color="item.status == 1 ? '#007aff' : '#ccc'">
          {{ t("Reserve") }}</van-button>
      </div>
    </div>
  </div>
  <div class="order-item-content w-full px-12 py-24 font-size-12 flex flex-col gap-18px"
    v-if="props.itemType == 'order'">
    <ipoItemTop :item="_item" :item-type="'order'"></ipoItemTop>
    <div class="info flex flex-col p-8  gap-12 w-full rounded-6px bg-#F8F9FD ">
        <div class="flex-1 flex justify-between items-center">
          <div class="label color-#64748B font-size-18px ">{{ t('Issue Price') }}</div>
            <div class="price color-#6B39F4 font-bold font-size-16px">${{ item.price }}</div>

        </div>
      <!-- <div class="flex-1">
          <div class="label color-#64748B font-size-18px ">中签率</div>
            <div class="price color-#6B39F4 font-bold font-size-16px">${{ item.product_price }}</div>
        </div> -->
        <div class="flex-1  flex justify-between items-center">
          <div class="label color-#64748B font-size-18px ">{{ t('Listing time') }}</div>
          <div class="price color-#000 font-bold font-size-16px">{{ item.market_time }}</div>
        </div>
  <div class="flex-1  flex justify-between items-center" v-if="false">
          <div class="label color-#64748B font-size-18px ">预计获得</div>
          <div class="price color-#6B39F4 font-bold font-size-16px">$1.5</div>
        </div>
 <div class="flex-1  flex justify-between items-center" v-if="[1,2].includes(item.status)">
          <div class="label color-#64748B font-size-18px ">{{item.status == 2?t('Paided'):t('Need Pay')}}</div>
          <div class="price color-#000 font-bold font-size-16px">MX$ {{ item.total_price }}</div>
        </div>
    </div>


    <!-- <ipoOrderItemInfo :item="_item"></ipoOrderItemInfo> -->
    <div class="flex gap-12">

      <div class="flex-1">
        <van-button type="primary" class="h-35px! rounded-16px!" block @click="handleClickSubmit"
          :color="[1,3].includes(item.status) ? '#007aff' : '#ccc'">{{
            orderBtnText }}</van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from "../enum";
import { orderPay,ipoOrderSell } from "@/api/ipo";
import ipoItemTop from "./ipo-item-top.vue";
import ipoItemCenter from "./ipo-item-center.vue";
import ipoItemInfo from "./ipo-item-info.vue";
import ipoOrderItemInfo from "./ipo-order-item-info.vue";
import {  showSuccessToast,  } from "vant";

import dayjs from "dayjs";
import vw from "@/utils/inline-px-to-vw";
const { t } = useI18n();
const emits = defineEmits(["handleClickBtn", "reloadList"]);
const props = defineProps({
  item: {
    type: Object as () => any,
  },
  index: {
    type: Number,
  },
  itemType: {
    type: String,
    default: "ipo",
  },
});
const router = useRouter();
const orderBtnText = computed(() => {
  let text =  orderStatusEnum[props.item.status]
  if(props.item.status == 1){
    return t('Need Pay',{money:'MX$ '+props.item.total_price})
  }
  return t(text);
});
const _item = computed(() => {
  return props.item;
});
const _index = computed(() => {
  return 1;
});
const handleClickCreditPage = () => {
  if (_item.value.status != 1) return
  router.push(
    `/ipo/creditPage?assetId=${_item.value.assetId}&ipoId=${_item.value.ipoId}`
  );
};
const handleClickDetail = () => {
  router.push(`/ipo/ipoDetail?id=${_item.value.id}`);
};
const handleClickSubmit = () => {
  if (props.itemType == "ipo" && props.item.status != 1) {
    return;
  }
  if (props.itemType == "order" && props.item.status == 1) {
    // 支付
    orderPay({
      id: props.item.id,
    }).then((res) => {
      if (res.code == 200) {
        showSuccessToast({});
        emits("reloadList");
      }
    });
    return;
  } else if (props.itemType == "order" && props.item.status == 3) {
    // 出售
    ipoOrderSell({ 
      id: props.item.id,
    }).then((res) => {
      if (res.code == 200) {
        showSuccessToast({});
        emits("reloadList");
      }
    });
    return;
  }
  let data = {
    item: props.item,
    itemType: props.itemType,
  };
  emits("handleClickBtn", data);
};
</script>
<style lang="less" scoped>
.discont-item-content,
.order-item-content {
  // background: var(--bg);
  border: 1px solid #E2E8F0;
  border-radius: 12px;
}

.divdiver {
  width: 100%;
  height: 2px;
  background: #E2E8F0;
}
</style>
