<script>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { createChart } from 'lightweight-charts'
import wwtab from './ww-tab.vue'

export default {
  name: 'KLineChart',
  components: {
    Wwtab: wwtab,
  },
  props: {
    data: {
      type: Array,
      required: true, // 包含蜡烛图、交易量和价格数据
    },
  },
  setup(props) {
    const chartContainer = ref(null)
    let chart
    const time = ref([
      '1m',
      '5m',
      '15m',
      '30m',
      '60m',
      '4h',
      '1d',
      '1w',
      '1m',
      '1y',
    ])

    const calculateMA = (data, period) => {
      const ma = []
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
          // 跳过不足周期的数据
          continue
        }
        const sum = data
          .slice(i - period + 1, i + 1)
          .reduce((acc, cur) => acc + cur.close, 0)
        const value = sum / period
        ma.push({ time: data[i].time, value })
      }
      return ma
    }

    const resizeChart = () => {
      if (chart && chartContainer.value) {
        chart.applyOptions({ width: chartContainer.value.offsetWidth })
      }
    }

    onMounted(() => {
      const width = chartContainer.value.offsetWidth

      // 创建图表
      chart = createChart(chartContainer.value, {
        width,
        height: 500,
        priceLineVisible: false, // 隐藏价格线
        layout: {
          textColor: '#666',
          background: { type: 'solid', color: 'black' },
        },
        grid: {
          vertLines: { color: '#333333', style: 1 },
          horzLines: { color: '#333333', style: 1 },
        },
        timeScale: {
          // borderColor: '#F5F5F5',
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.2,
            bottom: 0,
          },
          // borderColor: '#F5F5F5',
        },
      })
      const areaSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceLineVisible: false,
        lastValueVisible: false,
        scaleMargins: {
          top: 0.8, // 蜡烛图占顶部 80%
          bottom: 0, // 柱状图紧贴底部
        },
      })
      areaSeries.setData([
        { time: '2018-12-22', value: 32.51 },
        { time: '2018-12-23', value: 31.11 },
        { time: '2018-12-24', value: 27.02 },
        { time: '2018-12-25', value: 27.32 },
        { time: '2018-12-26', value: 25.17 },
        { time: '2018-12-27', value: 28.89 },
        { time: '2018-12-28', value: 25.46 },
        { time: '2018-12-29', value: 23.92 },
        { time: '2018-12-30', value: 22.68 },
        { time: '2018-12-31', value: 22.67 },
      ])
      // 添加蜡烛图
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      })
      candlestickSeries.setData(props.data)

      // // 添加交易量柱状图
      // const volumeSeries = chart.addHistogramSeries({
      //     color: '#26a69a',
      //     priceFormat: { type: 'volume' },
      //     scaleMargins: {
      //         top: 0.8, // 蜡烛图占顶部 80%
      //         bottom: 0 // 柱状图占底部
      //     }
      // })

      // 添加 MA5、MA10、MA20、MA30、MA60
      const ma5Series = chart.addLineSeries({
        color: '#FF5733',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      const ma10Series = chart.addLineSeries({
        color: '#33FF57',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      const ma20Series = chart.addLineSeries({
        color: '#3357FF',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      const ma30Series = chart.addLineSeries({
        color: '#FFC300',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      const ma60Series = chart.addLineSeries({
        color: '#900C3F',
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: false,
      })
      ma5Series.setData(calculateMA(props.data, 5))
      ma10Series.setData(calculateMA(props.data, 10))
      ma20Series.setData(calculateMA(props.data, 20))
      ma30Series.setData(calculateMA(props.data, 30))
      ma60Series.setData(calculateMA(props.data, 60))
      chart.timeScale().fitContent()
      window.addEventListener('resize', resizeChart)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart)
      if (chart)
        chart.remove()
    })

    return { chartContainer, time }
  },
}
</script>

<template>
  <Wwtab :time="time" />
  <div ref="chartContainer" class="chart-container" />
</template>

  <style>
.chart-container {
  width: 100%;
  height: 100%;
  background: transparent;
}
</style>
