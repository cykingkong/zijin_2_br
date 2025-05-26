<template>
    <div class="hold-page px-12 pt-12">
        <!-- <div class="title font-size-18">港股账户</div> -->
        <div class="title font-size-16 my-12 font-size-18">{{ userPositionData.symbol }} ({{ userPositionData.symbolId
        }})</div>

        <div class="flex line font-size-16 mb-12 line-height-28">
            <div class="line-item flex-1">
                <div class="item-title">持有数量</div>
                <div class="item-value">{{ userPositionData.userAssetsAmount }}</div>
            </div>
            <div class="line-item flex-1 text-align-center">
                <div class="item-title">平均价格</div>
                <div class="item-value">{{ userPositionData.currency }} {{ userPositionData.averagePrice }}</div>
            </div>
            <div class="line-item flex-1 text-align-right">
                <div class="item-title">当前价格</div>
                <div class="item-value">{{ userPositionData.currency }} {{ userPositionData.close || 0 }}</div>
            </div>
        </div>
        <div class="flex line  font-size-16 line-height-28">
            <div class="line-item flex-1">
                <div class="item-title">当前盈率</div>
                <div class="item-value whitespace-nowrap">{{ userPositionData.currency }} {{ userPositionData.profit ||
                    0 }} ({{
                        userPositionData.ProfitPercent || 0 }}%)</div>
            </div>
            <div class="line-item flex-1">
            </div>
            <div class="line-item flex-1 text-align-right">
                <div class="item-title">总价值</div>
                <div class="item-value">{{ userPositionData.currency }}{{ userPositionData.allclose || 0 }}</div>
            </div>

        </div>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { useStore } from '@/stores/modules/index';

const { proxy } = getCurrentInstance()
const store = useStore()
const props = defineProps({
    userPositionData: {
        default: {},
    }
})
const _data = ref({})

watch(() => store.getklineList, (newV) => {
    if (newV && props.userPositionData) {
        let listItem = newV.find(item => item.tradingId == props.userPositionData.tradingPairsId)
        if (listItem) {
            console.log(listItem, 'listItem')
            props.userPositionData.close = listItem.tick.close
            props.userPositionData.allclose = (listItem.tick.close * (props.userPositionData.userAssetsAmount)).toFixed(2)
            props.userPositionData.ProfitPercent = Number(props.userPositionData.allclose) ? ((listItem.tick.close - props.userPositionData.averagePrice) * props.userPositionData.userAssetsAmount / (props.userPositionData.allclose) * 100).toFixed(2) : 0
            props.userPositionData.profit = ((listItem.tick.close - props.userPositionData.averagePrice) * props.userPositionData.userAssetsAmount).toFixed(2)
            console.log(props.userPositionData, 'props.userPositionData')
        }
    }
})


</script>
<style lang="less" scoped>
.item-value {
    font-size: 14px;
}
</style>
