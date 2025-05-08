<template>
    <div class="indicator-content pb-12px">
        <div class="tab-box flex gap-4 px-12 py-12">
            <div class="tab-item flex-1 rounded-4 line-height-24 h-24 text-align-center"
                v-for="(item, index) in tabList" :key="index" :class="{ 'active': index === activeIndex }"
                @click="changeTab(index)">
                <span>{{ item.label }}</span>
            </div>
        </div>
        <div class="indicator-th flex text-align-center  px-12">
            <div class="th w-100 flex-shrink-0 text-align-left">{{ tabList[activeIndex].th[0] }}</div>
            <div class="th-r flex flex-1">
                <div class="th flex-1">{{ tabList[activeIndex].th[1] }}</div>
                <div class="th flex-1">{{ tabList[activeIndex].th[2] }}</div>
                <div class="th flex-1">{{ tabList[activeIndex].th[3] }}</div>
            </div>

        </div>
        <div class="indicator-td flex text-align-center font-size-12 px-12 py-14" v-for="i in 4">
            <div class="td-l w-100 flex-shrink-0 text-align-left">
                <div class="l-title">BBRI</div>
                <div class="l-gary-text">5173 USD</div>
            </div>
            <div class="td-r flex-1 flex">
                <div class="td-item flex-1 ">
                    <div class="item-text up">133</div>
                    <div class="item-text up">324</div>
                </div>
                <div class="td-item flex-1 ">
                    <div class="item-text up">133</div>
                    <div class="item-text up">324</div>
                </div>
                <div class="td-item flex-1 ">
                    <div class="item-text up">133</div>
                    <div class="item-text up">324</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>


const tabList = ref([
    {
        label: '持仓',
        value: '1',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
    },
    {
        label: '委托',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
        value: '2'
    },
    {
        label: '成交',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
        value: '3'
    },
    {
        label: '自选',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
        value: '4'
    },

]
)

const activeIndex = ref(0)

const changeTab = (index) => {
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
        border-bottom: 1px solid #212C4E
    }
}
</style>