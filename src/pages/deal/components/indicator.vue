<template>
    <div class="indicator-content pb-12px">
        <div class="tab-box flex gap-4 px-12 py-12">
            <div class="tab-item flex-1 rounded-4 line-height-24 h-24 text-align-center"
                v-for="(item, index) in tabList" :key="index" :class="{ 'active': index === activeIndex }"
                @click="changeTab(index)">
                <span>{{ item.label }}</span>
            </div>
        </div>

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
const tabList = ref([
    {
        label: 'IPO',
        value: '1',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
    },
    {
        label: '折扣股',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
        value: '2'
    },
    {
        label: '基金',
        th: ['市值', '盈亏', '持仓/可用', '成本/现价'],
        value: '3'
    },
    {
        label: '股息',
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
        // border-bottom: 1px solid #212C4E
    }
}
</style>