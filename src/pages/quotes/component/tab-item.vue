<script setup>
import echarts from '@/components/echarts.vue'
import Kline from '@/components/Kline.vue'
import { addCommasToNumber } from '@/utils/tool'
const tabList = [
  {
    price: [2.99, 32.99, 33, 32.95, 32.9],
    increase: -2,
  },
  {
    price: [32.99, 32.99, 33, 32.95, 32.9],
    increase: 1,
  },
  {
    price: [132.99, 532.99, 233, 832.95, 1132.9],
    increase: -2,
  },
]
const props = defineProps({
  item: {
    type: Object,
    default: () => { }
  }
})
</script>
<route lang="json5">
  {
    name: 'accountChange',
    path: '/quotes/accountChange/:accountChange', // 添加静态路径段明确层级
    meta: {
      title: 'accountChange',
      i18n: 'menus.accountChange'
    }
  }
</route>
<template>
  <div class="tab-item">
    <div class="indicator-content flex">
      <div v-for="(i, k) in item" :key="i" class="indicator-item" :class="i.dayIncrease >= 0 ? 'up-bg' : 'down-bg'">
        <div class="title">
          {{ i.tradingInfo.baseAssetInfo.name }}
        </div>
        <div class="num">
          {{ addCommasToNumber(i.lastPrice) }}
        </div>
        <div class="value">
          {{ i.dayIncrease }} %

        </div>
        <div class="chart">
          <Kline :nameId="'myChart10' + k" :areaStyle="true" :increase="i.increase" :data="i.price" height="50px"
            width="100%"></Kline>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tab-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .indicator-content {
    width: 100%;
    gap: 6px;
    padding: 0 12px;

    .indicator-item {
      width: 33%;
      height: auto;
      border-radius: 8px;
      padding: 12px;

      .title {
        font-size: 12px;
        color: var(--van-text);
        line-height: 16px;
      }

      .num {
        font-size: 16px;
        line-height: 24px;
      }

      .value {
        font-size: 12px;
        line-height: 24px;
      }
    }

    .up-bg {
      background-image: var(--up-bg);

      .num {
        color: #06cda5 !important;
      }

      .chart {
        // background: #06cda5 !important;
        width: 100%;
        height: 55px;
      }
    }

    .down-bg {
      background-image: var(--down-bg);

      .num {
        color: #f43368 !important;
      }


    }
  }
}
</style>
