<template>
    <div class="indicator-content pb-12px">
        <div class="tab-box flex gap-4 px-12 py-12">
            <div class="tab-item flex-1 rounded-4 line-height-24 h-24 text-align-center"
                v-for="(item, index) in tabList" :key="index" :class="{ 'active': index === activeIndex }"
                @click="changeTab(index)">
                <span>{{ item.label }}</span>
            </div>
        </div>

        <div class="asset px-12 font-size-12" v-if="userInfo">
            <div class="line flex">
                <div class="line-item flex-1 text-align-left">
                    <p class="title">
                        {{ tabList[activeIndex].label }} 总资产
                    </p>
                    <p class="content">
                        $ {{ addCommasToNumber(userInfo.assetsBalance.availableBalanceUsd) }}
                    </p>
                </div>
                <div class="line-item flex-1 text-align-right">
                    <p class="title">
                        浮动盈亏
                    </p>
                    <p class="content "
                        :class="{ up: userInfo.assetsData.totalProfitRate >= 0, down: userInfo.assetsData.totalProfitRate < 0 }">
                        {{ userInfo.assetsData.totalProfitRate }} %
                    </p>
                </div>
            </div>
            <div class="line flex">
                <div class="line-item flex-1 text-align-left">
                    <p class="title">
                        可用余额
                    </p>
                    <p class="content">
                        $ {{ addCommasToNumber(userInfo.assetsBalance.availableBalanceBrl) }}

                        <!-- $ {{ userInfo.asset[1].balance || "" }} -->
                    </p>
                </div>
                <div class="line-item flex-1 text-align-right">
                    <p class="title">
                        总投入
                    </p>
                    <p class="content "
                        :class="{ up: userInfo.assetsData.totalAmount >= 0, down: userInfo.assetsData.totalAmount < 0 }">
                        {{ userInfo.assetsData.totalAmount }}
                    </p>
                </div>
            </div>
        </div>
        <div class="divdiver"></div>
        <div class="indicator-td flex " v-if="activeIndex === 0">
            <ipo :only-show-order="true"></ipo>
        </div>
        <div class="indicator-td flex " v-if="activeIndex === 1">
            <discount :only-show-order="true"></discount>
        </div>
        <div class="indicator-td flex " v-if="activeIndex === 2">
            <fund :only-show-order="true"></fund>
        </div>
        <div class="indicator-td flex " v-if="activeIndex === 3">
            <dividend :only-show-order="true"></dividend>
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
const userStore = useUserStore()
const assetsData = computed(() => userStore.userInfo.assetsData)
const activeAssetsData = ref()
const userInfo = computed(() => userStore.userInfo)

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
        objKey: 'dividendAssetsData',
        value: '4'
    },
    {
        label: 'IPO',
        value: '1',
        objKey: 'ipoAssetsData',
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

    activeIndex.value = index
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