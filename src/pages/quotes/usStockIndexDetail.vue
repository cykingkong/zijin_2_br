<template>
  <div ref="tradingviewWidget" class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tradingviewWidget = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!tradingviewWidget.value) return

  // 动态创建脚本
  const script = document.createElement('script')
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js'
  script.async = true
  script.type = 'text/javascript'

  // 配置参数
  script.innerHTML = JSON.stringify({
    "exchange": "NYSE",
    "colorTheme": "light",
    "dateRange": "12M",
    "showChart": true,
    "locale": "en",
    "largeChartUrl": "",
    "isTransparent": false,
    "showSymbolLogo": false,
    "showFloatingTooltip": false,
    "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
    "plotLineColorFalling": "rgba(41, 98, 255, 1)",
    "gridLineColor": "rgba(240, 243, 250, 0)",
    "scaleFontColor": "#DBDBDB",
    "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
    "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
    "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
    "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
    "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
    "width": "100%",
    "height": "550"
  })

  // 设置容器高度
  tradingviewWidget.value.style.height = '600px'

  // 添加脚本到DOM
  tradingviewWidget.value.appendChild(script)
})
</script>

<style lang="less" scoped>
.tradingview-widget-container {
  width: 100%;
  height: 100%;
  min-height: 400px;

  &__widget {
    width: 100%;
    height: 100%;
  }
}
</style>
