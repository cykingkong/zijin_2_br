<template>
    <div class="discont-item-content w-full  px-12 py-24 flex flex-col gap-20px" v-if="props.itemType == 'discount'">
        <div class="top-li flex  items-center">
            <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
                <div class="logo w-25 h-25 rounded-full overflow-hidden ">
                    <img :src="item.tradingInfo.baseAssetInfo.logo" alt=""
                        v-if="item.tradingInfo && item.tradingInfo.baseAssetInfo" class="w-full h-full">
                </div>
                <div class="name font-size-14">{{ item.tradingInfo.baseAssetInfo.symbol }}</div>
            </div>
            <div class="c w-150 flex-shrink-0 flex justify-center">
                <KlineSvg :nameId="'myChart10' + _index" :areaStyle="true" :increase="_item.increase"
                    :data="_item.price" :height="vw(30)" :width="vw(100)"></KlineSvg>
            </div>
            <div class="r flex flex-1 flex-shrink-0 justify-end">{{ _item.unit }} {{ _item.close || '-' }}</div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-14">{{ t('Discount rate') }}:{{ _item.discountRate }}%</div>
            <div class="li-r font-size-14">{{ t('cycle') }}:{{ _item.diffDay }} {{ t('Day') }}</div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-16">{{ t('Discount') }}:{{ _item.unit }} {{ _item.discountPrice }}</div>
        </div>
        <div class="li flex justify-between items-center gap-12px">
            <div class="li-l w-70%">
                <van-progress :percentage="_item.percentage" stroke-width="8px" :show-pivot="false" />
            </div>
            <div class="li-r font-size-16 text-no-wrap text-align-right">{{ t('Sell') }}:{{ _item.percentage }}%</div>

        </div>
        <div class="li flex justify-end">
            <van-button type="primary" @click="handleClickSubmit" class=" font-size-16!">{{
                t(statusEnum[_item.status]) }}</van-button>
        </div>
    </div>
    <div class="order-item-content w-full px-12 py-24  font-size-16 flex flex-col gap-12px"
        v-if="props.itemType == 'order'">
        <div class="li flex items-center justify-between">
            <div class="li-l">{{ dayjs(_item.createdAt).format('YYYY-MM-DD') }}</div>
            <div class="li-m">——</div>
            <div class="li-r">{{ dayjs(_item.saleEndTime).format('YYYY-MM-DD') }}</div>
        </div>
        <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
            <div class="logo w-35 h-35 rounded-full overflow-hidden ">
                <img :src="_item.tradingInfo.logo" alt="" v-if="_item.tradingInfo" class="w-full h-full">
            </div>
            <div class="name font-size-16">{{ _item.tradingInfo.baseAssetInfo.symbol }} x {{ _item.purchaseQuantity }}
            </div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('Market price') }}:{{ _item.unit }} {{ _item.purchasePrice }}</div>
            <div class="li-r font-size-16">{{ t('Purchase price') }}:{{ _item.unit }} {{ _item.discountPrice }}</div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('yield rate') }}:{{ _item.unit }} {{ _item.earningRate }}%</div>
            <div class="li-r font-size-16">{{ t("yield") }}:{{ _item.unit }} {{
                _item.earnings }}</div>
        </div>
        <div class="li flex justify-end">
            <van-button type="primary" :disabled="_item.status == 2"
                :color="_item.saleStatus != 1 ? '#1989fa' : '#b5b5b5'" @click="handleClickSubmit"
                class="font-size-16! ">{{
                    t(orderStatusEnum[_item.status]) }}</van-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from '../enum'
import KlineSvg from '@/components/KlineSvg.vue';
import dayjs from 'dayjs'
import vw from '@/utils/inline-px-to-vw'
const emits = defineEmits(['handleClickBtn'])
const props = defineProps({
    item: {
        type: Object as () => any,
    },
    index: {
        type: Number
    },
    itemType: {
        type: String,
        default: 'discount'
    }
})
const { t } = useI18n()
const _item = computed(() => {
    return props.item
})
const _index = computed(() => {
    return 1

})
const handleClickSubmit = () => {
    let data = {
        item: props.item,
        itemType: props.itemType
    }
    emits('handleClickBtn', data)
}


</script>
<style lang="less" scoped>
.discont-item-content,
.order-item-content {
    // background: var(--bg);
    border-bottom: 1px solid var(--border_color);
}
</style>
