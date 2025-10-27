<template>
  <div class="info flex p-8  gap-0 w-full rounded-6px bg-#F8F9FD ">
    <slot name="left">
      <div class="flex-1">
        <div class="label color-#64748B font-size-18px ">发行价</div>
        <div class="price color-#6B39F4 font-bold font-size-16px">$1.5</div>
      </div>
    </slot>
    <slot name="center">
      <div class="flex-1 text-center">
        <div class="label color-#64748B font-size-18px text-center">上市价</div>
        <div class="price color-#6B39F4 font-bold font-size-16px">$1.5</div>
      </div>
    </slot>
    <slot name="right">
      <div class="flex-1 text-right">
        <div class="label color-#64748B font-size-18px ">上市时间</div>
        <div class="price color-#0F172A font-bold font-size-16px">$1.5</div>
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
