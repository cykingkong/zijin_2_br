import { ref, onMounted, onUnmounted, watch } from 'vue'
import { TimerFetcher, type FetcherOptions, type FetcherStats } from '@/utils/timer-fetcher'

export interface UseTimerFetcherOptions extends FetcherOptions {
    autoStart?: boolean
    autoStopOnUnmount?: boolean
}

export interface UseTimerFetcherReturn {
    data: any
    error: Error | null
    isLoading: boolean
    stats: FetcherStats
    start: () => void
    stop: () => void
    fetchNow: () => Promise<any>
    isActive: () => boolean
    resetStats: () => void
}

/**
 * Vue组合式函数：定时获取JSON数据
 * @param options 配置选项
 * @returns 返回数据、状态和控制方法
 */
export function useTimerFetcher(options: UseTimerFetcherOptions): UseTimerFetcherReturn {
    const data = ref<any>(null)
    const error = ref<Error | null>(null)
    const isLoading = ref(false)
    const stats = ref<FetcherStats>({
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        lastFetchTime: null,
        lastSuccessTime: null,
        lastErrorTime: null,
        averageResponseTime: 0
    })

    let fetcher: TimerFetcher | null = null

    // 创建获取器实例
    const createFetcher = () => {
        fetcher = new TimerFetcher({
            ...options,
            onData: (newData) => {
                data.value = newData
                error.value = null
                isLoading.value = false
                stats.value = fetcher?.getStats() || stats.value
            },
            onError: (err) => {
                error.value = err
                isLoading.value = false
                stats.value = fetcher?.getStats() || stats.value
            },
            onStart: () => {
                isLoading.value = true
                error.value = null
            },
            onStop: () => {
                isLoading.value = false
            }
        })
    }

    // 开始获取数据
    const start = () => {
        if (!fetcher) {
            createFetcher()
        }
        fetcher?.start()
    }

    // 停止获取数据
    const stop = () => {
        fetcher?.stop()
    }

    // 立即获取一次数据
    const fetchNow = async (): Promise<any> => {
        if (!fetcher) {
            createFetcher()
        }
        return await fetcher?.fetchNow()
    }

    // 检查是否正在运行
    const isActive = (): boolean => {
        return fetcher?.isActive() || false
    }

    // 重置统计信息
    const resetStats = () => {
        fetcher?.resetStats()
        stats.value = fetcher?.getStats() || stats.value
    }

    // 监听配置变化
    watch(() => options, (newOptions) => {
        if (fetcher) {
            fetcher.updateOptions(newOptions)
        }
    }, { deep: true })

    // 组件挂载时自动开始（如果配置了）
    onMounted(() => {
        if (options.autoStart !== false) {
            start()
        }
    })

    // 组件卸载时自动停止
    onUnmounted(() => {
        if (options.autoStopOnUnmount !== false) {
            stop()
        }
    })

    return {
        data,
        error,
        isLoading,
        stats,
        start,
        stop,
        fetchNow,
        isActive,
        resetStats
    }
}

/**
 * 专门用于Yahoo Finance的组合式函数
 * @param symbol 股票代码
 * @param interval 时间间隔
 * @param options 其他配置选项
 */
export function useYahooFinanceFetcher(
    symbol: string,
    interval: string = '1m',
    options: Partial<UseTimerFetcherOptions> = {}
): UseTimerFetcherReturn {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}`

    return useTimerFetcher({
        url,
        interval: 60000, // 默认1分钟
        ...options
    })
}
