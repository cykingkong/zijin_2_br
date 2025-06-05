<template>
    <div class="rank-content">
        <div v-for="(i, k) in rankList" :key="k" class="rank-item" @click="handleClickLi(i)">
            <div class="rank-title flex items-center">
                <div class="flex-l font-size-16">{{ i.tradingInfo.baseAssetInfo.symbol }}</div>
                <div class="flex-r">
                    <div class="flex-r-item flex items-center up">
                        <Kline :nameId="'myChart10' + k + categoryId" :areaStyle="true" :increase="i.dayIncrease"
                            :data="i.price" :height="vw(50)" :width="vw(80)" v-if="i.price && i.price.length > 0">
                        </Kline>
                    </div>
                    <div class="flex-r-item" :class="{ up: i.increase >= 0, down: i.increase < 0 }">{{ i.increase }}%
                    </div>
                    <div class="flex-r-item last-item">
                        {{ i.tradingInfo.baseAssetInfo ?
                            i.tradingInfo.baseAssetInfo.unit : '' }} {{ addCommasToNumber(i.lastPrice) }}
                    </div>
                </div>
            </div>
            <div class="rank-text"></div>
        </div>
        <empty v-if="rankList.length == 0" :noTips="true"></empty>

        <LoadMore :status="rankListStatus" @load-more="loadMore" />
    </div>
</template>
<script setup>
import LoadMore from '@/components/LoadMore.vue';
import KlineSvg from '@/components/KlineSvg.vue';
import vw from '@/utils/inline-px-to-vw'

import { addCommasToNumber } from '@/utils/tool'
import local from '@/utils/local'
const emits = defineEmits(['loadMore'])
const loadMore = () => {
    emits('loadMore')
}
const props = defineProps({
    rankList: {
        type: Array,
        default: () => [],
    },
    categoryId: {
        type: Number,
    },
    rankListStatus: {
        type: Number
    }
})
const router = useRouter()

const handleClickLi = (i) => {
    local.setlocal('rankInfo', i)
    router.push('/quotes/detail?id=' + i.tradingPairsId + '&categoryId=' + props.categoryId)
}
</script>
<style scoped lang="less">
.rank-content {
    width: 100%;

    padding-bottom: 20px;
    background: var(--rank-bg);

    .rank-item {
        width: 100%;
        padding: 14px 12px;
        border-bottom: 1px solid var(--van-gray-7);

        // &:last-child {
        //   border: none;
        // }
        .rank-title {
            width: 100%;
            font-size: 12px;
            line-height: 18px;

            .flex-l {
                width: 40%;
                flex-shrink: 0;
            }

            .flex-r {
                flex: 1;
                display: flex;
                align-items: center;

                .flex-r-item {
                    flex: 1;
                    align-self: center;
                    text-align: center;

                }

                .up {
                    color: var(--up)
                }

                .down {
                    color: var(--down)
                }

                .last-item {
                    text-align: right;
                }
            }
        }
    }

    .rank-text {
        color: #bcbdc2;
        font-size: 12px;
    }

    .more {
        width: 100%;
        height: 70px;
        line-height: 70px;
        text-align: center;
        color: var(--van-gray-6);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;

        .icon {
            width: 7px;
            height: 10px;
        }
    }
}
</style>
