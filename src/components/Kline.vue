<template>
	<div :id="nameId" :style="{ width: width, height: height }"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
	props: {
		width: {
			type: String,
			default: '300px'
		},
		height: {
			type: String,
			default: '73px'
		},
		nameId: {
			type: String,
			default: 'myChart'
		},
		yAxisShow: {
			type: Boolean,
			default: false
		},
		xAxisShow: {
			type: Boolean,
			default: false
		},
		data: {
			type: Array,
			default: () => []
		},
		increase: {
			type: Number,
			default: 0
		},
		areaStyle: {
			type: Boolean,
			default: false
		},
		time: {
			type: Array,
			default: () => []
		},
		fontsize: {
			type: String,
			default: '0'
		}
	},
	data() {
		return {
			shaw: true,
			myChart: null
		}
	},
	mounted() {
		this.drawLine()
	},
	computed: {},
	watch: {
		data(value) {
			this.myChart.setOption({
				series: [{
					data: value,
					markLine: {
						data: [{
							yAxis: value.reduce((sum, val) => sum + val, 0) / value.length,
							name: 'Threshold'
						}]
					}
				}],
			});
		},
		increase(value) {
			this.myChart.setOption({
				series: [{
					lineStyle: {
						color: value >= 0 ?
							'rgba(18,208,83,1)' : 'rgba(255,72,52,1)'
					},
					// areaStyle: {
					// 	normal: {
					// 		color: new echarts.graphic.LinearGradient(
					// 			0,
					// 			0,
					// 			0,
					// 			1,
					// 			[{
					// 				offset: 0,
					// 				color: value >= 0 ? 'rgba(18,208,83,0.8)' :
					// 					'rgba(255,72,52,.8)'
					// 			},
					// 			{
					// 				offset: 1,
					// 				color: value >= 0 ? 'rgba(20,79,48,0.1)' :
					// 					'rgba(108,20,29,0.1)'
					// 			}
					// 			]
					// 		)
					// 	}
					// },
					markLine: {
						data: [{
							yAxis: this.data.reduce((sum, val) => sum + val, 0) / this.data.length,
							name: 'Threshold',
						}],
						lineStyle: {
							// color: value < 0 ? 'rgba(255,72,52,1)' : 'rgba(18,208,83,1)', // 设置线条颜色
							color: '#E2E8F0', // 设置线条颜色
							type: 'dashed', // 设置线条样式
							width: 1 // 设置线条宽度
						}
					}
				}],
			});
		}
	},
	methods: {
		drawLine() {
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(document.getElementById(this.nameId))
			// 绘制图表
			let option = {
				animation: true,
				tooltip: {
					trigger: 'axis',
					formatter: function (params) {
						var seriesName = params[0].seriesName // 系列名称
						var value = params[0].value // 数据值
						return '$' + value // 返回自定义的 tooltip 文本
					}
				},
				grid: {
					left: 1,
					right: 0,
					top: 5,
					bottom: 5,
					containLabel: true
				},
				xAxis: {
					type: 'category',
					data: this.time,
					show: this.xAxisShow,
					boundaryGap: false,
					axisTick: {
						show: false // 这里设置x轴刻度线不显示
					},
					axisLine: {
						show: false // 隐藏x轴线
					}
				},
				yAxis: {
					type: 'value',
					show: this.yAxisShow,
					position: 'right',
					boundaryGap: false,
					splitLine: {
						show: false // 隐藏Y轴背景线
					},
					axisLabel: {
						fontSize: this.fontsize // 设置标签字体大小
					},
					min: function (value) {
						return value.min
					},
					// max: function(value){
					//   console.log('max',value)
					//   if(value.max < 100){
					//     return 100
					//   }else{
					//     return value;
					//   }
					// },
					axisLine: {
						show: false // 隐藏Y轴线
					},
					axisTick: {
						show: false // 隐藏Y轴刻度
					}
				},
				series: [{
					data: this.data,
					type: 'line',
					showSymbol: false,
					smooth: false,
					lineStyle: {
						color: this.increase >= 0 ?
							'rgba(18,208,83,1)' : 'rgba(255,72,52,1)'
					},
					// areaStyle: {
					// 	normal: {
					// 		color: new echarts.graphic.LinearGradient(
					// 			0,
					// 			0,
					// 			0,
					// 			1,
					// 			[{
					// 				offset: 0,
					// 				color: this.increase >= 0 ? 'rgba(18,208,83,0.8)' :
					// 					'rgba(255,72,52,.8)'
					// 			},
					// 			{
					// 				offset: 1,
					// 				color: this.increase >= 0 ? 'rgba(20,79,48,0.1)' :
					// 					'rgba(108,20,29,0.1)'
					// 			}
					// 			]
					// 		)
					// 	}
					// },
					markLine: {
						symbol: 'none',
						data: [{
							yAxis: this.data.reduce((sum, val) => sum + val, 0) / this.data.length,
							name: 'Threshold'
						} // 水平参考线
						],
						lineStyle: {
							// color: this.increase < 0 ? 'rgba(255,72,52,1)' : 'rgba(18,208,83,1)', // 设置线条颜色
							color: '#E2E8F0', // 设置线条颜色

							type: 'dashed', // 设置线条样式
							width: 1 // 设置线条宽度
						},
						label: {
							formatter: '' // 显示参考线名称
						}
					}
				}]
			}
			this.myChart.setOption(option)
		}
	}
}
</script>
<style scoped>
#myChart {
	width: 426px;
	height: 100px;
	/* background: #121212; */
	/* z-index: 30; */
}
</style>