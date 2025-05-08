    <template>
        <div class="openTrade-tab1 ">
            <div class="flex flex-justify-between px-12 h-44  flex-items-center ">
                <div
                    class="l flex gap-4 flex-items-center font-size-14 .dark:font-color-#fff .light:font-color-#000 font-extralight">
                    最新价 0<span class="up">-1.09%</span><span class="down">-1.029%</span>
                </div>
                <div class="r">
                    <van-icon name="bar-chart-o" />
                </div>
            </div>
            <!-- orderbook-container  -->
            <div class="orderbook-container flex w-full px-12">
                <div class="orderbook-left w-210px  flex-col gap-12 flex">
                    <div
                        class="line w-full border-1px border-solid px-6px py-4 text-align-left font-size-16"
                        :style="{ borderColor: activeColor }">
                        股票代碼/簡拼
                    </div>
                    <div
                        class="line w-full border-1px border-solid px-6px py-4 text-align-left font-size-16 relative"
                        :style="{ borderColor: activeColor }">
                        <div class="line-content  flex flex-justify-between " @click="popShow = !popShow"> {{
                            popList[popActive] }} <van-icon name="arrow-down" /></div>
                        <div class="pop absolute w-190px" v-show="popShow">
                            <div class="pop-item p-12 " v-for="(i, k) in popList" :key="k"
                                @click.stop="popActive = k; popShow = false">{{ i }}</div>
                        </div>
                    </div>
                    <div
                        class="line w-full border-1px border-solid px-6px py-4 text-align-left font-size-16"
                        :style="{ borderColor: activeColor }">
                        价格
                    </div>
                    <div class="line w-full border-1px border-solid  text-align-left font-size-16" :style="{ borderColor: activeColor }">
                        <div class="line-tab flex w-full">
                            <div class="tab-item flex-1 text-align-center px-6px py-4" v-for="(i, k) in tabList"
                                :key="k" @click="tabActive = k" :style="{ background: tabActive == k ? activeColor : '' }">{{ i }}</div>
                        </div>
                    </div>
                    <div class="line w-full border-color-#F43368  text-align-left font-size-16">
                        <van-stepper v-model="value" step="2" class="price-stepper w-full" />
                    </div>
                    <div class="buy-number font-size-12px">
                        可用 <span class="my-4 color-amber">12,3213</span> USD
                    </div>
                    <div class="flex w-full gap-8">
                        <div class="flex-item flex-1 font-size-12px p-6 text-align-center rounded-4"
                            v-for="(i, k) in percentList" :key="k">{{ i }}</div>
                    </div>
                    <van-button class="buy-btn" type="primary" block size="small">确定</van-button>
                    <div class="flex flex-justify-between font-size-12px font-extralight">
                        <div class="l">个股仓位 <span class="my-4 color-amber">12,3213</span> </div>
                        <div class="l">总仓位 <span class="my-4 color-amber">12,3213</span> </div>
                    </div>
                </div>
                <div class="orderboox-right flex-1 flex-shrink-0 h-22 pl-12 flex flex-col gap-14">
                    <div class="line flex flex-justify-between gap-12 flex-items-center w-full font-size-12px font-extralight"
                    v-for="(i,e) in 5"
                        :style="[{ background: `linear-gradient(to right, rgb(19, 26, 46) 0%, rgb(19, 26, 46) ${linePercent}%, rgba(246, 70, 93, 0.1) ${linePercent}%, rgba(246, 70, 93, 0.1) 100%)` }]">
                        <div class="l-label flex-shrink-0">
                            卖出1
                        </div>
                        <div class="r-value w-full flex flex-justify-between">
                            <div class="p up">5.00</div>
                            <div class="n">52</div>
                        </div>
                    </div>
                    <div class="rect-box w-full flex h-7">
                        <div class="l flex-1"></div>
                        <div class="r-rect flex-1 h-7"></div>
                    </div>
                    <div class="line flex flex-justify-between gap-12 flex-items-center w-full font-size-12px font-extralight"
                    v-for="(i,e) in 5"

                        :style="[{ background: `linear-gradient(to right, rgb(19, 26, 46) 0%, rgb(19, 26, 46) 10.892%, rgba(94, 186, 137, 0.1) 90.892%, rgba(94, 186, 137, 0.1) 100%)` }]">
                        <div class="l-label flex-shrink-0">
                            买入
                        </div>
                        <div class="r-value w-full flex flex-justify-between">
                            <div class="p down">5.00</div>
                            <div class="n">52</div>
                        </div>
                    </div>
                </div>

            </div>
            <!-- indicator-index-container -->
             <div class="indicator-index-container p-12">
                <div class="indicator-index-tab flex flex-justify-between flex-items-center">
                    <div class="l flex gap-2">
                        <div class="tab-item py-4 px-10 rounded-4" :class="{'tabActice':k == indicatorActive}" v-for="(item ,k) in indicatorTab" :key="k" @click="indicatorActive = k">{{ item }}</div>
                    </div>
                    <div class="r flex-shrink-0">
                        <img src="@/assets/image/deliveryContract/Group1663.png" alt="" class="w-24 h-18 pr-6">
                    </div>
                </div>
                <div class="tab-content" v-show="indicatorActive == 0">
                    <Empty/>
                </div>
                <div class="tab-content" v-show="indicatorActive == 1">
                    <Empty/>
                </div>
                <div class="tab-content" v-show="indicatorActive == 2">
                    <Empty v-show="false"/>
                    <div class="etf-table pt-12 font-size-12">
                        <div class="title text-coolGray">当前币对资产</div>
                        <div class="line flex flex-justify-between p-12 ">
                            <div class="l flex-col flex gap-12">
                                <div class="l-title">LEAD</div>
                                <div class="l-desc font-extralight text-coolGray">LEAD</div>
                            </div>
                            <div class="r flex-col flex gap-12">
                                <div class="r-t">0</div>
                                <div class="r-p  font-extralight">$0</div>
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
const props = defineProps({
    saleIn:{
        type:Boolean,
        default:true

    }
})


const activeColor = computed(() => props.saleIn ? '#F43368' : '#1678FF')
const indicatorTab = ref(['当前委托','历史委托','资产'])
const popList = ref(['市價委託', '限價委託'])
const percentList = ref(['25%', '50%', '75%', '100%'])
const popActive = ref(0)
const indicatorActive = ref(0)
const popShow = ref(false)
const tabList = ref(['数量', '总额'])
const tabActive = ref(0)
const value = ref(1)
const mode = computed(() => {
    return isDark.value ? 'dark' : 'light'
})
const linePercent = ref(80)
console.log(mode, 'mide')



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
.tabActice{
    background: #1678FF;
}
.line{
    border-bottom:1px solid #747a8f;
}
</style>
