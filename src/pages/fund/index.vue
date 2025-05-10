<template>
    <div class="discont-content px-12">
        <van-tabs v-model:active="active" @change="changeActive">
            <van-tab title="基金列表">
                <div class="discont-list  flex flex-col pb-40">
                    <fund-item :item="item" v-for="(item, index) in list" :key="index"
                        @handleClickBtn="handleClickBtn"></fund-item>
                    <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
                        v-show="skeleton && list.length == 0" v-for="i in 5"></div>
                </div>
            </van-tab>
            <van-tab title="我的基金">
                <div class="discont-list flex flex-col pb-40">
                    <fund-item :item="item" v-for="(item, index) in orderList" :key="index"
                        @handleClickBtn="handleClickBtn" @handleClickOrder="handleClickOrder"
                        :item-type="'order'"></fund-item>
                    <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12px"
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
import { fundProductList, fundOrderList, orderReserve, orderPay, orderReNew, orderRedeem } from '@/api/bond'
import fundItem from "./component/fund-item.vue"
import bottomPop from "./component/bottom-pop.vue";
const active = ref('折扣股票列表')
const list = ref([])
const orderList = ref([])
const popType = ref('reserve') // Reserve:预约  Redeem:赎回 Pay:支付 ReNew:续费
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
    fundProductList({
        ...page
    }).then(res => {
        if (!res.data.rows) {
            loadStatus.value = 3;
            return
        }
        list.value = res.data.rows.map((e) => {
            return {
                ...e,

            }
        }) || []
        skeleton.value = false;
        loadStatus.value = 2


    })
}
const getOrderList = async () => {
    orderLoadStatus.value = 1
    resetPage()
    fundOrderList({
        ...page
    }).then(res => {
        if (!res.data.rows) {
            orderLoadStatus.value = 3
            return
        }
        orderList.value = res.data.rows.map((e) => {
            return {
                ...e,

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
const handleClickOrder = async (val: any) => {
    console.log(val)
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
            getOrderList()
        }
    } catch (error) {
        console.log(error)
    }

}
const onConfirm = async (val: any) => {
    try {
        if (val.type == 'fund') {
            const { data, code } = await orderReserve({
                ...val
            })
            if (code == 200) {
                console.log(data)
                showToast('预约成功')
                bottomPopRef.value.show(false)

                getDisountList()
            }
        } else {
            console.log(val)
            if (val.status == 1) {
                // 购买基金
                const { data, code } = await orderPay({
                    orderId: val.fundId
                })
                if (code == 200) {
                    console.log(data)
                    showToast('购买成功')
                    bottomPopRef.value.show(false)
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
