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
    chartId?: string;         // 组件ID
}

const props = withDefaults(defineProps<Props>(), {
    symbol: '',
    exchange: '',
    width: '100%',
    height: '100%',
    colorTheme: 'dark',
    locale: 'en',
    chartId: "",
    isTransparent: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    "dateRange": "1D",
    showChart: true,
    largeChartUrl: '',
});

const widgetKey = ref(0);
const tradingviewWidget = ref<HTMLElement | null>(null);

// 生成唯一的widget ID
const widgetId = computed(

    () => `tradingview_kline_detail_widget_${widgetKey.value}_${props.symbol.replace(/[^a-zA-Z0-9]/g, '_')}_${props.chartId}`
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
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.async = true;

        // 配置Symbol Overview组件
        script.innerHTML = JSON.stringify({
            "symbol": props.symbol,
            "chartOnly": false,
            "dateRange": "1D",
            "noTimeScale": true,
            "colorTheme": "light",
            "isTransparent": false,
            "locale": "en",
            "width": "100%",
            "autosize": true,
            "height": "100%"
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
    // min-height: 400px;

    &__widget {
        width: 100%;
        height: 100%;
    }
}

// 响应式设计
@media (max-width: 768px) {
    .tradingview-widget-container {
        // min-height: 300px;
    }
}

@media (max-width: 480px) {
    .tradingview-widget-container {
        // min-height: 250px;
    }
}
</style>
