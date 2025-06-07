<template>
  <div ref="tradingviewWidget" class="tradingview-widget-container" v-if="chartsDesc.length">
    <div :id="widgetId" class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const props = defineProps({
  chartsDesc: {
    default: [],
  },
  category_id: {
    default: 0,
  },
});
const widgetKey = ref(0);

const tradingviewWidget = ref<HTMLElement | null>(null);
const widgetId = computed(
  () =>
    `tradingview_market_stock_widget_${widgetKey.value}_${props.category_id}`
);
const { t, locale } = useI18n();

const route = useRouter();

// 创建TradingView图表
const createWidget = async () => {
  console.log("createWidget", props.category_id);
  widgetKey.value++;

  await nextTick();

  // 延迟一点确保DOM完全更新
  setTimeout(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      tabs: [
        {
          title: "Indices",
          symbols: props.chartsDesc.map((item) => {
            return {
              s: item.proName,
              d: item.description || "",
            };
          }),
        },
      ],
      colorTheme: "dark",
      dateRange: "1D",
      showChart: true,
      locale: locale.value,
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      width: "100%",
      height: "350",
      plotLineColorGrowing: "rgba(41, 98, 255, 1)",
      plotLineColorFalling: "rgba(41, 98, 255, 1)",
      gridLineColor: "rgba(42, 46, 57, 0)",
      scaleFontColor: "rgba(219, 219, 219, 1)",
      belowLineFillColorGrowing: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorFalling: "rgba(41, 98, 255, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(41, 98, 255, 0)",
      belowLineFillColorFallingBottom: "rgba(41, 98, 255, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
    });
    const container = document.getElementById(widgetId.value);
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, 100);
};

watch(
  () => props.chartsDesc.length,
  () => {
    console.log(props.chartsDesc.length, "props.chartsDesc.length");
    // if (props.chartsDesc.length) {
    createWidget();
    // }
  }
);
onMounted(() => {
  // if (!tradingviewWidget.value) return

  createWidget();
});
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
