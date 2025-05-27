<template>
    <div class="discont-content px-12 w-full">
        <template v-if="!onlyShowOrder">
            <van-tabs v-model:active="active" @change="changeActive">
                <van-tab title="基金列表">
                    <div class="discont-list  flex flex-col pb-40">
                        <fund-item :item="item" v-for="(item, index) in list" :key="index"
                            @handleClickBtn="handleClickBtn"></fund-item>
                        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
                            v-show="skeleton && list.length == 0" v-for="i in 5" :key="i"></div>
                        <LoadMore :status="listStatus" @load-more="loadMore" />
                        <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>

                    </div>
                </van-tab>
                <van-tab title="我的基金">
                    <div class="discont-list flex flex-col pb-40">
                        <fund-item :item="item" v-for="(item, index) in orderList" :key="index"
                            @handleClickBtn="handleClickBtn" @handleClickOrder="handleClickOrder"
                            :item-type="'order'"></fund-item>
                        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
                            v-show="skeleton && orderList.length == 0" v-for="i in 5" :key="i">
                        </div>
                        <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
                        <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>

                    </div>
                </van-tab>
            </van-tabs>
        </template>
        <template v-else>
            <div class="discont-list flex flex-col pb-40">
                <fund-item v-for="(item, index) in orderList" :key="index" :item="item" @handleClickBtn="handleClickBtn"
                    @handleClickOrder="handleClickOrder" :item-type="'order'" />
                <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
                    v-show="skeleton && orderList.length === 0" v-for="i in 5" :key="i" />
                <LoadMore :status="orderLoadStatus" @load-more="loadMore" />
                <empty v-if="orderList.length == 0 && !skeleton" :noTips="true"></empty>

            </div>
        </template>

        <bottom-pop ref="bottomPopRef" @onConfirm="onConfirm" :item="activeItem" :active="list[active]"
            :popType="popType" />
    </div>
</template>
<route lang="json5">
    {
      name: 'fund',
      meta: {
        title: '基金',
      },
    }
</route>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { fundProductList, fundOrderList, orderReserve, orderPay, orderReNew, orderRedeem } from '@/api/bond'
import fundItem from "./component/fund-item.vue"
import LoadMore from "@/components/LoadMore.vue";
import bottomPop from "./component/bottom-pop.vue";
import { useLoadingStore } from '@/stores/modules/loading'
import { navTitleStore } from '@/stores/index'
const navStore = navTitleStore()
const loadingStore = useLoadingStore()
const { proxy } = getCurrentInstance()
const props = defineProps({
    onlyShowOrder: {
        type: Boolean,
        default: false
    }
})
const active = ref(0)
const list = ref([])
const orderList = ref([])
const popType = ref('reserve') // Reserve:预约  Redeem:赎回 Pay:支付 ReNew:续费
const skeleton = ref(false)
const page = reactive({
    pageIndex: 1,
    pageSize: 20
})
const activeItem = ref({})
const listStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
    page.pageIndex = 1
}
const bottomPopRef = ref()
const getDisountList = async () => {
    skeleton.value = true
    // resetPage()
    listStatus.value = 1
    fundProductList({
        ...page
    }).then(res => {
        if (!res.data.rows) {
            skeleton.value = false;
            listStatus.value = 3;
            return
        }
        if (page.pageIndex == 1) {
            list.value = res.data.rows || []
        } else {
            list.value = list.value.concat(res.data.rows || [])
        }
        if (res.data.total <= list.value.length) {
            listStatus.value = 3
            skeleton.value = false;
            return
        }
        skeleton.value = false;
        listStatus.value = 2


    })
}
const getOrderList = async () => {
    skeleton.value = true
    orderLoadStatus.value = 1
    // resetPage()
    fundOrderList({
        ...page
    }).then(res => {
        if (!res.data.rows) {
            orderLoadStatus.value = 3;
            skeleton.value = false;

            return
        }
        if (page.pageIndex == 1) {
            orderList.value = res.data.rows || []
        } else {
            orderList.value = orderList.value.concat(res.data.rows || [])
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
const changeActive = (val: any) => {
    skeleton.value = true
    resetPage()
    if (val) {
        getOrderList()
    } else {
        getDisountList()
    }
}
const loadMore = () => {
    page.pageIndex += 1  // 统一先递增页码
    props.onlyShowOrder ? getOrderList() : (active.value === 0 ? getDisountList() : getOrderList())
}
const handleClickBtn = (val: any) => {
    activeItem.value = val.item
    popType.value = val.itemType
    bottomPopRef.value.show(true)
}
const handleClickOrder = async (val: any) => {
    try {
        let resCode = 0
        if (val.status == 4) {
            if (val.type == 1) {
                const { data, code } = await orderRedeem({
                    orderId: val.id
                })
                resCode = code

            } else {
                const { data, code } = await orderReNew({
                    orderId: val.id
                })
                resCode = code
            }
        }
        if (resCode == 200) {
            showToast(val.type == 1 ? '赎回成功' : '续期成功')
            resetPage()
            getOrderList()
        }
    } catch (error) {
        console.log(error)
    }

}
const onConfirmOriginal = async (val: any) => {
    try {
        if (val.type == 'fund') {
            const { data, code } = await orderReserve({
                ...val
            })
            if (code == 200) {
                showToast('预约成功')
                bottomPopRef.value.show(false)
                resetPage()
                getDisountList()
            }
        } else {
            if (val.status == 1) {
                // 购买基金
                const { data, code } = await orderPay({
                    orderId: val.fundId
                })
                if (code == 200) {
                    showToast('购买成功')
                    bottomPopRef.value.show(false)
                    resetPage()
                    getOrderList()
                }
            }
            // const { data, code } = await orderPay({
            //     id: val.id
            // })
            // if (code == 200) {
            //     console.log(data)
            //     showToast('出售成功')
            //     bottomPopRef.value.show(false)
            //     getOrderList()


            // }
        }

    } catch (error) {

    }
}
const onConfirm = proxy!.$throttle(onConfirmOriginal, 1000, {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide()
});
onMounted(() => {
    if (props.onlyShowOrder) {
        getOrderList()
    } else {
        getDisountList()
    }
    // navStore.setNavTitle('基金')
})
onUnmounted(() => {
    // navStore.setNavTitle('')
})
</script>
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
