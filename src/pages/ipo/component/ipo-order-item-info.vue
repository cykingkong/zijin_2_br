<template>
    <div class="info flex flex-col gap-12">
        <infoIteLi :item="item" :label="'数量'" :value="`${item.num}`" />
        <infoIteLi :item="item" :label="'二次发行价'" :value="`${item.assetInfo.unit} ${item.ipoInfo.productPrice}`" />
        <infoIteLi :item="item" :label="'市场价'" :value="`${item.assetInfo.unit} ${item.close}`"
            v-if="item.status == 0 || item.status == 1 || item.status == 2 || item.status == 4" />
        <!-- <infoIteLi :item="item" :label="'Income'" :value="`${item.assetInfo.unit} ${item.earnings}`"
            v-if="item.status == 1 || item.status == 2" /> -->
        <infoIteLi :item="item" :label="'Winning Rate'" :value="`${item.winRate}%`"
            v-if="item.status != 0 && item.status != 4" />
        <infoIteLi :item="item" :label="'Winning Quantity'" :value="`${item.assetInfo.unit} ${item.winNum}`"
            v-if="item.status != 0 && item.status != 4" />
        <infoIteLi :item="item" :label="'Delivered'" :value="`${item.lockAmount}%`"
            v-if="item.status != 0 && item.status != 4" />
        <!-- <infoIteLi :item="item" :label="'SDelivery Time'" :value="`${item.formatMarketTime}`" /> -->



        <!--        
        <div class="info-item">
            <span class="label">SDelivery Time</span>
            <span class="value">{{ item.rack_date_range }}</span>
        </div>
        <div class="info-item">
            <span class="label">Sale Time</span>
            <span class="value">{{ item.end_at }}</span>
        </div> -->
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
