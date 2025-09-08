<template>
    <div class="mini-chart-list">
        <div v-for="(item, index) in stockList" :key="`chart-${index}-${item.symbol || item.tradingview_name}`"
            class="chart-item mb-12px border" :class="itemClass" @click="handleItemClick(item, index)">
            <div :id="`tradingview-widget-${index}`" class="tradingview-widget-container">
                <div :id="`tradingview-widget-${index}-inner`" class="tradingview-widget-container__widget"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from "vue";

interface StockItem {
    symbol?: string;
    tradingview_name?: string;
    [key: string]: any;
}

interface Props {
    stockList: StockItem[];
    width?: string;
    height?: string;
    colorTheme?: 'light' | 'dark' | 'auto';
    locale?: string;
    isTransparent?: boolean;
    showSymbolLogo?: boolean;
    showFloatingTooltip?: boolean;
    dateRange?: '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';
    showChart?: boolean;
    itemClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
    stockList: () => [],
    width: '100%',
    height: '100%',
    colorTheme: 'light',
    locale: 'en',
    isTransparent: false,
    showSymbolLogo: true,
    showFloatingTooltip: false,
    dateRange: '1D',
    showChart: true,
    itemClass: ''
});

const emit = defineEmits<{
    itemClick: [item: StockItem, index: number];
}>();

// 全局状态管理，确保整个应用只加载一次脚本
const globalTradingViewState = {
    scriptLoaded: false,
    scriptLoading: false,
    scriptElement: null as HTMLScriptElement | null,
    loadPromise: null as Promise<void> | null
};

// 加载 TradingView 脚本
const loadTradingViewScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (globalTradingViewState.scriptLoaded) {
            resolve();
            return;
        }

        if (globalTradingViewState.loadPromise) {
            globalTradingViewState.loadPromise.then(resolve).catch(reject);
            return;
        }

        // 检查是否已经存在脚本
        const existingScript = document.querySelector('script[src*="embed-widget-mini-symbol-overview.js"]');
        if (existingScript) {
            globalTradingViewState.scriptLoaded = true;
            resolve();
            return;
        }

        globalTradingViewState.scriptLoading = true;
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.async = true;

        globalTradingViewState.loadPromise = new Promise<void>((scriptResolve, scriptReject) => {
            script.onload = () => {
                globalTradingViewState.scriptLoaded = true;
                globalTradingViewState.scriptLoading = false;
                globalTradingViewState.scriptElement = script;
                scriptResolve();
            };

            script.onerror = () => {
                globalTradingViewState.scriptLoading = false;
                globalTradingViewState.loadPromise = null;
                scriptReject(new Error('Failed to load TradingView script'));
            };
        });

        document.head.appendChild(script);
        globalTradingViewState.loadPromise.then(resolve).catch(reject);
    });
};

const chartsCreated = ref(new Set<number>());

// 创建单个图表 - 使用与原始 miniChart 相同的方式
const createChart = async (item: StockItem, index: number) => {
    if (chartsCreated.value.has(index)) {
        return;
    }

    try {
        await loadTradingViewScript();
        await nextTick();

        const widgetId = `tradingview-widget-${index}`;
        const container = document.getElementById(widgetId);

        if (!container) {
            console.warn(`Container ${widgetId} not found`);
            return;
        }

        // 清空容器
        container.innerHTML = '';

        // 创建内层容器
        const innerContainer = document.createElement('div');
        innerContainer.id = `${widgetId}-inner`;
        innerContainer.className = 'tradingview-widget-container__widget';
        container.appendChild(innerContainer);

        // 延迟一点确保DOM完全更新
        setTimeout(() => {
            const symbol = item.tradingview_name || item.symbol || '';
            const script = document.createElement("script");
            script.type = "text/javascript";
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
            script.async = true;

            // 配置Symbol Overview组件
            script.innerHTML = JSON.stringify({
                "symbol": symbol,
                "chartOnly": false,
                "dateRange": props.dateRange,
                "noTimeScale": true,
                "colorTheme": props.colorTheme,
                "isTransparent": props.isTransparent,
                "locale": props.locale,
                "width": props.width,
                "autosize": true,
                "height": props.height
            });

            if (container) {
                container.innerHTML = "";
                container.appendChild(script);
            }

            chartsCreated.value.add(index);
            console.log(`Chart created for ${symbol} at index ${index}`);
        }, 100);
    } catch (error) {
        console.error(`Failed to create chart for index ${index}:`, error);
    }
};

// 创建所有图表
const createAllCharts = async () => {
    if (!props.stockList.length) return;

    try {
        await loadTradingViewScript();

        // 等待脚本完全加载
        await new Promise(resolve => setTimeout(resolve, 200));

        // 批量创建图表，添加小延迟避免同时创建太多
        for (let i = 0; i < props.stockList.length; i++) {
            await createChart(props.stockList[i], i);
            // 添加小延迟避免浏览器阻塞
            if (i < props.stockList.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
    } catch (error) {
        console.error('Failed to create charts:', error);
    }
};

// 清理图表
const cleanupChart = (index: number) => {
    const widgetId = `tradingview-widget-${index}`;
    const container = document.getElementById(widgetId);
    if (container) {
        container.innerHTML = '';
    }
    chartsCreated.value.delete(index);
};

// 清理所有图表
const cleanupAllCharts = () => {
    chartsCreated.value.forEach(index => {
        cleanupChart(index);
    });
    chartsCreated.value.clear();
};

// 处理项目点击
const handleItemClick = (item: StockItem, index: number) => {
    emit('itemClick', item, index);
};

// 检查两个项目是否相同
const isItemEqual = (item1: StockItem, item2: StockItem): boolean => {
    if (!item1 || !item2) return false;
    return item1.symbol === item2.symbol &&
        item1.tradingview_name === item2.tradingview_name;
};

// 监听 stockList 变化 - 实现增量更新
watch(
    () => props.stockList,
    async (newList, oldList) => {
        if (newList !== oldList) {
            const oldLength = oldList?.length || 0;
            const newLength = newList?.length || 0;

            if (newLength > oldLength) {
                // 数组长度增加，只创建新增的图表
                console.log(`Adding ${newLength - oldLength} new charts`);
                await nextTick();

                // 只创建新增的图表
                for (let i = oldLength; i < newLength; i++) {
                    if (newList[i]) {
                        await createChart(newList[i], i);
                        // 添加小延迟避免浏览器阻塞
                        if (i < newLength - 1) {
                            await new Promise(resolve => setTimeout(resolve, 50));
                        }
                    }
                }
            } else if (newLength < oldLength) {
                // 数组长度减少，清理多余的图表
                console.log(`Removing ${oldLength - newLength} charts`);
                for (let i = newLength; i < oldLength; i++) {
                    cleanupChart(i);
                }
            } else if (newLength === oldLength) {
                // 数组长度相同，检查内容是否有变化
                let hasChanges = false;
                for (let i = 0; i < newLength; i++) {
                    if (!isItemEqual(newList[i], oldList[i])) {
                        hasChanges = true;
                        break;
                    }
                }

                if (hasChanges) {
                    // 内容有变化，重新创建所有图表
                    console.log('Recreating all charts due to content change');
                    cleanupAllCharts();
                    await nextTick();
                    await createAllCharts();
                }
            }
        }
    },
    { deep: true }
);

// 监听其他配置变化
watch(
    () => [props.colorTheme, props.locale, props.dateRange, props.showChart],
    async () => {
        if (props.stockList.length > 0) {
            cleanupAllCharts();
            await nextTick();
            await createAllCharts();
        }
    }
);

onMounted(async () => {
    if (props.stockList.length > 0) {
        await createAllCharts();
    }
});

onUnmounted(() => {
    cleanupAllCharts();
});

// 暴露方法给父组件
defineExpose({
    createAllCharts,
    cleanupAllCharts,
    refreshChart: (index: number) => {
        if (props.stockList[index]) {
            cleanupChart(index);
            createChart(props.stockList[index], index);
        }
    },
    // 添加新图表（用于分页加载）
    addCharts: async (startIndex: number, endIndex: number) => {
        for (let i = startIndex; i < endIndex && i < props.stockList.length; i++) {
            if (props.stockList[i]) {
                await createChart(props.stockList[i], i);
                if (i < endIndex - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
        }
    },
    // 获取当前图表数量
    getChartCount: () => chartsCreated.value.size
});
</script>

<style lang="less" scoped>
.mini-chart-list {
    width: 100%;
}

.chart-item {
    width: 100%;
    position: relative;
    cursor: pointer;

    .tradingview-widget-container {
        width: 100%;
        height: 100%;
        min-height: 200px;

        &__widget {
            width: 100%;
            height: 100%;
        }
    }
}

// 响应式设计
@media (max-width: 768px) {
    .chart-item .tradingview-widget-container {
        min-height: 150px;
    }
}

@media (max-width: 480px) {
    .chart-item .tradingview-widget-container {
        min-height: 120px;
    }
}
</style>