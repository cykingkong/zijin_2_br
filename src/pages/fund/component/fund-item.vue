<template>
  <div>
    <div
      class="discont-item-content w-full px-12 py-14 flex flex-col border-1px border-solid border-#E2E8F0 rounded-12px mb-16px"
      v-if="props.itemType == 'fund'"
    >
      <!-- 玩法 - 基金 -->

      <div class="top-li flex items-center" @click="handleClickDetail">
        <div class="l flex flex-shrink-0 items-center gap-6 justify-between">
          <div class="name font-size-16 font-700 text-#0F172A">
            {{ item.name }}
            <svg
              class="w-14 h-14"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.78 5.36978L10.1 4.57979C9.97 4.42979 9.865 4.14979 9.865 3.94979V3.09979C9.865 2.56979 9.43 2.13479 8.9 2.13479H8.05C7.855 2.13479 7.57 2.02979 7.42 1.89979L6.63 1.21979C6.285 0.924785 5.72 0.924785 5.37 1.21979L4.585 1.90479C4.435 2.02979 4.15 2.13479 3.955 2.13479H3.09C2.56 2.13479 2.125 2.56979 2.125 3.09979V3.95479C2.125 4.14979 2.02 4.42979 1.895 4.57979L1.22 5.37478C0.930002 5.71978 0.930002 6.27979 1.22 6.62478L1.895 7.41979C2.02 7.56979 2.125 7.84978 2.125 8.04479V8.89978C2.125 9.42978 2.56 9.86479 3.09 9.86479H3.955C4.15 9.86479 4.435 9.96979 4.585 10.0998L5.375 10.7798C5.72 11.0748 6.285 11.0748 6.635 10.7798L7.425 10.0998C7.575 9.96979 7.855 9.86479 8.055 9.86479H8.905C9.435 9.86479 9.87 9.42978 9.87 8.89978V8.04979C9.87 7.85478 9.975 7.56979 10.105 7.41979L10.785 6.62979C11.075 6.28479 11.075 5.71478 10.78 5.36978ZM8.08 5.05478L5.665 7.46978C5.595 7.53978 5.5 7.57978 5.4 7.57978C5.3 7.57978 5.205 7.53978 5.135 7.46978L3.925 6.25979C3.78 6.11479 3.78 5.87478 3.925 5.72978C4.07 5.58478 4.31 5.58478 4.455 5.72978L5.4 6.67479L7.55 4.52479C7.695 4.37979 7.935 4.37979 8.08 4.52479C8.225 4.66979 8.225 4.90978 8.08 5.05478Z"
                fill="#1BC256"
              />
            </svg>
          </div>
        </div>
      </div>
      <div
        class="fundDivider w-full h-1px bg-#EBECEF mt-10px mb-12px"
        @click="handleClickDetail"
      ></div>

      <div
        class="li flex items-center justify-between text-12px text-#A3A7AE"
        @click="handleClickDetail"
      >
        <div class="li-l">
          <div class="l1">{{ t("ReserveStartTime") }}</div>
          <div class="t">
            {{ _item.start_time_begin }}
          </div>
        </div>
        <div class="li-r">
          <div class="l1">{{ t("ReserveEndTime") }}</div>
          <div class="t">
            {{ _item.start_time_end }}
          </div>
        </div>
      </div>
      <div
        class="li flex justify-between items-center mb-22px p-8 gap-8px bg-#F8F9FD rounded-12px mt-12px"
        @click="handleClickDetail"
      >
        <div class="li-l flex-1 font-size-14 flex-shrink-0">
          <div class="l">
            {{ t("D.Y") }}
          </div>
          <div class="v">
            <span>{{ _item.daily_yield }}%</span>
          </div>
        </div>
        <div class="li-m flex-1 font-size-14 text-align-center flex-shrink-0">
          <div class="l">{{ t("T.R") }}</div>
          <div class="v">
            <span> {{ _item.total_yield }} %</span>
          </div>
        </div>
        <div class="li-r flex-1 font-size-14 text-align-right flex-shrink-0">
          <div class="l">{{ t("C.D") }}</div>
          <div class="v">{{ _item.cycle }} D</div>
        </div>
      </div>

      <div class="li flex justify-end gap-12px">
        <van-button
          type="primary"
          :color="_item.status == 1 ? '#1989fa' : '#b5b5b5'"
          @click="handleClickSubmit"
          size="small"
          class="font-size-14! w-full h-35px rounded-35px!"
          >{{ t(statusEnum[_item.status]) }}</van-button
        >
      </div>
    </div>
    <div
      class="order-item-content w-full px-10 py-12 font-size-12 flex flex-col gap-10px bg-#F8F9FD mb-16px rounded-12px"
      v-if="props.itemType == 'order'"
    >
      <div
        class="top-li font-size-14 flex items-center text-#5126B5"
        @click.stop="handleClickOrderDetail"
      >
        <div class="l flex flex-shrink-0 items-center gap-6 justify-between">
          <div class="name font-size-16 font-700">
            {{ item.fund_name }}
          </div>
        </div>

        <div class="r flex flex-1 flex-shrink-0 justify-end">
          MX$ {{ item.amount }}
        </div>
      </div>
      <div
        class="line w-full bg-#693CFF1F rounded-16px h-16px"
        @click.stop="handleClickOrderDetail"
      >
        <div
          class="line-inner bg-#693CFF rounded-16px h-16px"
          :style="{ width: item.calculateProgress + '%' }"
        ></div>
      </div>
      <div
        class="li flex justify-between items-center text-#717680"
        @click.stop="handleClickOrderDetail"
      >
        <div class="li-l font-size-16">
          {{ "MX$" }}
          {{ _item.total_profit }} / {{ "MX$" }}
          {{ addCommasToNumber(_item.total_amount) }}
        </div>
        <div class="li-r font-size-14 text-align-right">
          <div class="rate">{{ t("D.Y") }}:{{ _item.daily_yield }}%</div>
          <div class="rate">
            {{ t("T.Y") }}:
            <span :class="_item.total_yield >= 0 ? 'up' : 'down'">
              {{ _item.total_yield }} %</span
            >
          </div>
        </div>
      </div>

      <div
        class="li flex items-center justify-between"
        @click.stop="handleClickOrderDetail"
      >
        <div class="li-l text-14px text-#A3A7AE">{{ _item.status_time }}</div>
        <div class="li-r text-14px text-#A3A7AE">{{ _item.end_time }}</div>
      </div>
      <div class="li flex gap-12px justify-end items-center">
        <!-- <van-button v-if="_item.status == 3 && item.getType == 1 && item.surplusProfit > 0" color="#7232dd"
          @click="handleClickSubmit" size="small" class="font-size-12!">{{ t("ReceiveIncome") }}</van-button> -->
        <van-button
          :color="_item.status == 1 ? '#1BC256' : '#b5b5b5'"
          @click="handleClickSubmit"
          size="small"
          class="font-size-14! flex-1 h-36px!"
          v-if="_item.status !== 7"
          >{{ t(orderStatusEnum[_item.status]) }}</van-button
        >
        <van-button
          type="primary"
          color="#1BC256"
          v-if="_item.status == 7"
          @click="handleClickOrder(1)"
          size="small"
          class="font-size-12! flex-1 h-36px!"
          >{{ "Renewal" }}</van-button
        >
        <van-button
          type="primary"
          color="#E82C81"
          v-if="_item.status == 7"
          @click="handleClickOrder(2)"
          size="small"
          class="font-size-12! flex-1 h-36px!"
          >{{ t("Redeem") }}</van-button
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from "../enum";
import { addCommasToNumber } from "@/utils/tool";
import dayjs from "dayjs";
const router = useRouter();
const emits = defineEmits(["handleClickBtn", "handleClickOrder", ""]);
const props = defineProps({
  item: {
    type: Object as () => any,
  },
  index: {
    type: Number,
  },
  itemType: {
    type: String,
    default: "fund",
  },
});
const _item = computed(() => {
  return props.item;
});
const { t } = useI18n();
const _index = computed(() => {
  return 1;
});
const handleClickOrderDetail = () => {
  router.push(`/fund/orderDetail?id=${props.item.id}`);
};
const handleClickSubmit = () => {
  if (props.itemType == "order" && props.item.status != 1) {
    return;
  }
  if (props.itemType == "fund" && props.item.status != 1) {
    return;
  }
  let data = {
    item: props.item,
    itemType: props.itemType,
  };
  emits("handleClickBtn", data);
};
const handleClickOrder = (type: any) => {
  let data = {
    ...props.item,
    type,
  };
  emits("handleClickOrder", data);
};
const handleClickDetail = () => {
  let id = props.itemType == "fund" ? props.item.id : props.item.fundId;
  router.push(`/fund/fundDetail?id=${id}`);
};
</script>
<style lang="less" scoped>
.discont-item-content,
.order-item-content {
  // background: var(--bg);
  // border-bottom: 1px solid var(--border_color);
}

.l {
  color: #64748b;
  font-size: 16px;
  margin-bottom: 4px;
}

.v {
  font-size: 14px;

  span {
    color: #6b39f4;
  }
}
</style>
