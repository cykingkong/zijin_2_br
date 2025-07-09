<template>
  <div class="discont-item-content w-full px-12 py-24 flex flex-col gap-20px" v-if="props.itemType == 'ipo'">
    <ipoItemTop :item="_item"></ipoItemTop>
    <ipoItemCenter :item="_item"></ipoItemCenter>
    <ipoItemInfo :item="_item"></ipoItemInfo>
    <div class="li">
      <div class="li-l w-70%">
        <van-progress :percentage="_item.percentage" stroke-width="8px" track-color="#1989fa" color="#e5e5e5"
          :show-pivot="false" />
      </div>
    </div>
    <div class="flex gap-12">
      <div class="flex-1">
        <van-button type="default" plain block @click="handleClickDetail">{{
          t("detail")
          }}</van-button>
      </div>
      <div class="flex-1">
        <van-button type="primary" :color="item.status == 1 ? '#007aff' : '#ccc'" block
          @click="handleClickCreditPage">{{ t("Margin financing") }}</van-button>
      </div>
      <div class="flex-1">
        <van-button type="primary" block @click="handleClickSubmit" :color="item.status == 1 ? '#007aff' : '#ccc'">
          {{ t("subscription") }}</van-button>
      </div>
    </div>
  </div>
  <div class="order-item-content w-full px-12 py-24 font-size-12 flex flex-col gap-10px"
    v-if="props.itemType == 'order'">
    <ipoItemTop :item="_item" :item-type="'order'"></ipoItemTop>
    <ipoOrderItemInfo :item="_item"></ipoOrderItemInfo>
    <div class="flex gap-12">
      <div class="flex-1"></div>
      <div class="flex-1">
        <van-button type="primary" block @click="handleClickSubmit" :color="item.status == 1 ? '#007aff' : '#ccc'">{{
          orderBtnText }}</van-button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from "../enum";
import { orderPay } from "@/api/ipo";
import ipoItemTop from "./ipo-item-top.vue";
import ipoItemCenter from "./ipo-item-center.vue";
import ipoItemInfo from "./ipo-item-info.vue";
import ipoOrderItemInfo from "./ipo-order-item-info.vue";

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
  let text = "";
  switch (props.item.status) {
    case 0:
      text = "Applied";
      break;
    case 1:
      text = `Pay ${props.item.assetInfo.unit} ${props.item.totalPrice}`;
      break;

    case 2:
      text = "Sell";
      break;
    case 3:
      text = "Finish";
      break;
    default:
      text = "Fail";
      break;
  }
  return text;
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
  router.push(`/ipo/ipoDetail?id=${_item.value.ipoId}`);
};
const handleClickSubmit = () => {
  if (props.itemType == "ipo" && props.item.status != 1) {
    return;
  }
  if (props.itemType == "order" && props.item.status == 1) {
    // 补交
    orderPay({
      orderId: props.item.ipoId,
    }).then((res) => {
      if (res.code == 200) {
        showToast(t("Successfully submitted late"));
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
  border-bottom: 1px solid var(--border_color);
}
</style>
