<template>
    <div class="discont-item-content w-full  px-12 py-24 flex flex-col gap-20px" v-if="props.itemType == 'discount'">

        <div class="top-li flex  items-center">
            <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
                <div class="logo w-25 h-25 rounded-full overflow-hidden ">
                    <img :src="item.tradingInfo.baseAssetInfo.logo" alt=""
                        v-if="item.tradingInfo && item.tradingInfo.baseAssetInfo" class="w-full h-full">
                </div>
                <div class="name font-size-14">{{ item.tradingInfo.baseAssetInfo.symbol }}({{ item.dividendInfo.name }})
                </div>
            </div>
            <div class="c w-150 flex-shrink-0 flex justify-center">
                <Kline :nameId="'myChart10' + item.tradingPairsId" :areaStyle="true" :increase="_item.increase"
                    :data="_item.price" :height="vw(30)" :width="vw(100)"></Kline>
            </div>
            <div class="r text-nowrap flex flex-1 flex-shrink-0 justify-end">{{ _item.unit }} {{
                addCommasToNumber(_item.close) || '-' }}
            </div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-16">{{ t('Discount Rate') }}:{{ _item.discountRate }}%</div>
            <div class="li-r font-size-16">{{ t('cycle') }}:{{ _item.diffDay }}{{ t('Day') }}</div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-16">{{ t('Discount') }}:{{ _item.unit }} {{
                addCommasToNumber(Number(_item.discountPrice)) }}</div>

        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-16">{{ t('Dividend distribution ratio') }}:{{ _item.dividendInfo.totalYield }}%
            </div>
        </div>
        <div class="li flex justify-between items-center gap-12px">
            <div class="li-l w-70% flex-shrink-0 ">
                <van-progress :percentage="_item.percentage" stroke-width="8px" :show-pivot="false" />
            </div>
            <div class="li-r font-size-16 text-no-wrap text-align-right">{{ t('Sell') }}:{{ _item.percentage }}%</div>
        </div>
        <div class="li flex justify-end">
            <van-button type="primary" @click="handleClickSubmit" size="small" class="font-size-16!">{{
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
            <div class="name font-size-16">{{ item.tradingInfo.baseAssetInfo.symbol }}({{ item.dividendInfo.name }}) x
                {{ _item.purchaseQuantity }}
            </div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('Market price') }}:{{ _item.assetInfo.unit }} {{ addCommasToNumber(_item.close) }}</div>
            <div class="li-r font-size-16">{{ t('Purchase price') }}:{{ _item.assetInfo.unit }} {{
                addCommasToNumber(_item.purchasePrice)
                }}
            </div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('yield rate') }}:{{ _item.earningRate }}%</div>
            <div class="li-r font-size-16"> {{ t('yield') }}:{{ _item.assetInfo.unit }} {{
                _item.earnings }}</div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('Give dividends') }}:{{ _item.assetInfo.unit }} {{ _item.giftDividend }}</div>

        </div>
        <div class="li flex justify-between items-center">
            <div class="li-l"></div>
            <van-button type="primary" :color="_item.saleStatus == 1 ? '#1989fa' : '#b5b5b5'" @click="handleClickSubmit"
                class="font-size-16! w-100px!">{{
                    t(orderStatusEnum[_item.saleStatus]) }}</van-button>
        </div>


    </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from '../enum'
import Kline from '@/components/Kline.vue';
import { addCommasToNumber } from '@/utils/tool'
import dayjs from 'dayjs'
import vw from '@/utils/inline-px-to-vw'
const emits = defineEmits(['handleClickBtn'])
const { t } = useI18n()
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
const _item = computed(() => {

    return props.item
})
const _index = computed(() => {
    return props.index

})
const handleClickSubmit = () => {
    let data = {
        item: props.item,
        itemType: props.itemType
    }
    emits('handleClickBtn', data)
}
const router = useRouter()
function onBack() {
    if (window.history.state.back)
        history.back()
    else
        router.replace('/')
}

</script>
<style lang="less" scoped>
.discont-item-content,
.order-item-content {
    // background: var(--bg);
    border-bottom: 1px solid var(--border_color);
}
</style>
