<template>
    <div>
        <div class="discont-item-content w-full overflow-hidden   flex flex-col mb-29px border-bottom"
            v-if="props.itemType == 'discount'" @click="handleClickItem">
            <div class="top-li flex  items-center relative">
                <div class="mark absolute top-0 left-0 w-full h-full z-10"></div>
                <miniChart :exchange="item.full_name" :symbol="item.tradingview_name" :chartId="item.id + ''">
                </miniChart>
            </div>
            <div class="top-li flex  items-center" v-if="false">
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
            <!-- <div class="discountDivider w-full h-1px bg-#EBECEF mt-16px mb-12px"></div> -->

            <div class="li pt-20px pb-24 li-x-border flex justify-between items-center  px-12  li-border">
                <div class="li-l font-size-18 flex flex-col gap-4px">

                    <div class="rate font-size-16 text-#64748B">
                        {{ _item.discount_rate }}%
                    </div>
                    <div class="price text-#0F172A font-700">
                        MX$ {{ _item.price }}
                    </div>

                </div>
                <div class="li-r font-size-14 text-align-right  flex flex-col gap-4px">
                    <div class="label text-#64748B font-size-14px">可抛售时间</div>
                    <div class="label text-#0F172A font-size-18px font-700">{{ item.sale_end_time }}</div>
                </div>
            </div>

            <!-- <div class="li flex justify-end">
            <van-button type="primary" @click="handleClickSubmit" :color="_item.status == 1 ? '#1989fa' : '#b5b5b5'"
                class=" font-size-16!">{{
                    t(statusEnum[_item.status]) }}</van-button>
        </div> -->
        </div>
        <div class="order-item-content bg-#F9FAFB w-full px-12 py-24  font-size-16 flex flex-col gap-12px rounded-12px border-#E2E8F0 border-solid border-1px mb-29px"
            v-if="props.itemType == 'order'">
            <div class="top-li flex  items-center">
                <div class="l flex flex-[2] flex-shrink-0 items-center gap-16 h-40">
                    <div class="logo w-40 h-40 rounded-full overflow-hidden ">
                        <img :src="item.logo" alt="" v-if="item.logo" class="w-full h-full">
                    </div>
                    <div class="name flex flex-col justify-center font-size-14px color-#0F172A font-700 h-40">
                        <div class=" n">
                            {{ item.symbol || '' }}
                        </div>
                        <!-- <div class="name2 text-12px color-#64748B font-400">
                            {{ item.expName || '2' }}
                        </div> -->
                    </div>
                </div>
                <div class="r text-nowrap flex-shrink-0 justify-end text-align-right">

                    <div class="num up text-14px">+ {{ item.quantity }}</div>
                    <div class="num  color-#6B7280 text-12px">数量</div>
                </div>
            </div>
            <div class="discountDivider w-full h-1px bg-#EBECEF mt-16px mb-12px"></div>
            <div class="tag-box flex items-center justify-between gap-8px mb-20px">
                <!-- 第一个标签：红色主题 -->
                <div class="tag-item flex items-center gap-4px px-12px py-6px rounded-full bg-#FFF0F0">
                    <div class="icon w-16px h-16px flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8.16956 2.3335H5.83042C3.62505 2.3335 2.52236 2.3335 1.83724 3.01691C1.36552 3.48746 1.21859 4.15548 1.17283 5.24402C1.16375 5.45989 1.15921 5.56783 1.19952 5.63984C1.23983 5.71186 1.40076 5.80173 1.72262 5.98146C2.08007 6.18108 2.3217 6.56247 2.3217 7.00016C2.3217 7.43785 2.08007 7.81925 1.72262 8.01886C1.40077 8.1986 1.23983 8.28847 1.19952 8.36048C1.15921 8.43249 1.16375 8.54043 1.17283 8.7563C1.21859 9.84485 1.36552 10.5129 1.83724 10.9834C2.52236 11.6668 3.62505 11.6668 5.83042 11.6668H8.16956C10.3749 11.6668 11.4776 11.6668 12.1627 10.9834C12.6345 10.5129 12.7814 9.84485 12.8272 8.7563C12.8362 8.54043 12.8408 8.43249 12.8005 8.36048C12.7601 8.28847 12.5992 8.1986 12.2774 8.01886C11.9199 7.81925 11.6783 7.43785 11.6783 7.00016C11.6783 6.56247 11.9199 6.18108 12.2774 5.98146C12.5992 5.80173 12.7601 5.71186 12.8005 5.63984C12.8408 5.56783 12.8362 5.45989 12.8272 5.24402C12.7814 4.15548 12.6345 3.48746 12.1627 3.01691C11.4776 2.3335 10.3749 2.3335 8.16956 2.3335Z"
                                stroke="#F14437" stroke-width="1.5" />
                            <path d="M5.25 8.75012L8.75 5.25012" stroke="#F14437" stroke-width="1.5"
                                stroke-linecap="round" />
                            <path
                                d="M9.04167 8.45846C9.04167 8.78062 8.7805 9.04179 8.45833 9.04179C8.13617 9.04179 7.875 8.78062 7.875 8.45846C7.875 8.13629 8.13617 7.87512 8.45833 7.87512C8.7805 7.87512 9.04167 8.13629 9.04167 8.45846Z"
                                fill="#F14437" />
                            <path
                                d="M6.12501 5.54183C6.12501 5.864 5.86384 6.12516 5.54168 6.12516C5.21951 6.12516 4.95834 5.864 4.95834 5.54183C4.95834 5.21966 5.21951 4.9585 5.54168 4.9585C5.86384 4.9585 6.12501 5.21966 6.12501 5.54183Z"
                                fill="#F14437" />
                        </svg>


                    </div>
                    <span class="text-#DC3232 font-size-14px font-500">{{ item.discount_rate }}%</span>
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
                    <span class="text-#FF8C00 font-size-14px font-500">{{ item.sale_end_time }}</span>
                </div>

                <!-- 分隔点 -->
                <div class="separator-dot w-4px h-4px rounded-full bg-#CCCCCC"></div>

                <!-- 第三个标签：绿色主题 -->
                <div class="tag-item flex items-center gap-4px px-12px py-6px rounded-full "
                    :class="item.income >= 0 ? 'bg-#E6F9F0 color-#32B464' : 'bg-#FFF5F5 color-#DC3232'">
                    <div class="icon w-16px h-16px flex items-center justify-center">
                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg"
                            :class="item.income >= 0 ? '' : 'rotate-180'">
                            <path
                                d="M8.5 14.0001C11.8137 14.0001 14.5 11.3138 14.5 8.00012C14.5 4.68641 11.8137 2.00012 8.5 2.00012C5.18629 2.00012 2.5 4.68641 2.5 8.00012C2.5 11.3138 5.18629 14.0001 8.5 14.0001Z"
                                :stroke="item.income >= 0 ? '#079455' : '#F14437'" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path
                                d="M8.49998 5.3335L5.83331 8.00016M8.49998 5.3335V10.6668M11.1666 8.00016L8.49998 5.3335"
                                :stroke="item.income >= 0 ? '#079455' : '#F14437'" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                    </div>
                    <span class="text-#32B464 font-size-14px font-500">MX$ {{ item.income }}</span>
                </div>
            </div>

            <div class="li flex justify-between gap-24px">
                <div class="li-l font-size-16 text-#717680">
                    {{ t('Market price') }}
                </div>
                <div class="li-r ">
                    MX$ {{ _item.status == 1 ?
                        addCommasToNumber(_item.purchasePrice) : addCommasToNumber(_item.price) }}
                </div>
            </div>
            <div class="li flex justify-between gap-24px">
                <div class="li-l font-size-16 text-#717680">{{ t('买入价') }}</div>
                <div class="li-r ">
                    {{ _item.unit || 'MX$' }} {{
                        _item.discount_price }}
                </div>
            </div>

            <div class="li flex justify-between gap-24px">
                <div class="li-l font-size-16 text-align-right text-#717680">{{ t("yield") }}</div>

                <div class="li-r">
                    {{ _item.unit || 'MX$' }} {{
                        _item.income_price }}
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
import miniChart from '@/components/miniChart.vue'
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
    router.push("/buy?buyType=discount")
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

.border-bottom {
    border-bottom: 1px solid #E2E8F0;
}

.li-x-border {
    border-left: 1px solid #E2E8F0;
    border-right: 1px solid #E2E8F0
}

.li-r {
    color: #181D27;
}
</style>
