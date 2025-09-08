<template>
    <div class="timer-fetcher-example p-4">
        <h2 class="text-xl font-bold mb-4">定时数据获取器示例</h2>

        <!-- 控制面板 -->
        <div class="control-panel bg-gray-100 p-4 rounded-lg mb-4">
            <div class="flex items-center gap-4 mb-4">
                <label class="flex items-center gap-2">
                    <span>股票代码:</span>
                    <input v-model="symbol" class="border px-2 py-1 rounded" placeholder="例如: FLY" />
                </label>
                <label class="flex items-center gap-2">
                    <span>时间间隔:</span>
                    <select v-model="selectedInterval" class="border px-2 py-1 rounded">
                        <option value="1m">1分钟</option>
                        <option value="5m">5分钟</option>
                        <option value="15m">15分钟</option>
                        <option value="1h">1小时</option>
                        <option value="1d">1天</option>
                    </select>
                </label>
                <label class="flex items-center gap-2">
                    <span>获取间隔(秒):</span>
                    <input v-model.number="fetchInterval" type="number" min="10" max="3600"
                        class="border px-2 py-1 rounded w-20" />
                </label>
            </div>

            <div class="flex gap-2">
                <button @click="startFetcher" :disabled="isActive()"
                    class="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    开始获取
                </button>
                <button @click="stopFetcher" :disabled="!isActive()"
                    class="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50">
                    停止获取
                </button>
                <button @click="fetchNow" class="bg-blue-500 text-white px-4 py-2 rounded">
                    立即获取
                </button>
                <button @click="resetStats" class="bg-gray-500 text-white px-4 py-2 rounded">
                    重置统计
                </button>
            </div>
        </div>

        <!-- 状态信息 -->
        <div class="status-panel bg-blue-50 p-4 rounded-lg mb-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="text-center">
                    <div class="text-sm text-gray-600">状态</div>
                    <div class="font-bold" :class="isActive() ? 'text-green-600' : 'text-red-600'">
                        {{ isActive() ? '运行中' : '已停止' }}
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-600">加载状态</div>
                    <div class="font-bold" :class="isLoading ? 'text-yellow-600' : 'text-green-600'">
                        {{ isLoading ? '加载中...' : '就绪' }}
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-600">最后更新</div>
                    <div class="font-bold text-sm">
                        {{ lastUpdateTime }}
                    </div>
                </div>
                <div class="text-center">
                    <div class="text-sm text-gray-600">平均响应时间</div>
                    <div class="font-bold">
                        {{ stats.averageResponseTime.toFixed(0) }}ms
                    </div>
                </div>
            </div>
        </div>

        <!-- 统计信息 -->
        <div class="stats-panel bg-green-50 p-4 rounded-lg mb-4">
            <h3 class="font-bold mb-2">统计信息</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="text-gray-600">总请求数:</span>
                    <span class="font-bold ml-2">{{ stats.totalRequests }}</span>
                </div>
                <div>
                    <span class="text-gray-600">成功请求:</span>
                    <span class="font-bold ml-2 text-green-600">{{ stats.successfulRequests }}</span>
                </div>
                <div>
                    <span class="text-gray-600">失败请求:</span>
                    <span class="font-bold ml-2 text-red-600">{{ stats.failedRequests }}</span>
                </div>
                <div>
                    <span class="text-gray-600">成功率:</span>
                    <span class="font-bold ml-2">
                        {{ stats.totalRequests > 0 ? ((stats.successfulRequests / stats.totalRequests) * 100).toFixed(1)
                        : 0 }}%
                    </span>
                </div>
            </div>
        </div>

        <!-- 错误信息 -->
        <div v-if="error" class="error-panel bg-red-50 p-4 rounded-lg mb-4">
            <h3 class="font-bold text-red-700 mb-2">错误信息</h3>
            <div class="text-red-600">{{ error.message }}</div>
        </div>

        <!-- 数据显示 -->
        <div class="data-panel bg-white border p-4 rounded-lg">
            <h3 class="font-bold mb-2">获取的数据</h3>
            <div v-if="!data" class="text-gray-500 text-center py-8">
                暂无数据，请开始获取
            </div>
            <div v-else class="space-y-2">
                <div class="text-sm">
                    <strong>股票代码:</strong> {{ data?.chart?.result?.[0]?.meta?.symbol || 'N/A' }}
                </div>
                <div class="text-sm">
                    <strong>当前价格:</strong> ${{ data?.chart?.result?.[0]?.meta?.regularMarketPrice || 'N/A' }}
                </div>
                <div class="text-sm">
                    <strong>52周最高:</strong> ${{ data?.chart?.result?.[0]?.meta?.fiftyTwoWeekHigh || 'N/A' }}
                </div>
                <div class="text-sm">
                    <strong>52周最低:</strong> ${{ data?.chart?.result?.[0]?.meta?.fiftyTwoWeekLow || 'N/A' }}
                </div>
                <div class="text-sm">
                    <strong>成交量:</strong> {{ data?.chart?.result?.[0]?.meta?.regularMarketVolume?.toLocaleString() ||
                    'N/A' }}
                </div>
                <div class="text-sm">
                    <strong>数据点数量:</strong> {{ data?.chart?.result?.[0]?.timestamp?.length || 0 }}
                </div>
            </div>

            <!-- 原始JSON数据（可折叠） -->
            <details class="mt-4">
                <summary class="cursor-pointer text-blue-600 hover:text-blue-800">
                    查看原始JSON数据
                </summary>
                <pre
                    class="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-96">{{ JSON.stringify(data, null, 2) }}</pre>
            </details>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useYahooFinanceFetcher } from '@/composables/useTimerFetcher'

// 响应式数据
const symbol = ref('FLY')
const selectedInterval = ref('1m')
const fetchInterval = ref(60) // 60秒

// 使用定时获取器
const {
    data,
    error,
    isLoading,
    stats,
    start: startFetcher,
    stop: stopFetcher,
    fetchNow,
    isActive,
    resetStats
} = useYahooFinanceFetcher(symbol.value, selectedInterval.value, {
    interval: fetchInterval.value * 1000,
    autoStart: false,
    maxRetries: 3,
    retryDelay: 2000,
    timeout: 15000
})

// 计算最后更新时间
const lastUpdateTime = computed(() => {
    if (!stats.value.lastSuccessTime) return '从未'
    return new Date(stats.value.lastSuccessTime).toLocaleTimeString()
})

// 监听配置变化，重新创建获取器
watch([symbol, selectedInterval, fetchInterval], () => {
    if (isActive()) {
        stopFetcher()
        // 重新创建获取器
        startFetcher()
    }
})

// 开始获取数据
const start = () => {
    startFetcher()
}

// 停止获取数据
const stop = () => {
    stopFetcher()
}
</script>

<style scoped>
.timer-fetcher-example {
    max-width: 1200px;
    margin: 0 auto;
}

.control-panel,
.status-panel,
.stats-panel,
.error-panel,
.data-panel {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

button:disabled {
    cursor: not-allowed;
}

pre {
    white-space: pre-wrap;
    word-wrap: break-word;
}
</style>
