<template>
    <div ref="tradingviewWidget" class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const tradingviewWidget = ref<HTMLElement | null>(null)
const route = useRouter()
onMounted(() => {
    if (!tradingviewWidget.value) return
    console.log(route, 'Tttttttt')
    // 动态创建脚本
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.type = 'text/javascript'

    // 配置参数
    script.innerHTML = JSON.stringify({
        "symbols": [
            {
                "proName": "FOREXCOM:SPXUSD",
                "title": "S&P 500 Index"
            },
            {
                "proName": "FOREXCOM:NSXUSD",
                "title": "US 100 Cash CFD"
            },
            {
                "proName": "FX_IDC:EURUSD",
                "title": "EUR to USD"
            },
            {
                "proName": "BITSTAMP:BTCUSD",
                "title": "Bitcoin"
            },
            {
                "proName": "BITSTAMP:ETHUSD",
                "title": "Ethereum"
            }
        ],
        "showSymbolLogo": false,
        "isTransparent": false,
        "largeChartUrl": "http://localhost:3200/ipo",
        "displayMode": "compact",
        "colorTheme": "dark",
        "locale": "en"
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
    // min-height: 400px;
    // background: #131a2e;

    &__widget {
        width: 100%;
        height: 100%;
    }
}
</style>
