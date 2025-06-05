<template>
  <div class="info flex flex-col gap-12">
    <infoIteLi
      :item="item"
      :label="t('Increase (share)')"
      :value="`${item.assetInfo.unit || ''} ${item.productPrice || ''}`"
      v-if="item.assetInfo"
    />
    <infoIteLi
      :item="item"
      :label="t('Market price (share)')"
      :value="`${item.assetInfo.unit}${item.listPriceBegin || ''} ~ ${
        item.assetInfo.unit || ''
      }${item.listPriceEnd || ''}`"
      v-if="item.assetInfo"
    />
    <infoIteLi
      :item="item"
      :label="t('Total Sales (Share)')"
      :value="`${item.totalNum || ''}`"
    />
    <infoIteLi
      :item="item"
      :label="t('Subscription time')"
      :value="`${item.formatSubTimeBegin || ''} ~ ${
        item.formatSubTimeEnd || ''
      }`"
    />
    <infoIteLi
      :item="item"
      :label="t('Delivery time')"
      :value="`${item.formatWonTimeBegin || ''} ~ ${
        item.formatWonTimeEnd || ''
      }`"
    />
    <infoIteLi
      :item="item"
      :label="t('Sales period')"
      :value="`${item.formatMarketTime || ''}`"
    />
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
.li {
}
</style>
