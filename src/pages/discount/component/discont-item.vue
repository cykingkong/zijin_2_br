<template>
    <div>
        <div class="discont-item-content w-full  px-12 py-24 flex flex-col gap-20px rounded-12px border-#E2E8F0 border-solid border-1px mb-29px"
            v-if="props.itemType == 'discount'" @click="handleClickItem">
            <div class="top-li flex  items-center">
                <div class="l flex flex-[2] flex-shrink-0 items-center gap-6 h-40">
                    <div class="logo w-40 h-40 rounded-full overflow-hidden ">
                        <img :src="item.tradingInfo.baseAssetInfo.logo" alt=""
                            v-if="item.tradingInfo && item.tradingInfo.baseAssetInfo" class="w-full h-full">
                    </div>
                    <div class="name flex flex-col justify-between font-size-14px color-#0F172A font-700 h-40">
                        <div class=" n">
                            {{ item.tradingInfo.baseAssetInfo.symbol }}
                        </div>
                        <div class="name2 text-12px color-#64748B font-400">
                            {{ item.tradingInfo.baseAssetInfo.expName }}
                        </div>
                    </div>
                </div>
                <div class="r text-nowrap flex-shrink-0 justify-end text-align-right">
                    <Kline :nameId="'myChart10' + item.tradingPairsId" :areaStyle="true" :increase="_item.increase"
                        :data="_item.price" :height="vw(30)" :width="vw(100)"></Kline>
                    <div class="price "
                        :class="{ 'color-#1DCE5C': _item.increase >= 0, 'color-#E11D48': _item.increase < 0 }"> {{
                            _item.unit
                        }} {{ _item.close || '-' }}</div>
                </div>
            </div>
            <div class="discountDivider w-full h-1px bg-#EBECEF mt-16px mb-12px"></div>

            <div class="li flex justify-between items-center ">
                <div class="li-l font-size-18 flex flex-col gap-4px">

                    <div class="rate font-size-16 text-#64748B">
                        {{ _item.discountRate }}%
                    </div>
                    <div class="price text-#0F172A font-700">
                        {{ _item.unit }} {{ _item.discountPrice }}
                    </div>
                    <div class="price2 text-#00000033 font-700 font-size-14">
                        {{ _item.discountPrice }}
                    </div>
                </div>
                <div class="li-r font-size-14 text-align-right  flex flex-col gap-4px">
                    <div class="label text-#64748B font-size-14px">可抛售时间</div>
                    <div class="label text-#0F172A font-size-18px font-700">06/07</div>
                </div>
            </div>

            <!-- <div class="li flex justify-end">
            <van-button type="primary" @click="handleClickSubmit" :color="_item.status == 1 ? '#1989fa' : '#b5b5b5'"
                class=" font-size-16!">{{
                    t(statusEnum[_item.status]) }}</van-button>
        </div> -->
        </div>
        <div class="order-item-content bg-#F9FAFB w-full px-12 py-24  font-size-16 flex flex-col gap-12px rounded-12px border-#E2E8F0 border-solid border-1px"
            v-if="props.itemType == 'order'">
            <div class="top-li flex  items-center">
                <div class="l flex flex-[2] flex-shrink-0 items-center gap-6 h-40">
                    <div class="logo w-40 h-40 rounded-full overflow-hidden ">
                        <img :src="item.tradingInfo.baseAssetInfo.logo" alt=""
                            v-if="item.tradingInfo && item.tradingInfo.baseAssetInfo" class="w-full h-full">
                    </div>
                    <div class="name flex flex-col justify-between font-size-14px color-#0F172A font-700 h-40">
                        <div class=" n">
                            {{ item.tradingInfo.baseAssetInfo.symbol }}
                        </div>
                        <div class="name2 text-12px color-#64748B font-400">
                            {{ item.tradingInfo.baseAssetInfo.expName }}
                        </div>
                    </div>
                </div>
                <div class="r text-nowrap flex-shrink-0 justify-end text-align-right">

                    <div class="num up text-14px">+ {{ item.purchaseQuantity }}</div>
                    <div class="num  color-#6B7280 text-12px">数量</div>
                </div>
            </div>
            <div class="discountDivider w-full h-1px bg-#EBECEF mt-16px mb-12px"></div>
            <div class="tag-box flex items-center justify-between gap-8px mb-20px">
                <!-- 第一个标签：红色主题 -->
                <div class="tag-item flex items-center gap-4px px-12px py-6px rounded-full bg-#FFF0F0">
                    <div class="icon w-16px h-16px flex items-center justify-center">
                        <svg width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.16956 1.3335H5.83042C3.62505 1.3335 2.52236 1.3335 1.83724 2.01691C1.36552 2.48746 1.21859 3.15548 1.17283 4.24402C1.16375 4.45989 1.15921 4.56783 1.19952 4.63984C1.23983 4.71186 1.40076 4.80173 1.72262 4.98146C2.08007 5.18108 2.3217 5.56247 2.3217 6.00016C2.3217 6.43785 2.08007 6.81925 1.72262 7.01886C1.40077 7.1986 1.23983 7.28847 1.19952 7.36048C1.15921 7.43249 1.16375 7.54043 1.17283 7.7563C1.21859 8.84485 1.36552 9.51286 1.83724 9.98341C2.52236 10.6668 3.62505 10.6668 5.83042 10.6668H8.16956C10.3749 10.6668 11.4776 10.6668 12.1627 9.98341C12.6345 9.51286 12.7814 8.84485 12.8272 7.7563C12.8362 7.54043 12.8408 7.43249 12.8005 7.36048C12.7601 7.28847 12.5992 7.1986 12.2774 7.01886C11.9199 6.81925 11.6783 6.43785 11.6783 6.00016C11.6783 5.56247 11.9199 5.18108 12.2774 4.98146C12.5992 4.80173 12.7601 4.71186 12.8005 4.63984C12.8408 4.56783 12.8362 4.45989 12.8272 4.24402C12.7814 3.15548 12.6345 2.48746 12.1627 2.01691C11.4776 1.3335 10.3749 1.3335 8.16956 1.3335Z"
                                stroke="#F14437" stroke-width="1.5" />
                        </svg>

                    </div>
                    <span class="text-#DC3232 font-size-14px font-500">30%</span>
                </div>

                <!-- 分隔点 -->
                <div class="separator-dot w-4px h-4px rounded-full bg-#CCCCCC"></div>

                <!-- 第二个标签：橙色主题 -->
                <div class="tag-item flex items-center gap-4px px-12px py-6px rounded-full bg-#FFF5E6">
                    <div class="icon w-16px h-16px flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_23_1001)">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M7.00002 1.60425C4.01998 1.60425 1.60419 4.02004 1.60419 7.00008C1.60419 9.98012 4.01998 12.3959 7.00002 12.3959C9.98006 12.3959 12.3959 9.98012 12.3959 7.00008C12.3959 4.02004 9.98006 1.60425 7.00002 1.60425ZM0.729187 7.00008C0.729187 3.5368 3.53673 0.729248 7.00002 0.729248C10.4633 0.729248 13.2709 3.5368 13.2709 7.00008C13.2709 10.4634 10.4633 13.2709 7.00002 13.2709C3.53673 13.2709 0.729187 10.4634 0.729187 7.00008ZM7.00002 4.22925C7.24164 4.22925 7.43752 4.42512 7.43752 4.66675V6.81886L8.76771 8.14906C8.93857 8.31991 8.93857 8.59692 8.76771 8.76777C8.59686 8.93863 8.31985 8.93863 8.14899 8.76777L6.69066 7.30944C6.60861 7.22739 6.56252 7.11611 6.56252 7.00008V4.66675C6.56252 4.42512 6.7584 4.22925 7.00002 4.22925Z"
                                    fill="#F79008" />
                            </g>
                            <defs>
                                <clipPath id="clip0_23_1001">
                                    <rect width="14" height="14" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>

                    </div>
                    <span class="text-#FF8C00 font-size-14px font-500">2h : 15m</span>
                </div>

                <!-- 分隔点 -->
                <div class="separator-dot w-4px h-4px rounded-full bg-#CCCCCC"></div>

                <!-- 第三个标签：绿色主题 -->
                <div class="tag-item flex items-center gap-4px px-12px py-6px rounded-full bg-#E6FFF0">
                    <div class="icon w-16px h-16px flex items-center justify-center">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.5 14.0001C11.8137 14.0001 14.5 11.3138 14.5 8.00012C14.5 4.68641 11.8137 2.00012 8.5 2.00012C5.18629 2.00012 2.5 4.68641 2.5 8.00012C2.5 11.3138 5.18629 14.0001 8.5 14.0001Z"
                                stroke="#079455" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M8.49998 5.3335L5.83331 8.00016M8.49998 5.3335V10.6668M11.1666 8.00016L8.49998 5.3335"
                                stroke="#079455" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>
                    <span class="text-#32B464 font-size-14px font-500">32.0%</span>
                </div>
            </div>

            <div class="li flex justify-between gap-24px">
                <div class="li-l font-size-16 text-#717680">
                    {{ t('Market price') }}
                </div>
                <div class="li-r ">
                    {{ _item.assetInfo.unit }} {{ _item.status == 1 ?
                        addCommasToNumber(_item.purchasePrice) : addCommasToNumber(_item.salePrice) }}
                </div>
            </div>
            <div class="li flex justify-between gap-24px">
                <div class="li-l font-size-16 text-#717680">{{ t('买入价') }}</div>
                <div class="li-r ">
                    {{ _item.assetInfo.unit }} {{
                        _item.discountPrice }}
                </div>
            </div>

            <div class="li flex justify-between gap-24px">
                <div class="li-l font-size-16 text-align-right text-#717680">{{ t("yield") }}</div>

                <div class="li-r">
                    {{ _item.assetInfo.unit }} {{
                        _item.earnings }}
                </div>
            </div>
            <!-- <div class="li flex justify-end">
                <van-button type="primary" :color="_item.status == 1 ? '#1989fa' : '#b5b5b5'" @click="handleClickSubmit"
                    class="font-size-16!">{{
                        t(orderStatusEnum[_item.status]) }}</van-button>
            </div> -->
        </div>
    </div>

</template>
<script setup lang="ts">
import { statusEnum, orderStatusEnum } from '../enum'
import { addCommasToNumber } from '@/utils/tool'

import Kline from '@/components/Kline.vue';
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
const router = useRouter()
const handleClickItem = () => {
    localStorage.setItem('dataInfo', JSON.stringify(_item.value))
    router.push({
        path: "/buy"
    }
    )
}
const handleClickSubmit = () => {
    if (props.itemType == 'discount' && _item.value.status != 1) {
        return
    }
    if (props.itemType == 'order' && _item.value.status != 1) {
        return
    }
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
    // border-bottom: 1px solid var(--border_color);
}

.li-r {
    color: #181D27;
}
</style>
