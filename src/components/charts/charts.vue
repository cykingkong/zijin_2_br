<template>
  <div class="chart-container">
    <div class="time-select">
      <div class="time-buttons">
        <div v-for="(item, index) in times" :key="index" class="time-btn" @click="setKline(item, index)"
          :class="{ active: timesIndex === index }">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div id="k-line-chart" class="content"></div>
    <div class="k-line-btn" v-if="false">
      <div class="K_btn" v-for="(item, index) in mainIndicators" :key="index" @click="setMainIndicator(item)">
        {{ item.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { init } from "klinecharts";
import theme from "./theme.js";
import Socket from "../../utils/Socket.js";
import { kline as marketklineDetail } from "@/api/market";
import { useStore } from "@/stores/modules/index";
import { showLoadingToast } from "vant";
const store = useStore();
const chart = ref(null);
const props = defineProps({
  trading_pair_id: {
    type: Number,
    default: 1,
  },
  // itemsKey: {
  //   type: Number,
  //   default: 0,
  // },
});
const times = ref([
  { text: "24H", id: 0, key: "area" },
  { text: "1W", id: 1, key: "candle_solid" },
  { text: "1M", id: 2, key: "candle_solid" },
  { text: "1Y", id: 3, key: "candle_solid" },
  { text: "ALL", id: 4, key: "candle_solid" },
]);
const mainIndicators = ref([
  { text: "MA", id: "candle_pane", type: "ma" },
  { text: "EMA", id: "candle_pane", type: "ema" },
  { text: "BOLL", id: "candle_pane", type: "boll" },
  { text: "VOL", id: "vol", type: "vol" },
  { text: "MACD", id: "macd", type: "macd" },
  { text: "RSI", id: "rsi", type: "rsi" },
  { text: "KDJ", id: "kdj", type: "kdj" },
]);
const time = ref([
  "1min",
  "1week",
  "1mon",
  "1year",
  "all",
]);
const timesIndex = ref(0);
const klineType = ref([]);
let ws = null;
let period = "1min";
let tradingPairsId = ref("");
let valPeriod = "1min";
let listData = {};

const initChart = () => {
  // timesIndex.value = props.itemsKey;
  // period = time.value[props.itemsKey];

  chart.value = init("k-line-chart");
  chart.value.setPriceVolumePrecision(4);
  marketkline();
  chart.value.setStyles(theme("light"));
  chart.value.setStyles({
    candle: {
      type: times.value[timesIndex.value].key,
    },
  });
  chart.value.createIndicator("MA", true, { id: "candle_pane" });
  chart.value.createIndicator("VOL", true, { id: "vol" });
  SocketWs();
};

watch(
  () => props.trading_pair_id,
  (newId) => {
    console.log("trading pair id:", newId,);
    // period = time.value[newKey];
    marketkline();
    childInte();
  }
);
const SocketWs = () => {
  ws = new Socket("/wss");
  ws.on("open", () => {
    ws.send({
      action: "Subscribe",
      params: {
        tradingPairsId: props.trading_pair_id,
        period: period,
      },
    });
  });
  ws.on("message", (res) => {
    if (res.code == 200) {
      if (res.data && res.msgType) {
        listData = res.data;
        try {
          let data = {
            timestamp: res.data.tick.id * 1000, // 时间戳不变
            open: res.data.tick.open,
            high: res.data.tick.high, // 更新最高价
            low: res.data.tick.low,
            close: res.data.tick.close, // 更新收盘价
            volume: res.data.tick.vol, // 更新成交量
          };
          store.setlistData(res.data.tick);
          chart.value.updateData(data);
        } catch (e) {
          console.log(e);
        }
      }
    }
  });
  tradingPairsId.value = props.trading_pair_id;
};
const marketkline = () => {
  marketklineDetail({
    tradingPairsId: props.trading_pair_id,
    period: period,
  }).then((res) => {
    if (res.data) {
      res.data.forEach((e) => {
        e.volume = e.vol;
      });
      store.setlistData(res.data[res.data.length - 1]);
      chart.value.applyNewData(res.data);
      klineType.value.push(res.data[res.data.length - 1]);
    }
  });
};

const setMainIndicator = (item) => {
  chart.value.setZoomEnabled(true);
  const index = klineType.value.indexOf(item.text);
  if (index >= 0) {
    chart.value.removeIndicator(item.id, item.text);
    klineType.value.splice(index, 1);
    return;
  }
  chart.value.createIndicator(item.text, true, { id: item.id });
  klineType.value.push(item.text);
};

const setKline = (item, index) => {
  chart.value.setStyles({
    candle: {
      type: item.key,
    },
  });
  valPeriod = period;
  period = time.value[index];
  timesIndex.value = index;
  marketkline();
  childInte();
};
const close = () => {
  console.log(ws, ws && JSON.stringify(listData), 'chasclose()')
  if (ws) {
    ws.send({
      action: "UnSubscribe",
      params: {
        tradingPairsId: tradingPairsId.value,
        period: valPeriod,
      },
    });
  }
};
const childInte = async () => {
  await close();
  await SocketWs();
};
defineExpose({
  childInte,
  close,
});
onMounted(() => {
  initChart();
});
</script>

<style lang="less" scoped>
.chart-container {
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.time-select {
  width: 100%;
  margin-bottom: 16px;

  .time-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;

    .time-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      color: #666;
      background: transparent;
      border: 1px solid #ddd;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(107, 57, 244, 0.1);
        border-color: #6B39F4;
      }

      &.active {
        background: #6B39F4;
        border-color: #6B39F4;
        color: white;
      }
    }
  }
}

.content {
  width: 100%;
  height: 400px;
  border-radius: 4px;
}

.k-line-btn {
  width: 95%;
  margin: auto;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;

  .K_btn {
    font-size: 14px;
    padding: 5px;
    border-radius: 10rpx;
    color: white;
    margin-top: 20px;
  }
}
</style>
