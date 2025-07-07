<template>
  <div class="tab-table-table-page px-12 py-12 pb-60px">
    <div class="th font-size-14px flex flex-items-center text-align-center font-500">
      <div class="th-item px-12" :class="index == 0
          ? 'w-100 flex-shrink-0 text-align-left'
          : 'flex-1 flex-shrink-0 max-w-92px'
        " v-for="(item, index) in props.tableTh" :key="index">
        {{ t(item) }}
      </div>
    </div>
    <block v-if="props.tdType === 1">
      <div class="td font-size-14px flex flex-items-center text-align-center font-extralight py-12"
        v-for="(e, index) in props.tableData" :key="index">
        <div class="td-item w-100 flex-shrink-0 text-align-left">
          <div class="title mb-12">{{ e.symbol_name }}</div>
          <div class="title font-size-11 text-coolGray">
            {{ dayjs(e.createdAt).format("MM/DD/YYYY") }}
          </div>
        </div>
        <div class="td-item flex-1">
          <div class="mb-4">{{ e.entrustPrice }}</div>
          <div class="title font-size-11 text-coolGray">
            {{ e.direction }}
          </div>
        </div>
        <div class="td-item flex-1">
          <div>{{ e.amount }}</div>
        </div>
        <div class="td-item flex-1">
          <van-button type="primary" class="order-btn border-none h-54 lh-54 cancel-btn" @click.stop="cancelSingle(e)">
            {{ $t("Cancel order") }}</van-button>
        </div>
      </div>
      <Empty v-if="props.tableData.length === 0" :no-tips="true"></Empty>
      <LoadMore :status="orderLoadStatus0" @load-more="loadMore"></LoadMore>
    </block>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import LoadMore from "@/components/LoadMore.vue";
import dayjs from "dayjs";
const emits = defineEmits(["loadMore", "cancelOrder"]);
const loadMore = () => {
  emits("loadMore");
};

const { t } = useI18n();
const props = defineProps({
  tableTh: {
    type: Array,
    default: () => [],
  },
  tableData: {
    type: Array,
    default: () => [1],
  },
  tdType: {
    type: Number,
    default: 1,
  },
  orderLoadStatus0: {
    type: Number,
    default: 0,
  },
});

const cancelSingle = (orderItem) => {
  // 撤单
  let params = {
    ...orderItem,
    type: "status1",
  };
  emits("cancelOrder", params);
};
</script>
<style lang="less" scoped>
.th {
  color: #747a8f;
}

.td {
  border-bottom: 1px solid #747a8f;
}

.th-item {
  word-break: break-all;
}
</style>
