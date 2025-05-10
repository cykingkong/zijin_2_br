<template>
    <div class="discont-content px-12">
        <van-tabs v-model:active="active" @change="changeActive">
            <!-- 折扣股玩法 -->
            <van-tab title="折扣股票列表">
                <div class="discont-list  flex flex-col pb-40">
                    <discont-item :item="item" v-for="(item, index) in list" :key="index"
                        @handleClickBtn="handleClickBtn"></discont-item>
                    <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                        v-show="skeleton && list.length == 0" v-for="i in 5"></div>

                </div>
            </van-tab>
            <van-tab title="持仓订单">
                <div class="discont-list flex flex-col pb-40">
                    <discont-item :item="item" v-for="(item, index) in orderList" :key="index"
                        @handleClickBtn="handleClickBtn" :item-type="'order'" @reloadList="getOrderList"></discont-item>
                    <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                        v-show="skeleton && orderList.length == 0" v-for="i in 5">
                    </div>

                </div>
            </van-tab>
        </van-tabs>


        <bottom-pop ref="bottomPopRef" @onConfirm="onConfirm" :item="activeItem" :active="list[active]"
            :popType="popType"></bottom-pop>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { ipoProductList, ipoOrderList, orderFullSubscribe, orderSubscribe, orderPay, ipoOrderSell } from '@/api/ipo'
import discontItem from "./component/discont-item.vue"
import bottomPop from "./component/bottom-pop.vue";
import dayjs from 'dayjs'
const active = ref('折扣股票列表')
const list = ref([])
const orderList = ref([])
const popType = ref('buy') // buy:购买  sell:出售
const skeleton = ref(false)
const page = reactive({
    pageIndex: 1,
    pageSize: 10
})
const activeItem = ref({})
const loadStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const orderLoadStatus = ref(1) // 1:加载中 2:加载完成 3:没有更多数据
const resetPage = () => {
    page.pageIndex = 1
}
const bottomPopRef = ref()
const getDisountList = async () => {
    resetPage()
    loadStatus.value = 1
    ipoProductList({
        ...page
    }).then(res => {

        if (!res.data.rows) {
            loadStatus.value = 3;
            return
        }
        list.value = res.data.rows.map((e) => {
            return {
                ...e,
                percentage: (
                    ((e.totalNum - e.subscribedNum) /
                        e.totalNum) *
                    100
                ).toFixed(2),
                formatSubTimeBegin: dayjs(e.subTimeBegin).format('YYYY-MM-DD'),
                formatSubTimeEnd: dayjs(e.subTimeEnd).format('YYYY-MM-DD'),
                formatWonTimeBegin: dayjs(e.wonTimeBegin).format('YYYY-MM-DD'),
                formatWonTimeEnd: dayjs(e.wonTimeEnd).format('YYYY-MM-DD'),
                formatMarketTime: dayjs(e.marketTime).format('YYYY-MM-DD'),
            }
        }) || []
        skeleton.value = false;
        loadStatus.value = 2


    })
}
const getOrderList = async () => {
    orderLoadStatus.value = 1
    resetPage()
    ipoOrderList({
        ...page
    }).then(res => {
        if (!res.data.rows) {
            orderLoadStatus.value = 3
            return
        }
        orderList.value = res.data.rows.map((e) => {
            return {
                ...e,
                percentage: (
                    ((e.totalQuantity - e.availableQuantity) /
                        e.totalQuantity) *
                    100
                ).toFixed(2)
            }
        }) || []
        skeleton.value = false;
        orderLoadStatus.value = 2
    })
}
const changeActive = (val: any) => {
    skeleton.value = true
    if (val) {
        getOrderList()
    } else {
        getDisountList()
    }
}
const handleClickBtn = (val: any) => {
    activeItem.value = val.item
    popType.value = val.itemType
    bottomPopRef.value.show(true)
}
const onConfirm = async (val: any) => {

    try {

        if (val.type == 'ipo') {
            if (val.full) {
                // 全量
                const { data, code } = await orderFullSubscribe({
                    ipoId: val.ipoId
                })
                if (code == 200) {
                    bottomPopRef.value.show(false)

                    getDisountList()
                }
                return
            }
            const { data, code } = await orderSubscribe({
                ipoId: val.ipoId,
                number: val.number
            })
            if (code == 200) {
                bottomPopRef.value.show(false)

                getDisountList()
            }
            return
        }
        //         getDisountList()
        //     }
        else {
            const { data, code } = await ipoOrderSell({
                id: val.ipoId
            })
            if (code == 200) {
                console.log(data)
                showToast('出售成功')
                bottomPopRef.value.show(false)
                getOrderList()
            }
        }

    } catch (error) {

    }
}
onMounted(() => {
    // getDisountList()
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
