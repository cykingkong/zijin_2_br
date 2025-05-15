<template>
    <div class="hold-page px-12 pt-12">
        <!-- <div class="title font-size-18">港股账户</div> -->
        <div class="title font-size-16 my-12">{{ userPositionData }} ({{ userPositionData.symbolId }})</div>

        <div class="flex line font-size-14 mb-12">
            <div class="line-item flex-1">
                <div class="item-title">持有数量</div>
                <div class="item-value">{{ userPositionData.userAssetsAmount }}</div>
            </div>
            <div class="line-item flex-1">
                <div class="item-title">平均价格</div>
                <div class="item-value">{{ userPositionData.currency }} {{ userPositionData.averagePrice }}</div>
            </div>
            <div class="line-item flex-1">
                <div class="item-title">当前价格</div>
                <div class="item-value">{{ userPositionData.currency }} {{ userPositionData.close || 0 }}</div>
            </div>
        </div>
        <div class="flex line  font-size-14 ">
            <div class="line-item flex-1">
                <div class="item-title">当前盈率</div>
                <div class="item-value">{{ userPositionData.currency }} {{ userPositionData.profit || 0 }} {{
                    userPositionData.ProfitPercent || 0 }}%</div>
            </div>
            <div class="line-item flex-1">
                <div class="item-title">总价值</div>
                <div class="item-value">{{ userPositionData.currency }}{{ userPositionData.allclose || 0 }}</div>
            </div>
            <div class="line-item flex-1">
            </div>
        </div>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!

const props = defineProps({
    userPositionData: {
        default: () => { }
    }
})


</script>
<style lang="less" scoped></style>
