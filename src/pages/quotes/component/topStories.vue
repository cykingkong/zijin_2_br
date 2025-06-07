<template>
  <div ref="tradingviewWidget" class="tradingview-widget-container">
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
  () => `tradingview_widget_${widgetKey.value}_${props.category_id}`
);
const { t } = useI18n();

const route = useRouter();

// 创建TradingView图表
const createWidget = async () => {
  console.log("createWidget");
  widgetKey.value++;

  await nextTick();

  // 延迟一点确保DOM完全更新
  setTimeout(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: props.chartsDesc.map((item) => {
        return {
          proName: item.proName,
          title: item.description,
        };
      }),
      showSymbolLogo: false,
      isTransparent: false,
      largeChartUrl: "http://localhost:3200/ipo",
      displayMode: "compact",
      colorTheme: "dark",
      locale: "en",
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
