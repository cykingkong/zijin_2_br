<template>
    <div ref="tradingviewWidget" class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget Hotmap"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tradingviewWidget = ref<HTMLElement | null>(null)

onMounted(() => {
    if (!tradingviewWidget.value) return

    // 动态创建脚本
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js'
    script.async = true
    script.type = 'text/javascript'

    // 配置参数
    script.innerHTML = JSON.stringify({
        "exchanges": [],
        "dataSource": "SPX500",
        "grouping": "no_group",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "600"
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
        z-index: 1;
    }
}
</style>
