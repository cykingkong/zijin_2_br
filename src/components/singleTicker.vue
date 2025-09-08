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
    colorTheme: 'dark',
    locale: 'en',
    chartId: "",
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
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
        script.async = true;

        // 配置Symbol Overview组件
        script.innerHTML = JSON.stringify({
            "symbol": props.symbol,
            "noTimeScale": true,
            "colorTheme": "light",
            "isTransparent": false,
            "locale": "en",
            "width": "100%",
            "autosize": true,
        });
        const container = document.getElementById(widgetId.value);
        if (container) {
            container.innerHTML = "";
            container.appendChild(script);
            // 监听组件加载完成后隐藏logo
            script.onload = () => {
                setTimeout(() => {
                    hideTradingViewLogo();
                }, 1000); // 等待组件完全加载
            };
        }
    }, 100);
};
// 隐藏logo的函数
const hideTradingViewLogo = () => {
    const container = document.getElementById(widgetId.value);
    if (container) {
        // 查找并隐藏logo元素
        const logoSelectors = [
            '.tv-lightweight-charts__logo',
            '[class*="logo"]',
            '[class*="Logo"]',
            '[class*="branding"]',
            '[class*="Branding"]',
            '[class*="js-copyright-label"]',
            '.tv-lightweight-charts__branding',
            '.tv-lightweight-charts__watermark'
        ];

        logoSelectors.forEach(selector => {
            console.log(selector, 'asldalksjd')
            const elements = container.querySelectorAll(selector);
            elements.forEach(el => {
                if (el instanceof HTMLElement) {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                }
            });
        });

        // 隐藏包含logo的图片
        const logoImages = container.querySelectorAll('img[src*="tradingview"], img[src*="logo"]');
        logoImages.forEach(img => {
            if (img instanceof HTMLElement) {
                img.style.display = 'none';
                img.style.visibility = 'hidden';
                img.style.opacity = '0';
            }
        });
    }
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

// 隐藏TradingView logo
:deep(.tradingview-widget-container__widget) {

    // 方法1：隐藏整个logo区域
    .tv-lightweight-charts__logo {
        display: none !important;
    }

    // 方法2：隐藏logo图片
    img[src*="tradingview"],
    img[src*="logo"],
    .tv-lightweight-charts__logo img {
        display: none !important;
    }

    // 方法3：隐藏包含logo的容器
    [class*="logo"],
    [class*="Logo"],
    [class*="branding"],
    [class*="Branding"],
    [ class*="js-copyright-label"

    ] {
        display: none !important;
    }

    // 方法4：隐藏右下角的TradingView标识
    .tv-lightweight-charts__branding {
        display: none !important;
    }

    // 方法5：隐藏水印
    .tv-lightweight-charts__watermark {
        display: none !important;
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
