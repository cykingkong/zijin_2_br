<template>
    <div class="indicator-content pb-12px">
        <div class="tab-box flex gap-4 px-12 py-12">
            <div class="tab-item flex-1 rounded-4 line-height-24 h-24 text-align-center"
                v-for="(item, index) in tabList" :key="index" :class="{ 'active': index === activeIndex }"
                @click="changeTab(index)">
                <span>{{ item.label }}</span>
            </div>
        </div>

        <div v-if="userInfo" class="asset px-12 font-size-12">
            <div class="line flex">
                <div class="line-item flex-1 text-align-left">
                    <p class="title">
                        总投入
                    </p>
                    <p class="content " v-show="activeName == '1'">
                        {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalAmountUsd }}
                    </p>
                    <p class="content " v-show="activeName == '2'">
                        {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalAmountBrl }}
                    </p>
                </div>
                <div class="line-item flex-1 text-align-center">
                    <p class="title">
                        总收益
                    </p>
                    <p class="content " v-show="activeName == '1'"
                        :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitUsd >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitUsd < 0 }">
                        {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalProfitUsd }}
                    </p>
                    <p class="content " v-show="activeName == '2'"
                        :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitBrl >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitBrl < 0 }">
                        {{ activeName == '1' ? '$' : 'R$' }} {{ userInfo[tabList[activeIndex].objKey].totalProfitBrl }}
                    </p>
                </div>
                <div class="line-item flex-1 text-align-right">
                    <p class="title">
                        浮动盈亏
                    </p>
                    <p class="content " v-if="activeName == '1'"
                        :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitRateUsd >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitRateUsd < 0 }">
                        {{ userInfo[tabList[activeIndex].objKey].totalProfitRateUsd }} %
                    </p>
                    <p class="content " v-if="activeName == '2'"
                        :class="{ up: userInfo[tabList[activeIndex].objKey].totalProfitRateBrl >= 0, down: userInfo[tabList[activeIndex].objKey].totalProfitRateBrl < 0 }">
                        {{ userInfo[tabList[activeIndex].objKey].totalProfitRateBrl }} %
                    </p>
                </div>
            </div>
            <div class="line flex">

            </div>
        </div>
        <div class="divdiver"></div>
        <div class="indicator-td flex " v-if="activeIndex === 0">
            <discount :only-show-order="true" :categoryId="activeName == '1' ? '200' : '201'"></discount>
        </div>
        <div class="indicator-td flex " v-if="activeIndex === 1">
            <fund :only-show-order="true"></fund>

        </div>
        <div class="indicator-td flex " v-if="activeIndex === 2">
            <dividend :only-show-order="true" :categoryId="activeName == '1' ? '200' : '201'"></dividend>

        </div>
        <div class="indicator-td flex " v-if="activeIndex === 3">
            <ipo :only-show-order="true"></ipo>

        </div>
        <div class="indicator-td flex flex-col px-12" v-if="activeIndex === 4">
            <EntrustItem v-for="item in orderList" :key="item.order_no" :entrust="item" state="submitted"
                @cancelOrder="cancelOrder" />
            <Empty v-if="orderList.length == 0" />
            <LoadMore :status="orderLoadStatus" @load-more="loadMore"></LoadMore>

        </div>
    </div>
</template>
<script setup>
import ipo from '../../ipo/index.vue'
import discount from '../../discount/index.vue'
import fund from '../../fund/index.vue'
import dividend from '../../dividend/index.vue'
import { addCommasToNumber } from '@/utils/tool'
import { useUserStore } from '@/stores'
import { swapOrderAdd, swapOrderCancel, orderList as swapOrderList, getPosition, assetsLogsGrid } from '@/api/swap'

import EntrustItem from "@/pages/quotes/component/openTradeCom/EntrustItem.vue";




const orderLoadStatus = ref(0)
const userStore = useUserStore()
const assetsData = computed(() => userStore.userInfo.assetsData)
const activeAssetsData = ref()
const userInfo = computed(() => userStore.userInfo)
const props = defineProps({
    activeName: {
        type: String,
    }
})
const tabList = ref([
    {
        label: '折扣股',
        objKey: 'discountAssetsData',
        value: '2'
    },
    {
        label: '基金',
        objKey: 'fundAssetsData',
        value: '3'
    },
    {
        label: '股息',
        // objKey: 'dividendAssetsData',
        objKey: 'discountFundData',
        value: '4'
    },
    {
        label: 'IPO',
        value: '1',
        objKey: 'ipoAssetsData',

    },
    {
        label: '股票',
        value: '1',
        // objKey: 'ipoAssetsData',
        objKey: 'bondAssetsData',
    },
]
)

const activeIndex = ref(0)

const getUserInfoByObjKey = (value) => {
    for (const key in assetsData.value) {
        if (key == value) {
            return assetsData.value[key]
        }
    }
}

const changeTab = (index) => {
    // userStore.getAssetsData()
    console.log(userInfo?.value[tabList.value[activeIndex.value].objKey])
    if (index == 4) {
        getOrderList()
    }
    activeIndex.value = index
}

const page = reactive({
    pageIndex: 1,
    pageSize: 10,
})
const orderList = ref([])
const getOrderList = async (params = {}) => {
    orderLoadStatus.value = 1
    const { data, code } = await swapOrderList({
        ...page,
        ...params,
        categoryId: props.activeName == '1' ? '200' : '201'
    })
    if (code == 200) {
        // showToast('购入成功')
        if (!data.rows) {
            orderLoadStatus.value = 3
            return
        }
        if (page.pageIndex == 1) {
            orderList.value = data.rows || []

        } else {
            orderList.value = [...orderList.value, ...(data.rows || [])]
        }
        if (data.total <= orderList.value.length) {
            orderLoadStatus.value = 3
            return
        }
        orderLoadStatus.value = 2

    }

}
const cancelOrder = (val) => {
    let params = {
        id: val.id
    }
    swapOrderCancel(params).then(res => {
        if (res.code == 200) {
            showToast('撤单成功')
            orderList.value = []

            if (val.type == 'status1') {
                getOrderListStatus0(params)
                return
            }
            getOrderList(params)
        }
    })
}
</script>
<style lang="less" scoped>
.indicator-content {
    width: 100%;
    height: 100%;
    // background: var(--bg);

    .tab-box {
        width: 100%;

        .tab-item {
            font-size: 12px;
            transition: all 0.3s;
        }

        .active {
            background: var(--btn-bg);
        }
    }

    .indicator-th {
        font-size: 12px;
    }

    .indicator-td {
        // border-bottom: 1px solid #212C4E
    }
}

.divdiver {
    width: 100%;
    height: 2px;
    background: #363d51;

}
</style>