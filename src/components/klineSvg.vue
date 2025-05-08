<template>
    <div>
        <!-- 面积图容器 -->
        <svg ref="areaChart" width="100" height="30"></svg>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
const areaChart = ref(null); // 引用 SVG 元素
const selectedColor = ref('#ff0000'); // 默认颜色
const green = ref('#12D053')
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    increase: {
        type: Number,
        default: 0
    }
})
watch(() => props.data, () => {
    drawAreaChart()
})
watch(() => props.increase, () => {
    drawAreaChart()
})
// 绘制面积图
const drawAreaChart = () => {
    const svg = areaChart.value;
    const width = 100;
    const height = 30;
    const padding = 5;

    // 计算数据范围
    const maxValue = Math.max(...props.data);
    const minValue = Math.min(...props.data);

    // 如果最大值和最小值相同，手动调整范围
    const range = maxValue - minValue;
    const adjustedRange = range === 0 ? 1 : range; // 避免除以零

    // 数据转换为坐标
    const xScale = (index) => {
        return padding + (index * (width - 2 * padding)) / (props.data.length - 1);
    };
    const yScale = (value) => {
        return height - padding - ((value - minValue) / adjustedRange) * (height - 2 * padding);
    };

    // 生成折线图的点
    const points = props.data
    .map((value, index) => ({
        x: xScale(index),
        y: yScale(value),
      }));

    // 生成平滑路径的 `d` 属性（用于线条）
    const smoothPathD = generateSmoothPath(points);

    // 生成直线路径的 `d` 属性（用于面积图）
    const areaPathD = generateStraightPath(points, width, height, padding);

    // 清空SVG内容
    svg.innerHTML = '';

    // 绘制填充区域
    const areaPolygon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPolygon.setAttribute('d', areaPathD);
    areaPolygon.setAttribute('class', 'area');
    areaPolygon.style.fill = `rgba(${hexToRgb(props.increase >= 0 ? green.value : selectedColor.value)}, 0.2)`; // 动态设置填充颜色
    svg.appendChild(areaPolygon);

    // 绘制折线
    const linePolyline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linePolyline.setAttribute('d', smoothPathD);
    linePolyline.setAttribute('class', 'line');
    linePolyline.style.stroke = props.increase >= 0 ? green.value : selectedColor.value; // 动态设置折线颜色
    svg.appendChild(linePolyline);
};
// 生成平滑路径（贝塞尔曲线）
const generateSmoothPath = (points) => {
    if (points.length === 0) return '';

    let path = `M${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const controlPoint1 = {
            x: (prev.x + curr.x) / 2,
            y: prev.y,
        };
        const controlPoint2 = {
            x: (prev.x + curr.x) / 2,
            y: curr.y,
        };
        path += ` C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${curr.x},${curr.y}`;
    }
    return path;
};

// 生成直线路径（用于面积图）
const generateStraightPath = (points, width, height, padding) => {
    if (points.length === 0) return '';

    let path = `M${padding},${height - padding} L${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L${points[i].x},${points[i].y}`;
    }
    path += ` L${width - padding},${height - padding} Z`;
    return path;
};

// 更新数据（示例）
const updateData = () => {
    props.data = props.data.map((value) => value + (Math.random() - 0.5) * 10); // 随机更新数据
    drawAreaChart(); // 重新绘制
};

// 更新图表（颜色或数据变化时调用）
const updateChart = () => {
    drawAreaChart(); // 重新绘制图表
};

// 将十六进制颜色转换为RGB格式
const hexToRgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
};

// 组件挂载后绘制面积图
onMounted(() => {
    drawAreaChart();
});
</script>

<style>
.area {
    stroke: none;
    /* 无边框 */
}

.line {
    fill: none;
    /* 无填充 */
    stroke-width: 2;
    /* 折线宽度 */
}
</style>