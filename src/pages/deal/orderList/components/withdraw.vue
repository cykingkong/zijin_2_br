<template>
  <div class="withdraw px-12 py-20px">
    <div class="li flex items-center">
      <div class="label text-blueGray-400">{{ t("Withdrawal time") }}:</div>
      <div class="value">{{ item.createdAt }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Withdrawal amount") }}:</div>
      <div class="value">{{ item.symbol }} {{ item.amount }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Withdrawal fee") }}:</div>
      <div class="value">{{ item.symbol }} {{ item.fee }}</div>
    </div>
    <div class="li flex items-center" v-if="item.content">
      <div class="text-blueGray-400 label">
        {{ t("Reason for rejection") }}:
      </div>
      <div class="value">{{ item.content }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Withdrawal status") }}:</div>
      <div class="value">{{ t(withdrawEnum[item.status]) }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const { proxy } = getCurrentInstance()!;
const props = defineProps({
  item: Object,
});
const withdrawEnum = {
  0: "Under review",
  1: "Approved",
  2: "Dismissed",
};
</script>
<style lang="less" scoped>
.withdraw {
  border-bottom: 1px solid var(--border_color);
}
.li {
  gap: 14px;
  justify-content: space-between;
  line-height: 30px;
  .value {
    text-align: right;
  }
}
</style>
