<template>
  <div class="recharge p-12">
    <div class="li flex items-center">
      <div class="label text-blueGray-400">{{ t("Top-up time") }}:</div>
      <div class="value">{{ dayjs(item.createdAt).format("MM/DD/YYYY HH:mm:ss") }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Top-up amount") }}:</div>
      <div class="value">{{ item.symbol }} {{ item.amount }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">
        {{ t("Actual credited amount") }}:
      </div>
      <div class="value">{{ item.symbol }} {{ item.actualAmount }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Top-up Currency") }}:</div>
      <div class="value">{{ item.assetId == 198 ? "BRL" : "USD" }}</div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Top-up type") }}:</div>
      <div class="value">
        {{ item.methodName }}
      </div>
    </div>
    <div class="li flex items-center">
      <div class="text-blueGray-400 label">{{ t("Top-up status") }}:</div>
      <div class="value">{{ rechargeEnum[item.status] }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import dayjs from 'dayjs'
const { t } = useI18n();
const { proxy } = getCurrentInstance()!;
const props = defineProps({
  item: Object,
});
const methodType = {
  crypto: "数字货币",
  bank_card: t("bankCard"),
};
const rechargeEnum = {
  0: t("Processing payment"),
  1: t("Payment timeout"),
  2: t("Paid"),
};
</script>
<style lang="less" scoped>
.recharge {
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
