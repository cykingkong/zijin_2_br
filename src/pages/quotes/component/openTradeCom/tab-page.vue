    <template>
        <div class="openTrade-tab1 pb-60px">
            <div class="flex flex-justify-between px-12 h-44  flex-items-center ">
                <div
                    class="l flex gap-4 flex-items-center font-size-14 .dark:font-color-#fff .light:font-color-#000 font-extralight">
                    最新价 {{ klineData.close }}
                    <!-- <span class="up">-1.09%</span><span class="down">-1.029%</span> -->
                </div>
                <div class="r">
                    <van-icon name="bar-chart-o" />
                </div>
            </div>
            <!-- orderbook-container  -->
            <div class="orderbook-container flex w-full px-12">
                <div class="orderbook-left w-210px  flex-col gap-12 flex">
                    <div class="line w-full border-1px border-solid px-6px py-4 text-align-left font-size-16"
                        :style="{ borderColor: activeColor }">
                        {{ listtext }}
                    </div>
                    <div class="line w-full border-1px border-solid px-6px py-4 text-align-left font-size-16 relative"
                        :style="{ borderColor: activeColor }">
                        <div class="line-content  flex flex-justify-between " @click="popShow = !popShow"> {{
                            popList[popActive] }} <van-icon name="arrow-down" /></div>
                        <div class="pop absolute w-190px" v-show="popShow">
                            <div class="pop-item p-12 " v-for="(i, k) in popList" :key="k"
                                @click.stop="handleClickPopItem(k)">{{ i }}</div>
                        </div>
                    </div>
                    <div class="line w-full border-1px border-solid px-6px py-4 text-align-left font-size-16"
                        :style="{ borderColor: activeColor }">
                        <input type="number" v-model="form.price" v-if="popActive == 1">
                        {{ popActive == 0 ? klineData.close : '' }}
                    </div>
                    <div class="line w-full border-1px border-solid  text-align-left font-size-16"
                        :style="{ borderColor: activeColor }">
                        <div class="line-tab flex w-full">
                            <div class="tab-item flex-1 text-align-center px-6px py-4" v-for="(i, k) in tabList"
                                :key="k" @click="tabActive = k"
                                :style="{ background: tabActive == k ? activeColor : '' }">{{ i }}</div>
                        </div>
                    </div>
                    <div class="line w-full border-color-#F43368  text-align-left font-size-16">
                        <van-stepper v-model="form.amount" step="1" class="price-stepper w-full" />
                    </div>
                    <div class="buy-number font-size-20px mb-12" v-if="direction == 1">
                        可用 {{
                            userBalanceInfo.baseAsset.baseSymbol }} <span class="my-4 color-amber">{{
                            userBalanceInfo.baseAsset ?
                                addCommasToNumber(userBalanceInfo.baseAsset.baseBalance) : '' }}</span>
                    </div>
                    <div class="buy-number font-size-20px mb-12" v-else>
                        可用 {{
                            userBalanceInfo.quoteAsset.quoteSymbol }} <span class="my-4 color-amber">{{
                            userBalanceInfo.quoteAsset ?
                                addCommasToNumber(userBalanceInfo.quoteAsset.quoteBalance) : '' }}</span>
                    </div>
                    <!-- <div class="flex w-full gap-8">
                        <div class="flex-item flex-1 font-size-12px p-6 text-align-center rounded-4"
                            v-for="(i, k) in percentList" :key="k">{{ i }}</div>
                    </div> 
                  
                    <div class="flex flex-justify-between font-size-12px font-extralight">
                        <div class="l">个股仓位 <span class="my-4 color-amber">12,3213</span> </div>
                        <div class="l">总仓位 <span class="my-4 color-amber">12,3213</span> </div>
                    </div>-->
                    <van-button class="buy-btn" type="primary" block size="small" @click="submit">确定</van-button>
                </div>
                <div class="orderboox-right flex-1 flex-shrink-0 pl-12 ">
                    <div class="sell h-212px flex flex-col gap-12">
                        <div class="line py-6 flex flex-justify-between gap-12 flex-items-center w-full font-size-14px font-extralight"
                            v-for="(item, e) in depthData.asks"
                            :style="[{ background: `linear-gradient(to right, rgb(19, 26, 46) 0%, rgb(19, 26, 46) ${linePercent}%, rgba(246, 70, 93, 0.1) ${linePercent}%, rgba(246, 70, 93, 0.1) 100%)` }]">
                            <div class="l-label flex-shrink-0 font-size-12">
                                卖出{{ e + 1 }}
                            </div>
                            <div class="r-value w-full flex flex-justify-between">
                                <div class="p up">{{ item[0].toFixed(2) || '0' }}</div>
                                <div class="n">{{ item[1] }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="rect-box w-full flex h-7">
                        <div class="l flex-1"></div>
                        <div class="r-rect flex-1 h-7"></div>
                    </div>
                    <div class="buy h-212px flex flex-col gap-12">
                        <div class="line py-6 flex flex-justify-between gap-12 flex-items-center w-full font-size-14px font-extralight"
                            v-for="(item, e) in depthData.asks"
                            :style="[{ background: `linear-gradient(to right, rgb(19, 26, 46) 0%, rgb(19, 26, 46) 10.892%, rgba(94, 186, 137, 0.1) 90.892%, rgba(94, 186, 137, 0.1) 100%)` }]">
                            <div class="l-label flex-shrink-0 font-size-12">
                                买入{{ e + 1 }}
                            </div>
                            <div class="r-value w-full flex flex-justify-between">
                                <div class="p down">{{ item[0].toFixed(2) || '0' }}</div>
                                <div class="n">{{ item[1] }}</div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
            <!-- indicator-index-container -->
            <div class="indicator-index-container p-12">
                <div class="indicator-index-tab flex flex-justify-between flex-items-center">
                    <div class="l flex gap-2">
                        <div class="tab-item py-4 px-10 rounded-4" :class="{ 'tabActice': k == orderStatus }"
                            v-for="(item, k) in indicatorTab" :key="k" @click="handleClickIndicatorTab(k)">{{ item }}
                        </div>
                    </div>
                    <!-- <div class="r flex-shrink-0">
                        <img src="@/assets/image/deliveryContract/Group1663.png" alt="" class="w-24 h-18 pr-6">
                    </div> -->
                </div>
                <div class="tab-content" v-show="orderStatus == 0 || orderStatus == 1">

                    <EntrustItem v-for="item in orderList" :key="item.order_no" :entrust="item" state="submitted"
                        @cancelOrder="cancelOrder" />
                    <Empty v-if="orderList.length == 0" />
                    <LoadMore :status="orderLoadStatus" @load-more="loadMore"></LoadMore>


                </div>

                <div class="tab-content" v-show="orderStatus == 2">
                    <Empty v-show="false" />
                    <div class="etf-table pt-12 font-size-12">
                        <div class="title text-coolGray">当前币对资产</div>
                        <div class="line flex flex-justify-between p-12 " v-if="userBalanceInfo.baseAsset">
                            <div class="l-title flex items-center gap-6">
                                <img :src="userBalanceInfo.baseAsset.symbolLogo" alt=""
                                    class="w-24 h-24 rounded-full" />{{
                                        userBalanceInfo.baseAsset.baseSymbolName }}
                            </div>
                            <div class="l-desc font-extralight text-coolGray">{{
                                userBalanceInfo.baseAsset.baseSymbol }} {{ userBalanceInfo.baseAsset.baseBalance }}
                            </div>
                        </div>
                        <div class="line flex flex-justify-between p-12 " v-if="userBalanceInfo.quoteAsset">
                            <div class="l-title  flex items-center gap-6">
                                <img :src="userBalanceInfo.quoteAsset.symbolLogo" alt="" class="w-24 h-24 rounded-full">
                                {{
                                    userBalanceInfo.quoteAsset.quoteSymbolName }}
                            </div>
                            <div class="l-desc font-extralight text-coolGray">{{
                                userBalanceInfo.quoteAsset.quoteSymbol }} {{ userBalanceInfo.quoteAsset.quoteBalance }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import Empty from '@/components/empty.vue'
import local from '@/utils/local'
import { useStore } from '@/stores/modules/index';
import charts from '@/components/charts/charts.vue'
import LoadMore from '@/components/LoadMore.vue';
import EntrustItem from "./EntrustItem.vue";
import { addCommasToNumber } from '@/utils/tool'
// 应用全局防抖后的提交方法
import { useLoadingStore } from '@/stores/modules/loading'
const emits = defineEmits(['handleClickSubmit', 'handleClickIndicatorTab', 'cancelOrder', 'loadMore'])

const store = useStore();
const klineData = computed(() => store.getlistData)

const props = defineProps({
    direction: {
        type: Number,
        default: 1
    },
    depthData: {
        type: Object,
        default: () => { }
    },
    klineData: {
        type: Object,
        default: []
    },
    userBalanceInfo: {
        default: () => { }
    },
    orderList: {
        default: () => { }
    },
    orderStatus: {
        default: 1
    },
    orderLoadStatus: {
        default: 1
    }
})
const form = reactive({
    tradingPairsId: '',
    direction: '',
    entrustPrice: '',
    price: '',
    amount: 1,
    type: ''

})

const listtext = computed(() => {
    if (local.getlocal('rankInfo')) {
        return local.getlocal('rankInfo').tradingInfo.baseAssetInfo.name + '/' + local.getlocal('rankInfo').tradingInfo.quoteAssetInfo.name
    }
    return '-'
})

const activeColor = computed(() => props.direction == 1 ? '#F43368' : '#1678FF')
const indicatorTab = ref(['当前委托', '历史委托', '资产'])
const popList = ref(['市價委託', '限價委託'])
const percentList = ref(['25%', '50%', '75%', '100%'])
const popActive = ref(0)
const indicatorActive = ref(0)
const popShow = ref(false)
// const tabList = ref(['数量', '总额'])
const tabList = ref(['数量'])
const tabActive = ref(0)
const value = ref(1)
const mode = computed(() => {
    return isDark.value ? 'dark' : 'light'
})
const linePercent = ref(80)
console.log(mode, 'mide')
const isSubmitting = ref(false);
const allowSubmit = ref(true);

// 原始提交方法
const submitOriginal = async () => {
    let params = {
        direction: props.direction == 1 ? 'buy' : 'sell',
        entrustPrice: popActive.value == 0 ? null : form.price,
        amount: form.amount,
        type: popActive.value == 0 ? 1 : 2
    };
    await emits('handleClickSubmit', params);
};
const handleClickIndicatorTab = (index) => {
    emits('handleClickIndicatorTab', index)
}

const cancelOrderOriginal = (val) => {
    emits('cancelOrder', val)
}



const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()
const submit = proxy!.$throttle(submitOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
const cancelOrder = proxy!.$throttle(cancelOrderOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
const loadMore = () => {
    emits('loadMore')
}

</script>
<style lang="less" scoped>
.pop {
    background: var(--grey_bg);
    left: 50%;
    transform: translateX(-50%);

    .pop-item {
        list-style: 20px;
        text-align: center;
    }
}

.active {
    background: v-bind(activeColor);
}

.flex-item {
    background: var(--input_background);
}

.buy-btn {
    background: v-bind(activeColor);
    border: none
}

:deep(.van-stepper__minus) {
    background: var(--input_background);
    border: 1px solid v-bind(activeColor);
    border-radius: 2px;
    width: 34px;
    height: 34px;
    color: v-bind(activeColor);
}

:deep(.van-stepper__plus) {
    background: var(--input_background);
    border: 1px solid v-bind(activeColor);
    border-radius: 2px;
    width: 34px;
    height: 34px;
    color: v-bind(activeColor);
}

:deep(.van-stepper__input) {
    width: calc(100% - 68px) !important;
    background: var(--input_background);
    color: var(--text_color);
    border-top: 1px solid v-bind(activeColor);
    border-bottom: 1px solid v-bind(activeColor);
    margin: 0;
    height: 34px;
}

.rect-box {
    background-color: #f43368;

    .r-rect {
        background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAAAOCAYAAADT/dV/AAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAClSURBVHgB7dnBCcJAEIXhN4uEPaaELWVLsAOtwBYsJYJ2o5ASbMNLjBtBJcabO7f/uyzMeXj7YEw/xMvpYGYbAX+y70Hsu2T35iqggrCYDE0WUMliwcy0F1DJbMHi+ZjLkwRUMk8ws62Ait4ln3IPD58Eo9zDwTPBSveShTClVxJQ0SvBslguOAht31Hu4WZKsJazELyE29CsBThZmcZd+SNHAQ4eYeEYrSfBjxMAAAAASUVORK5CYII=) no-repeat;
    }
}

.tabActice {
    background: #1678FF;
}

.line {
    border-bottom: 1px solid #747a8f;
}

input {
    background: transparent;
    border: none;
    color: #fff;
    width: 100%;
}
</style>
