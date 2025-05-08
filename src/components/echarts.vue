<script setup>
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'line',
  },
})
const chart = ref(null)
const chartInstance = ref(null)
function initChart() {
  const options = {
    // backgroundColor: '#1a1a1a', // 背景颜色
    // title: {
    //     text: '累计收益率: 0.00%',
    //     left: 'center',
    //     top: '5%',
    //     textStyle: {
    //         color: '#ffd700', // 黄色文字
    //         fontSize: 14,
    //         fontWeight: 'bold'
    //     }
    // },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: ['23/12/2024', '25/12/2024', '27/12/2024'],
      axisLine: {
        lineStyle: { color: '#ddd' },
      },
      axisLabel: {
        color: '#ddd',
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1,
      splitLine: {
        lineStyle: {
          color: '#444', // 网格线颜色
        },
      },
      axisLine: {
        lineStyle: { color: '#ddd' },
      },
      axisLabel: {
        color: '#ddd',
      },
    },
    grid: {
      top: '25%',
      left: '10%',
      right: '10%',
      bottom: '15%',
      containLabel: true,
    },
    series: [
      {
        name: '累计涨跌比例',
        type: props.type,
        data: [0.1, 0.1, 0.1],
        smooth: true,
        showSymbol: true,
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: {
          color: '#4a8cf6', // 点的颜色
        },
        lineStyle: {
          color: '#4a8cf6', // 线条颜色
          width: 2,
        },
      },
    ],
    tooltip: {
      trigger: 'axis',
      formatter: '{b} <br />{a}: {c}',
      backgroundColor: '#333',
      borderColor: '#555',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
      },
    },
    legend: {
      data: ['累计涨跌比例'],
      bottom: '0',
      textStyle: {
        color: '#ddd',
      },
    },
  }

  chartInstance.value = echarts.init(chart.value)
  chartInstance.value.setOption(options)
}

onMounted(() => {
  initChart()
  window.addEventListener('resize', () => {
    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  })
})
</script>

<template>
  <div class="chart-container">
    <div ref="chart" class="chart" />
  </div>
</template>

  <style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 10px;
  background: #1a1a1a;
  box-shadow:
    0 10px 20px #0009,
    0 10px 30px #f4eaa50f inset;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
