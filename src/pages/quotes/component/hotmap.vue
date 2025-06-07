<template>
  <div ref="tradingviewWidget" class="tradingview-widget-container">
    <div :id="widgetId" class="tradingview-widget-container__widget"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
const props = defineProps({
  category_id: {
    default: 0,
  },
});
const widgetKey = ref(0);

const tradingviewWidget = ref<HTMLElement | null>(null);
const widgetId = computed(
  () => `tradingview_hotmap_widget_${widgetKey.value}_${props.category_id}`
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
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.async = true;
    let json = {};
    if (props.category_id == 200) {
      json = {
        "exchanges": [
          "NASDAQ"
        ],
        "dataSource": "NASDAQ100",
        "grouping": "no_group",
        "blockSize": "Value.Traded",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": false,
        "hasSymbolTooltip": false,
        "isMonoSize": false,
        "width": "100%",
        "height": 500
      };
    } else {
      json = {
        "exchanges": [
          "BMFBOVESPA"
        ],
        "dataSource": "IBXL",
        "grouping": "no_group",
        "blockSize": "Value.Traded",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": false,
        "hasSymbolTooltip": false,
        "isMonoSize": false,
        "width": '100%',
        "height": 500
      }
    }
    script.innerHTML = JSON.stringify(json);
    const container = document.getElementById(widgetId.value);
    if (container) {
      container.innerHTML = "";
      container.appendChild(script);
    }
  }, 100);
};

watch(
  () => props.category_id,
  () => {
    if (props.category_id) {
      createWidget();
    }
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
