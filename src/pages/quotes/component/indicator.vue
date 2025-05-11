<template>
    <div class="indicator-rank-content w-full flex gap-8px px-12">
        <div class="rank-item flex flex-1 flex-col rounded-10px gap-4 px-12px py-6" v-for="(item, index) in _list"
            :key="index">
            <div class=" title-box flex items-center font-size-12 gap-4px">
                <div class="dot w-6px h-6px rounded-full bg-[#0091FF]"></div>
                <!-- {{ item.tradingInfo.baseAssetInfo ? item.tradingInfo.baseAssetInfo.symbol : '-' }} -->
            </div>
            <div class="num font-size-14 font-500">100</div>
            <div class="precent font-size-10 " :class="{ 'down': item.dayIncrease > 0, 'up': item.dayIncrease <= 0 }">
                {{ item.dayIncrease }}%</div>
        </div>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const props = defineProps({
    list: {
        type: Array,
        default: () => []
    }
})
const _list = computed(() => {
    return props.list.map((item, index) => {
        return item
    })
})


</script>
<style lang="less" scoped>
.rank-item {
    border: 1px solid #0091FF;
    flex: 1;
    max-width: 33%;
}
</style>
