<template>
  <div class="info flex flex-col p-8  gap-12 w-full rounded-6px bg-#F8F9FD ">
    <slot name="left">
      <div class="flex-1">
        <div class="label color-#64748B font-size-18px ">{{ t("Issue Price") }}</div>
        <div class="price color-#6B39F4 font-bold font-size-16px">${{ item.product_price }}</div>
      </div>
    </slot>
    <slot name="center">
      <div class="flex-1 ">
        <div class="label color-#64748B font-size-18px ">{{ t("Listing Price") }}</div>
        <div class="price color-#6B39F4 font-bold font-size-16px">${{ item.list_price_begin }} ~ ${{ item.list_price_end}}</div>
      </div>
    </slot>
    <slot name="right">
      <div class="flex-1 ">
        <div class="label color-#64748B font-size-18px ">{{ t("Listing Date") }}</div>
        <div class="price color-#0F172A font-bold font-size-16px">{{ item.market_time }}</div>
      </div>
    </slot>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import infoIteLi from "./info-item-li.vue";
const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object as () => any,
  },
});
</script>
<style lang="less" scoped>
.price {
  margin-top: 4px;
}
</style>
