<template>
    <div class="rank-content">
        <div v-for="(i, k) in rankList" :key="k" class="rank-item">
            <div class="rank-title flex">
                <div class="flex-l">{{ i.tradingInfo.baseAssetInfo.symbol }}</div>
                <div class="flex-r">
                    <div class="flex-r-item flex items-center up">{{ i.dayIncrease }}%
                        <!-- <Kline :nameId="'myChart10' + k + 1" :areaStyle="true" :increase="i.increase" :data="i.price"
                            height="20px" width="50px"></Kline> -->
                    </div>
                    <div class="flex-r-item up">{{ i.increase }}%</div>
                    <div class="flex-r-item last-item">
                        0.00M
                    </div>
                </div>
            </div>
            <div class="rank-text"></div>
        </div>
        <div class="more">
            更多 <img :src="more" alt="" class="icon">
        </div>
    </div>
</template>
<script setup>
import more from '@/assets/image/icon-right.png';
// import Kline from '@/components/Kline.vue';

const props = defineProps({
    rankList: {
        type: Array,
        default: () => [],
    }
})
</script>
<style scoped lang="less">
.rank-content {
    width: 100%;
    padding-bottom: 70px;
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
