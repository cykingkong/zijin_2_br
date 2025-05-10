<template>
    <div class="info flex flex-col gap-12">
        <infoIteLi :item="item" :label="'涨价(份额)'" :value="`${item.assetInfo.unit} ${item.productPrice}`" />
        <infoIteLi :item="item" :label="'市场价(份额)'"
            :value="`${item.assetInfo.unit}${item.listPriceBegin} ~ ${item.assetInfo.unit}${item.listPriceEnd}`" />
        <infoIteLi :item="item" :label="'总销售额(份额)'" :value="`${item.totalNum}`" />
        <infoIteLi :item="item" :label="'订阅时间'" :value="`${item.formatSubTimeBegin} ~ ${item.formatSubTimeEnd}`" />
        <infoIteLi :item="item" :label="'发货时间'" :value="`${item.formatWonTimeBegin} ~ ${item.formatWonTimeEnd}`" />
        <infoIteLi :item="item" :label="'销售时间'" :value="`${item.formatMarketTime}`" />
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import infoIteLi from './info-item-li.vue'
const props = defineProps({
    item: {
        type: Object as () => any,
    },
})


</script>
<style lang="less" scoped>
.li {}
</style>
