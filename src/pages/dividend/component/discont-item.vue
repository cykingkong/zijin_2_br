<template>
    <div class="discont-item-content w-full  px-12 py-24 flex flex-col gap-20px" v-if="props.itemType == 'discount'">

        <div class="top-li flex  items-center">
            <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
                <div class="logo w-25 h-25 rounded-full overflow-hidden ">
                    <img :src="item.tradingInfo.baseAssetInfo.logo" alt=""
                        v-if="item.tradingInfo && item.tradingInfo.baseAssetInfo" class="w-full h-full">
                </div>
                <div class="name font-size-14">{{ item.tradingInfo.baseAssetInfo.symbol }}
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
            <div class="li-r font-size-16">{{ t('cycle') }}:{{ _item.dividendInfo.cycle || 0 }}{{ t('Day') }}</div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-16">{{ t('Discount') }}:{{ _item.unit }} {{
                addCommasToNumber(Number(_item.discountPrice)) }}</div>

        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-l font-size-16">{{ t('Dividend distribution ratio') }}:{{ _item.dividendInfo.totalYield }}%
            </div>
        </div>
        <div class="li flex justify-between items-center ">
            <div class="li-r font-size-16 text-no-wrap text-align-right">{{ t('Sell') }}: {{
                _item.availableQuantity }} / {{ _item.totalQuantity }} </div>
        </div>
        <div class="li flex justify-between items-center gap-12px">
            <div class="li-l w-70% flex-shrink-0 ">
                <van-progress :percentage="_item.percentage" stroke-width="8px" :show-pivot="false" />
            </div>
        </div>
        <div class="li flex justify-end">
            <van-button type="primary" @click="handleClickSubmit" size="small"
                :color="_item.status == 1 ? '#1989fa' : '#b5b5b5'" class="font-size-16!">{{
                    t(statusEnum[_item.status]) }}</van-button>
        </div>
    </div>
    <div class="order-item-content w-full px-12 py-24  font-size-16 flex flex-col gap-12px"
        v-if="props.itemType == 'order'">
        <div class="li flex items-center justify-between">
            <div class="li-l">{{ dayjs(_item.dividendInfo.startTimeEnd).format('MM/DD/YYYY') }}</div>
            <div class="li-m">——</div>
            <div class="li-r">{{ _item.dividendOrderInfo ? dayjs(_item.dividendOrderInfo?.endTime).format('MM/DD/YYYY')
                : '-'
                }}</div>
        </div>
        <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
            <div class="logo w-35 h-35 rounded-full overflow-hidden ">
                <img :src="_item.tradingInfo.logo" alt="" v-if="_item.tradingInfo" class="w-full h-full">
            </div>
            <div class="name font-size-16">{{ item.tradingInfo.baseAssetInfo.symbol }} x
                {{ _item.purchaseQuantity }}
            </div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ _item.status !=
                    3 ? t('Market price') : t('Freeze price') }}:{{ _item.assetInfo.unit }} {{ _item.status !=
                    3 ? addCommasToNumber(_item.close) : addCommasToNumber(_item.freezePrice) }} <span class="text-red-6"
                    v-if="_item.status == 3 && _item.freezeStatus == 1">({{ t('Freeze') }})</span></div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-r font-size-16">{{ t('Purchase price') }}:{{ _item.assetInfo.unit }} {{
                addCommasToNumber(_item.discountPrice)
            }}
            </div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('yield rate') }}: <span :class="_item.earningRate >= 0 ? 'up' : 'down'">{{ _item.earningRate }}%
                </span></div>

        </div>
        <div class="li flex justify-between ">

            <div class="li-r font-size-16"> {{ t('yield') }}:{{ _item.assetInfo.unit }} {{
                _item.earnings }}</div>
        </div>
        <div class="li flex justify-between ">
            <div class="li-l font-size-16">
                {{ t('Give dividends') }}:{{ _item.assetInfo.unit }} {{ _item.giftDividend }}</div>

        </div>
        <div class="li flex  items-center gap-24 justify-end">
            <van-button type="primary" v-if="_item.freezeStatus == 1 && _item.status == 1" :color="'#1989fa'"
                @click="handleClickFreeze" class="font-size-16!">{{
                    t('Freeze') }}</van-button>
            <van-button type="primary" :color="_item.saleStatus == 1 ? '#1989fa' : '#b5b5b5'" @click="handleClickSubmit"
                class="font-size-16!">{{
                    t(orderStatusEnum[_item.saleStatus]) }}</van-button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from '../enum'
import Kline from '@/components/Kline.vue';
import { addCommasToNumber } from '@/utils/tool'
import { showToast, showSuccessToast, allowMultipleToast } from "vant";
import { discountOrderFreeze } from '@/api/bond'
import dayjs from 'dayjs'
import vw from '@/utils/inline-px-to-vw'
const emits = defineEmits(['handleClickBtn', 'reloadOrderList'])
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
    if (props.itemType == 'discount' && _item.value.status != 1) {
        return
    }
    if (props.itemType == 'order' && _item.value.saleStatus != 1) {
        return
    }
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
const handleClickFreeze = async () => {
    if (_item.value.freezeStatus == 1 && _item.value.status != 3) {


        const { data, code } = await discountOrderFreeze({ id: _item.value.id })
        if (code == 200) {
            console.log(code, data)
            showSuccessToast({
                zIndex: 10001,
            });
            emits('reloadOrderList', true)

        }
    }
}
</script>
<style lang="less" scoped>
.discont-item-content,
.order-item-content {
    // background: var(--bg);
    border-bottom: 1px solid var(--border_color);
}
</style>
