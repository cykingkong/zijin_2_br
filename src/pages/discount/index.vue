<template>
    <div class="discont-content px-12 w-full">
        <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" v-if="!onlyShowOrder"
            z-index="999">
            <template #title>
                <div class="flex flex-items-center gap-6">{{ t('deal.discount') }}</div>
            </template>
        </VanNavBar>
        <template v-if="!onlyShowOrder">

            <!-- 自定义Tab组件 -->
            <div class="custom-tabs">
                <div class="tab-container">
                    <div class="tab-item" :class="{ active: active === 0 }" @click="changeActive(0)">
                        <svg class="tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 2H6V6H2V2Z" fill="currentColor" />
                            <path d="M10 2H14V6H10V2Z" fill="currentColor" />
                            <path d="M2 10H6V14H2V10Z" fill="currentColor" />
                            <path d="M10 10H14V14H10V10Z" fill="currentColor" />
                        </svg>
                        <span class="tab-text">{{ t('discount list') }}</span>
                    </div>
                    <div class="tab-item" :class="{ active: active === 1 }" @click="changeActive(1)">
                        <svg class="tab-icon" width="16" height="16" viewBox="0 0 16 16" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M2 12L6 8L10 10L14 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                            <path d="M14 6L12 4L10 6L14 6Z" fill="currentColor" />
                        </svg>
                        <span class="tab-text">{{ t('Order List') }}</span>
                    </div>
                </div>

                <!-- Tab内容 -->
                <div v-if="active === 0" class="tab-content">
                    <div class="discont-list flex flex-col pb-40">
                        <discont-item :item="item" v-for="(item, index) in list" :key="index"
                            @handleClickBtn="handleClickBtn"></discont-item>
                        <div class="skeleton d w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                            :class="listSkeleton && list.length == 0" v-show="listSkeleton && list.length == 0"
                            v-for="i in 5" :key="i"></div>
                        <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>
                        <LoadMore :status="listStatus" @load-more="loadMore" />
                    </div>
                </div>
                <div v-if="active === 1" class="tab-content">
                    <div class="discont-list flex flex-col pb-40">
                        <discont-item :item="item" v-for="(item, index) in orderList" :key="index"
                            @handleClickBtn="handleClickBtn" :item-type="'order'"></discont-item>
                        <div class="skeleton o w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                            :class="orderSkeleton && orderList.length == 0"
                            v-show="orderSkeleton && orderList.length == 0" v-for="i in 5" :key="i">
                        </div>
                        <empty v-if="orderList.length == 0 && !orderSkeleton" :noTips="true"></empty>
                        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="discont-list flex flex-col pb-40">
                <discont-item :item="item" v-for="(item, index) in orderList" :key="index"
                    @handleClickBtn="handleClickBtn" :item-type="'order'"></discont-item>
                <div class="skeleton else w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                    v-show="orderSkeleton && orderList.length == 0" v-for="i in 5" :key="i">
                </div>
                <empty v-if="orderList.length == 0 && !orderSkeleton" :noTips="true"></empty>
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
import { showToast, showSuccessToast, allowMultipleToast } from 'vant';
import { useStore } from '@/stores/modules/index';
import discontItem from "./component/discont-item.vue"
import bottomPop from "./component/bottom-pop.vue";
import LoadMore from "@/components/LoadMore.vue";
import { useLoadingStore } from '@/stores/modules/loading'
import { navTitleStore } from '@/stores/index'
const navStore = navTitleStore()
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
const categoryId = ref<any>('')
const orderList = ref([])

watch(() => props.categoryId, (newV) => {
    if (newV && categoryId.value != newV && categoryId.value != '') {
        categoryId.value = newV
        orderList.value = []
        // 只有在onlyShowOrder模式下才调用getOrderList
        if (props.onlyShowOrder) {
            getOrderList()
        }
        return
    }
    categoryId.value = newV
}, {
    immediate: true
})
const active = ref(0)
const list = ref([])
const popType = ref('buy') // buy:购买  sell:出售
const skeleton = ref(false)
const listSkeleton = ref(false)
const orderSkeleton = ref(false)
const page = reactive({
    pageIndex: 1,
    pageSize: 4
})
const { t } = useI18n()
const activeItem = ref({})
const listStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
    page.pageIndex = 1
}


const bottomPopRef = ref()
const getDisountList = async () => {
    // resetPage()
    listStatus.value = 1
    if (page.pageIndex == 1) {
        listSkeleton.value = true
    }
    discountList({
        ...page,
        categoryId: categoryId.value
    }).then(res => {
        if (!res.data.rows) {
            listStatus.value = 3;
            listSkeleton.value = false;

            return
        }
        if (page.pageIndex == 1) {
            list.value = res.data.rows.map((e) => {
                return {
                    ...e,
                    percentage: (
                        ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                    ).toFixed(2),
                }
            }) || []
        } else {
            let result = res.data.rows.map((e) => {
                return {
                    ...e,
                    percentage: (
                        ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                    ).toFixed(2),
                }
            })
            list.value = list.value.concat(result)

        }
        if (res.data.total <= list.value.length) {
            listStatus.value = 3
            listSkeleton.value = false;
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
        listSkeleton.value = false;
        listStatus.value = 2


    })
}
const getOrderList = async () => {
    orderLoadStatus.value = 1
    orderSkeleton.value = true
    discountOrderList({
        ...page,
        categoryId: categoryId.value
    }).then(res => {
        if (!res.data.rows) {
            orderLoadStatus.value = 3;
            orderSkeleton.value = false;
            return
        }
        if (page.pageIndex == 1) {
            orderList.value = res.data.rows.map((e) => {
                if (e.status == 1) {
                    return {
                        ...e,
                        percentage: (
                            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                        ).toFixed(2),
                        earnings: ((e.close - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                        earningRate: ((e.close - e.discountPrice) / e.close * 100).toFixed(2)
                    }
                } else {
                    return {
                        ...e,
                        percentage: (
                            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                        ).toFixed(2),
                        earnings: ((e.salePrice - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                        earningRate: e.salePrice ? ((e.salePrice - e.discountPrice) / e.salePrice * 100).toFixed(2) : 0
                    }
                }

            }) || []
        } else {
            let result = res.data.rows ? res.data.rows.map((e) => {
                if (e.status == 1) {
                    return {
                        ...e,
                        percentage: (
                            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                        ).toFixed(2),
                        earnings: ((e.close - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                        earningRate: ((e.close - e.discountPrice) / e.close * 100).toFixed(2)
                    }
                } else {
                    return {
                        ...e,
                        percentage: (
                            ((e.totalQuantity - e.availableQuantity) / e.totalQuantity) * 100
                        ).toFixed(2),
                        earnings: ((e.salePrice - e.discountPrice) * e.purchaseQuantity).toFixed(2) || 0, // 收益，
                        earningRate: e.salePrice ? ((e.salePrice - e.discountPrice) / e.salePrice * 100).toFixed(2) : 0
                    }
                }
            }) : []
            orderList.value = orderList.value.concat(result)
        }
        if (res.data.total <= orderList.value.length) {
            orderLoadStatus.value = 3
            orderSkeleton.value = false;
            return
        }
        orderSkeleton.value = false;
        orderLoadStatus.value = 2
    })
}
const store = useStore()
watch(() => store.klineList, (newV) => {
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
                    el.close = listItem.tick.close;
                    if (el.status == 1) {
                        el.earnings = ((el.close - el.discountPrice) * el.purchaseQuantity).toFixed(2) || 0 // 收益，
                        el.earningRate = ((el.close - el.discountPrice) / el.close * 100).toFixed(2) // 收益率
                    } else {
                        el.earnings = ((el.salePrice - el.discountPrice) * el.purchaseQuantity).toFixed(2) || 0 // 收益，
                        el.earningRate = el.salePrice ? ((el.salePrice - el.discountPrice) / el.salePrice * 100).toFixed(2) : 0 // 收益率
                    }

                }
            }
        })

    }
})
const changeActive = (val: any) => {
    resetPage()
    active.value = val
    if (val) {
        orderList.value = []
        listSkeleton.value = false // 隐藏列表骨架屏
        getOrderList()
    } else {
        list.value = []
        orderSkeleton.value = false // 隐藏订单骨架屏
        getDisountList()
    }
}
const loadMore = () => {
    // 确保每次点击都递增页码
    const originalPageIndex = page.pageIndex
    page.pageIndex += 1

    // 调试日志
    console.log('Loading more. New pageIndex:', page.pageIndex,
        'Original:', originalPageIndex,
        'Mode:', props.onlyShowOrder ? 'OrderOnly' : 'Normal')

    if (props.onlyShowOrder) {
        console.log('Fetching order list with page:', page)
        getOrderList()
    } else {
        console.log('Fetching', active.value === 0 ? 'discount' : 'order', 'list with page:', page)
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
                bottomPopRef.value.show(false)
                showToast({
                    message: t('Order placed successfully'),
                    onClose: () => {
                        active.value = 1
                        changeActive(1)
                    }
                })
                // resetPage()
                // getDisountList()
            }
        } else {
            const { data, code } = await discountOrderSell({
                id: val.id
            })
            if (code == 200) {
                console.log(data)
                bottomPopRef.value.show(false)
                showToast({
                    message: t('Sold successfully'),
                    onClose: () => {
                        resetPage()
                        getOrderList()

                    }
                })
            }
        }

    } catch (error) {

    }
}
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
const router = useRouter()
function onBack() {
    if (window.history.state.back)
        history.back()
    else
        router.replace('/')
}
const route = useRoute()

onMounted(() => {
    // 确保skeleton初始状态为false
    skeleton.value = false
    listSkeleton.value = false
    orderSkeleton.value = false

    if (route.query.categoryId) {
        categoryId.value = route.query.categoryId
    }
    if (props.onlyShowOrder) {
        getOrderList()
    } else {
        getDisountList()
    }
    allowMultipleToast()
    // navStore.setNavTitle('折扣股')
    route.meta.title = '折扣股'  // 设置你需要的标题
})
onUnmounted(() => {
    // navStore.setNavTitle('')
})
</script>
<!-- <route lang="json5">
    {
      name: 'discount',
      meta: {
        title: '折扣股',
      },
    }
</route> -->
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

// 自定义Tab样式
.custom-tabs {
    .tab-container {
        display: flex;
        background: #F8F9FD;
        border-radius: 8px;
        padding: 4px;
        margin: 16px 0;
        gap: 4px;
    }

    .tab-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: transparent;
        color: #94A3B8;

        .tab-icon {
            width: 16px;
            height: 16px;
        }

        .tab-text {
            font-size: 14px;
            font-weight: 500;
        }

        &:hover {
            background: rgba(107, 57, 244, 0.1);
        }

        &.active {
            background: white;
            color: #1F2937;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
    }

    .tab-content {
        margin-top: 16px;
    }
}
</style>
