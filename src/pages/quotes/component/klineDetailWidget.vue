<template>
    <div ref="tradingviewWidget" class="tradingview-widget-container" v-if="symbol">
        <div :id="widgetId" class="tradingview-widget-container__widget"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, computed } from "vue";

interface Props {
    symbol: string;           // 股票代码
    exchange?: string;        // 交易所
    width?: string;           // 宽度
    height?: string;          // 高度
    colorTheme?: 'light' | 'dark' | 'auto';  // 主题
    locale?: string;          // 语言
    isTransparent?: boolean;  // 是否透明
    showSymbolLogo?: boolean; // 是否显示股票logo
    showFloatingTooltip?: boolean; // 是否显示浮动提示
    dateRange?: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL'; // 时间范围
    showChart?: boolean;      // 是否显示图表
    largeChartUrl?: string;   // 大图链接
}

const props = withDefaults(defineProps<Props>(), {
    symbol: '',
    exchange: '',
    width: '100%',
    height: '400',
    colorTheme: 'dark',
    locale: 'en',
    isTransparent: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    "dateRanges": [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M"
    ],
    showChart: true,
    largeChartUrl: '',
});

const widgetKey = ref(0);
const tradingviewWidget = ref<HTMLElement | null>(null);

// 生成唯一的widget ID
const widgetId = computed(
    () => `tradingview_kline_detail_widget_${widgetKey.value}_${props.symbol.replace(/[^a-zA-Z0-9]/g, '_')}`
);

const { locale: i18nLocale } = useI18n();

// 创建TradingView Symbol Overview组件
const createWidget = async () => {
    console.log("创建K线详情组件", props.symbol);
    widgetKey.value++;

    await nextTick();

    // 延迟一点确保DOM完全更新
    setTimeout(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.async = true;

        // 配置Symbol Overview组件
        script.innerHTML = JSON.stringify({
            "lineWidth": 2,
            "lineType": 0,
            "chartType": "area",
            "fontColor": "rgb(106, 109, 120)",
            "gridLineColor": "rgba(46, 46, 46, 0.06)",
            "volumeUpColor": "rgba(34, 171, 148, 0.5)",
            "volumeDownColor": "rgba(247, 82, 95, 0.5)",
            "backgroundColor": "#ffffff",
            "widgetFontColor": "#0F0F0F",
            "upColor": "#22ab94",
            "downColor": "#f7525f",
            "borderUpColor": "#22ab94",
            "borderDownColor": "#f7525f",
            "wickUpColor": "#22ab94",
            "wickDownColor": "#f7525f",
            "colorTheme": "light",
            "isTransparent": false,
            "locale": "en",
            "chartOnly": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "symbols": [
                [
                    props.exchange ? `${props.symbol}` : props.symbol
                ]
            ],
            "dateRanges": [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ],
            "fontSize": "10",
            "headerFontSize": "medium",
            "autosize": true,
            "width": "100%",
            "height": "100%",
            "noTimeScale": false,
            "hideDateRanges": false,
            "hideMarketStatus": false,
            "hideSymbolLogo": false
        });
        const container = document.getElementById(widgetId.value);
        if (container) {
            container.innerHTML = "";
            container.appendChild(script);
        }
    }, 100);
};

// 监听symbol变化
watch(
    () => props.symbol,
    (newSymbol, oldSymbol) => {
        if (newSymbol && newSymbol !== oldSymbol) {
            console.log("股票代码变化，重新创建组件:", newSymbol);
            createWidget();
        }
    }
);

// 监听其他重要属性变化
watch(
    () => [props.colorTheme, props.locale, props.dateRange, props.showChart],
    () => {
        if (props.symbol) {
            console.log("组件配置变化，重新创建组件");
            createWidget();
        }
    }
);

onMounted(() => {
    if (props.symbol) {
        createWidget();
    }
});

// 暴露方法给父组件
defineExpose({
    createWidget,
    widgetId: widgetId.value
});
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

// 响应式设计
@media (max-width: 768px) {
    .tradingview-widget-container {
        min-height: 300px;
    }
}

@media (max-width: 480px) {
    .tradingview-widget-container {
        min-height: 250px;
    }
}
</style>
