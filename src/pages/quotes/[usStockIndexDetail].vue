<template>

  <div class="commodities-content">

    <!-- <echarts></echarts> -->

    <!-- TradingView图表容器 -->
    <!-- <div id="tradingview-chart" style="width: 100%; height: 400px"></div> -->

  </div>
</template>
<route lang="json5">
  {
    name: 'usStockIndexDetail',
    path: '/quotes/usStockIndexDetail/:usStockIndexDetail?', // 保留可选参数保证路由唯一性
    meta: {
      title: '交易',
    }
  }
</route>
<script setup lang="ts">
import { ref, reactive } from "vue"
import echarts from "@/components/Eharts/charts.vue"
const timeActive = ref('1m')
const time = ref([
  '1m',
  '5m',
  '15m',
  '30m',
  '60m',
  '4h',
  '1d',
  '1w',
])

// 新增TradingView相关声明
declare global {
  interface Window {
    TradingView: any;
    chartReady: boolean;
    updateChartSymbol: (newSymbol: string) => void;
  }
}
// 新增图表相关状态
const chartWidget = ref(null)
const isDarkTheme = computed(() => document.documentElement.classList.contains('dark'))

// 初始化TradingView图表
const initTradingViewChart = () => {
  if (window.TradingView) {
    chartWidget.value = new window.TradingView.widget({
      width: '100%',
      height: 400,
      symbol: 'NASDAQ:AAPL',
      interval: 'D',
      timezone: 'Asia/Shanghai',
      theme: isDarkTheme.value ? 'dark' : 'light',
      style: '1',
      toolbar_bg: 'var(--van-background-2)',
      withdateranges: true,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      details: true,
      container_id: 'tradingview-chart',
      onChartReady: () => {
        console.log('Chart ready!');
        window.chartReady = true;
      }
    });

    // 暴露更新图表的方法
    window.updateChartSymbol = (newSymbol) => {
      if (chartWidget.value && window.chartReady) {
        chartWidget.value.setSymbol(newSymbol, 'D', (success) => {
          if (!success) {
            console.error('Failed to update chart symbol');
          }
        });
      }
    };
  }
}

// 动态加载CDN脚本
const loadTradingViewScript = () => {
  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/tv.js'
  script.async = true
  script.onload = initTradingViewChart
  document.head.appendChild(script)
}
onMounted(() => {
  // 加载TradingView脚本
  loadTradingViewScript()

})
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid var(--border_color)
}
</style>
