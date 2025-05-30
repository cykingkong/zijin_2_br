<template>
    <div class="discont-content px-12 w-full">
        <VanNavBar title="" :fixed="true" placeholder clickable :left-arrow="true" @click-left="onBack" z-index="999"
            v-if="!onlyShowOrder">

            <template #title>
                <div class="flex flex-items-center gap-6">股息</div>
            </template>
        </VanNavBar>
        <template v-if="!onlyShowOrder">
            <van-tabs v-model:active="active" @change="changeActive">
                <!-- 折扣股玩法 -->
                <van-tab title="股息列表">
                    <div class="discont-list  flex flex-col pb-40">
                        <discont-item :item="item" v-for="(item, index) in list" :key="index"
                            @handleClickBtn="handleClickBtn"></discont-item>
                        <div class="1 skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                            v-show="skeleton && list.length == 0" v-for="i in 5" :key="i"></div>
                        <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>
                        <LoadMore :status="listStatus" @load-more="loadMore" />
                    </div>
                </van-tab>
                <van-tab title="持仓订单">
                    <div class="discont-list flex flex-col pb-40">
                        <discont-item :item="item" v-for="(item, index) in orderList" :key="index"
                            @handleClickBtn="handleClickBtn" :item-type="'order'"></discont-item>
                        <div class="2 skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                            v-show="skeleton && orderList.length == 0" v-for="i in 5" :key="i">
                        </div>
                        <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>

                        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
                    </div>
                </van-tab>
            </van-tabs>
        </template>
        <template v-else>
            <div class="discont-list flex flex-col pb-40">

                <discont-item :item="item" v-for="(item, index) in orderList" :key="index"
                    @handleClickBtn="handleClickBtn" :item-type="'order'"></discont-item>
                <div class="skeleton-box" v-if="skeleton && orderList.length == 0">
                    <div class="3 skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                        v-for="i in 5" :key="i">
                    </div>

                </div>
                <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>

                <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
            </div>
        </template>
        <bottom-pop ref="bottomPopRef" @onConfirm="onConfirm" :item="activeItem" :active="list[active]"
            :popType="popType"></bottom-pop>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRoute } from 'vue-router';
import { discountList, discountOrderList, discountOrderBuy, discountOrderSell } from '@/api/bond'
import discontItem from "./component/discont-item.vue"
import bottomPop from "./component/bottom-pop.vue";
import LoadMore from "@/components/LoadMore.vue";
import { useLoadingStore } from '@/stores/modules/loading'
import { useStore } from '@/stores/modules/index';

const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
    onlyShowOrder: {
        type: Boolean,
        default: false
    },

    categoryId: {
        type: String,
        default: ''
    }
})
const categoryId = ref<any>()
const orderList = ref([])



const active = ref(0)
const list = ref([])
const popType = ref('buy') // buy:购买  sell:出售
const skeleton = ref(false)
const page = reactive({
    pageIndex: 1,
    pageSize: 4
})
const activeItem = ref({})
const listStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
    page.pageIndex = 1
}
const router = useRouter()
function onBack() {
    if (window.history.state.back)
        history.back()
    else
        router.replace('/')
}

const bottomPopRef = ref()
const getDisountList = async () => {
    // resetPage()
    listStatus.value = 1
    discountList({
        ...page,
        categoryId: categoryId.value,
        isDividend: 1,

    }).then(res => {
        if (!res.data.rows) {
            listStatus.value = 3;
            skeleton.value = false;

            return
        }
        if (page.pageIndex == 1) {
            list.value = res.data.rows.map((e) => {
                return {
                    ...e,
                    percentage: (
                        ((e.totalQuantity - e.availableQuantity) /
                            e.totalQuantity) *
                        100
                    ).toFixed(2)
                }
            }) || []
        } else {
            let result = res.data.rows.map((e) => {
                return {
                    ...e,
                    percentage: (
                        ((e.totalQuantity - e.availableQuantity) /
                            e.totalQuantity) *
                        100
                    ).toFixed(2)
                }
            })
            list.value = list.value.concat(result)

        }
        if (res.data.total <= list.value.length) {
            listStatus.value = 3
            skeleton.value = false;
            return
        }
        // list.value = res.data.rows.map((e) => {
        //     return {
        //         ...e,
        //         percentage: (
        //             ((e.totalQuantity - e.availableQuantity) /
        //                 e.totalQuantity) *
        //             100
        //         ).toFixed(2)
        //     }
        // }) || []
        skeleton.value = false;
        listStatus.value = 2


    })
}
const getOrderList = async () => {
    orderLoadStatus.value = 1
    skeleton.value = true
    discountOrderList({
        isDividend: 1,
        categoryId: categoryId.value,
        ...page
    }).then(res => {
        if (!res.data.rows) {
            console.log(123)
            orderLoadStatus.value = 3;
            skeleton.value = false;
            return
        }
        if (page.pageIndex == 1) {
            orderList.value = res.data.rows.map((e) => {
                return {
                    ...e,
                    percentage: (
                        ((e.totalQuantity - e.availableQuantity) /
                            e.totalQuantity) *
                        100
                    ).toFixed(2),
                    //  discountPrice 购买价格  purchasePrice 市场价
                    giftDividend: (e.discountPrice * e.purchaseQuantity * (e.dividendInfo.totalYield / 100)).toFixed(2) || 0, //  赠送股息金额
                    earnings: ((e.purchasePrice - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                    earningRate: ((e.purchasePrice - e.discountPrice) / e.purchasePrice * 100).toFixed(2)
                }
            }) || []
        } else {
            let result = res.data.rows.map((e) => {
                console.log(e.discountPrice * e.purchaseQuantity * e.dividendInfo.totalYield, 'e.discountPrice * e.purchaseQuantity * e.dividendInfo.totalYield')
                return {
                    ...e,
                    percentage: (
                        ((e.totalQuantity - e.availableQuantity) /
                            e.totalQuantity) *
                        100
                    ).toFixed(2),
                    giftDividend: (e.discountPrice * e.purchaseQuantity * (e.dividendInfo.totalYield / 100)).toFixed(2) || 0, //  赠送股息金额
                    earnings: ((e.purchasePrice - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                    earningRate: ((e.purchasePrice - e.discountPrice) / e.purchasePrice * 100).toFixed(2)
                }
            })
            orderList.value = orderList.value.concat(result)
        }
        if (res.data.total <= orderList.value.length) {
            orderLoadStatus.value = 3
            skeleton.value = false;
            return
        }
        skeleton.value = false;
        orderLoadStatus.value = 2
    })
}
const store = useStore()
watch(() => props.categoryId, (newV) => {
    if (newV && categoryId.value != newV && categoryId.value != '') {
        categoryId.value = newV
        orderList.value = []
        getOrderList()
        return
    }
    categoryId.value = newV
}, {
    immediate: true
})
watch(() => store.getklineList, (newV) => {
    if (newV && list.value.length) {
        list.value.forEach(el => {
            let listItem = newV.find((item: any) => {
                return item.tradingId == el.tradingPairsId
            })
            if (listItem) {
                if (listItem.tradingId == el.tradingPairsId) {
                    el.close = listItem.tick.close
                }
            }

        })
    }
    if (newV && orderList.value.length) {
        orderList.value.forEach(el => {
            let listItem = newV.find(item => item.tradingId == el.tradingPairsId)
            if (listItem) {
                if (listItem.tradingId == el.tradingPairsId) {
                    el.purchasePrice = listItem.tick.close;
                    el.giftDividend = (el.discountPrice * el.purchaseQuantity * (el.dividendInfo.totalYield / 100)).toFixed(2) || 0 //  赠送股息金额
                    el.earnings = ((el.purchasePrice - el.discountPrice) * el.purchaseQuantity).toFixed(2) || 0 // 收益，
                    el.earningRate = ((el.purchasePrice - el.discountPrice) / el.purchasePrice * 100).toFixed(2) // 收益率
                }
            }
        })

    }
})
const changeActive = (val: any) => {
    resetPage()
    skeleton.value = true
    if (val) {
        getOrderList()
    } else {
        getDisountList()
    }
}
const loadMore = () => {
    // 确保每次点击都递增页码
    page.pageIndex += 1
    if (props.onlyShowOrder) {
        getOrderList()
    } else {
        active.value === 0 ? getDisountList() : getOrderList()
    }
}
const handleClickBtn = (val: any) => {
    activeItem.value = val.item
    popType.value = val.itemType
    bottomPopRef.value.show(true)
}
const onConfirmOriginal = async (val: any) => {
    console.log(val)
    try {
        if (val.type == 'discount') {
            const { data, code } = await discountOrderBuy({
                ...val
            })
            if (code == 200) {
                console.log(data)
                showToast('下单成功')
                bottomPopRef.value.show(false)
                resetPage()
                getDisountList()
            }
        } else {
            const { data, code } = await discountOrderSell({
                id: val.id
            })
            if (code == 200) {
                console.log(data)
                showToast('出售成功')
                resetPage()

                bottomPopRef.value.show(false)
                getOrderList()


            }
        }

    } catch (error) {

    }
}
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
const route = useRoute()

onMounted(() => {
    if (route.query.categoryId) {
        categoryId.value = route.query.categoryId
    }
    if (props.onlyShowOrder) {
        getOrderList()
    } else {
        getDisountList()
    }
    route.meta.title = '股息'  // 设置你需要的标题
})

</script>
<route lang="json5">
    {
      name: 'dividend',
      meta: {
        title: '股息',
      },
    }
</route>
<style lang="less" scoped>
.skeleton-animation {
    animation: pulseskeleton 1s ease-in infinite;
}

@keyframes pulseskeleton {
    0% {
        opacity: 0.7;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.7;
    }
}
</style>
