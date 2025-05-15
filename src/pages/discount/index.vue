<template>
    <div class="discont-content px-12 w-full">
        <template v-if="!onlyShowOrder">
            <van-tabs v-model:active="active" @change="changeActive">
                <!-- 折扣股玩法 -->
                <van-tab title="折扣股票列表">
                    <div class="discont-list  flex flex-col pb-40">
                        <discont-item :item="item" v-for="(item, index) in list" :key="index"
                            @handleClickBtn="handleClickBtn"></discont-item>
                        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                            v-show="skeleton && list.length == 0" v-for="i in 5"></div>
                        <empty v-if="list.length == 0 && !skeleton" :noTips="true"></empty>
                        <LoadMore :status="listStatus" @load-more="loadMore" />
                    </div>
                </van-tab>
                <van-tab title="持仓订单">
                    <div class="discont-list flex flex-col pb-40">
                        <discont-item :item="item" v-for="(item, index) in orderList" :key="index"
                            @handleClickBtn="handleClickBtn" :item-type="'order'"></discont-item>
                        <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                            v-show="skeleton && orderList.length == 0" v-for="i in 5">
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
                <div class="skeleton w-full h-170 rounded-10px bg-coolgray skeleton-animation mt-12"
                    v-show="skeleton && orderList.length == 0" v-for="i in 5">
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
const loadingStore = useLoadingStore()

const { proxy } = getCurrentInstance()!
const props = defineProps({
    onlyShowOrder: {
        type: Boolean,
        default: false
    }
})

const active = ref(0)
const list = ref([])
const orderList = ref([])
const popType = ref('buy') // buy:购买  sell:出售
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
    // resetPage()
    listStatus.value = 1
    discountList({
        ...page
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
        ...page
    }).then(res => {
        if (!res.data.rows) {
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
    if (props.onlyShowOrder) {
        getOrderList()
    } else {
        getDisountList()
    }
    route.meta.title = '新的标题'  // 设置你需要的标题
})

</script>
<route lang="json5">
    {
      name: 'discount',
      meta: {
        title: '折扣股',
        // 添加动态更新标题的方法
        updateTitle(newTitle: string) {
          this.title = newTitle
          document.title = newTitle
        }
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
