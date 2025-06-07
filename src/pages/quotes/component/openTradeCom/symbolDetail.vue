<template>
  <div class="tradingview-widget-container">
    <div :id="widgetId" :key="widgetKey" class="tradingview-widget-container__widget"></div>
    <div :id="widgetId + '_company'" :key="widgetKey + '_company'" class="tradingview-widget-container__widget_company">
    </div>
  </div>
</template>

<script setup lang="ts">
import { showLoadingToast } from 'vant'
import { ref, onMounted, watch, nextTick, computed } from 'vue'

const widgetKey = ref(0)

const props = defineProps({
  symbol: {
    type: String,
    required: true,
    default: 'AAPL'
  }
})

// 生成唯一的widget ID
const widgetId = computed(() => `tradingview_widget_${widgetKey.value}`)
const widgetIdCompany = computed(() => `tradingview_widget_${widgetKey.value}_company`)
const { t } = useI18n()
// 创建TradingView图表
const createWidgetCompany = async () => {
  showLoadingToast({
    message: t('Loading'),
    duration: 1500
  })


  await nextTick()

  // 延迟一点确保DOM完全更新
  setTimeout(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-profile.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      "symbol": `NASDAQ:${props.symbol}`,
      "width": '100%',
      "height": 500,
      "locale": "en",
      "colorTheme": "dark",
      "isTransparent": false
    })

    const container = document.getElementById(widgetIdCompany.value)
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
    }
  }, 100)
}
// 创建TradingView图表
const createWidget = async () => {
  console.log('createWidget')
  widgetKey.value++

  await nextTick()

  // 延迟一点确保DOM完全更新
  setTimeout(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-financials.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      "symbol": `NASDAQ:${props.symbol}`,
      "width": '100%',
      "height": 500,
      "locale": "en",
      "colorTheme": "dark",
      "isTransparent": false
    })

    const container = document.getElementById(widgetId.value)
    if (container) {
      container.innerHTML = ''
      container.appendChild(script)
    }
  }, 100)
}
onMounted(() => {
  createWidget()
  createWidgetCompany()
})

watch(() => props.symbol, () => {
  if (props.symbol) {
    createWidget()
    createWidgetCompany()
  }
})
</script>

<style lang="less" scoped>
.tradingview-widget-container {
  width: 100%;
  height: 100%;
  min-height: 600px;

  &__widget {
    width: 100%;
    // height: 100%;
  }

  &__widget_company {
    width: 100%;
    // height: 100%;
  }
}
</style>
