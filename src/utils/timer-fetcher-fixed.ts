/**
 * 定时获取JSON数据的工具类 - 修复版
 * 支持自动重试、错误处理、数据缓存等功能
 * 修复了Yahoo Finance API的跨域问题
 */

// 定义并导出接口
export interface FetcherOptions {
    url: string
    interval: number // 间隔时间（毫秒）
    maxRetries?: number // 最大重试次数
    retryDelay?: number // 重试延迟（毫秒）
    timeout?: number // 请求超时时间（毫秒）
    onData?: (data: any) => void // 数据回调
    onError?: (error: Error) => void // 错误回调
    onStart?: () => void // 开始回调
    onStop?: () => void // 停止回调
    autoStart?: boolean // 是否自动开始
}

export interface FetcherStats {
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    lastFetchTime: number | null
    lastSuccessTime: number | null
    lastErrorTime: number | null
    averageResponseTime: number
}

export class TimerFetcher {
    private timerId: NodeJS.Timeout | null = null
    private isRunning: boolean = false
    private retryCount: number = 0
    private stats: FetcherStats
    private options: Required<FetcherOptions>

    constructor(options: FetcherOptions) {
        this.options = {
            maxRetries: 3,
            retryDelay: 1000,
            timeout: 10000,
            onData: () => { },
            onError: () => { },
            onStart: () => { },
            onStop: () => { },
            autoStart: false,
            ...options
        }

        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            lastFetchTime: null,
            lastSuccessTime: null,
            lastErrorTime: null,
            averageResponseTime: 0
        }

        if (this.options.autoStart) {
            this.start()
        }
    }

    /**
     * 开始定时获取数据
     */
    start(): void {
        if (this.isRunning) {
            console.warn('TimerFetcher is already running')
            return
        }

        this.isRunning = true
        this.options.onStart()
        this.fetchData()
        this.scheduleNextFetch()
    }

    /**
     * 停止定时获取数据
     */
    stop(): void {
        if (!this.isRunning) {
            return
        }

        this.isRunning = false
        if (this.timerId) {
            clearTimeout(this.timerId)
            this.timerId = null
        }
        this.options.onStop()
    }

    /**
     * 立即获取一次数据
     */
    async fetchNow(): Promise<any> {
        return await this.fetchData()
    }

    /**
     * 获取统计信息
     */
    getStats(): FetcherStats {
        return { ...this.stats }
    }

    /**
     * 重置统计信息
     */
    resetStats(): void {
        this.stats = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            lastFetchTime: null,
            lastSuccessTime: null,
            lastErrorTime: null,
            averageResponseTime: 0
        }
    }

    /**
     * 更新配置选项
     */
    updateOptions(newOptions: Partial<FetcherOptions>): void {
        this.options = { ...this.options, ...newOptions }
    }

    /**
     * 检查是否正在运行
     */
    isActive(): boolean {
        return this.isRunning
    }

    private async fetchData(): Promise<any> {
        if (!this.isRunning) {
            return null
        }

        const startTime = Date.now()
        this.stats.totalRequests++
        this.stats.lastFetchTime = startTime

        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), this.options.timeout)

            // 添加允许跨域的请求头
            const headers: Record<string, string> = {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
                'Access-Control-Allow-Credentials': 'true'
            }

            const response = await fetch(this.options.url, {
                method: 'GET',
                signal: controller.signal,
                headers
            })

            clearTimeout(timeoutId)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const responseTime = Date.now() - startTime

            // 检查Yahoo Finance API的错误响应
            if (data && data.chart && data.chart.error) {
                throw new Error(`Yahoo Finance API error: ${data.chart.error.description || 'Unknown error'}`)
            }

            // 更新统计信息
            this.stats.successfulRequests++
            this.stats.lastSuccessTime = Date.now()
            this.stats.averageResponseTime =
                (this.stats.averageResponseTime * (this.stats.successfulRequests - 1) + responseTime) /
                this.stats.successfulRequests

            // 重置重试计数
            this.retryCount = 0

            // 调用数据回调
            this.options.onData(data)

            return data

        } catch (error) {
            const responseTime = Date.now() - startTime
            this.stats.failedRequests++
            this.stats.lastErrorTime = Date.now()

            const errorMessage = error instanceof Error ? error.message : 'Unknown error'
            console.error(`Failed to fetch data from ${this.options.url}:`, errorMessage)

            // 处理重试逻辑
            if (this.retryCount < this.options.maxRetries) {
                this.retryCount++
                console.log(`Retrying... (${this.retryCount}/${this.options.maxRetries})`)

                setTimeout(() => {
                    if (this.isRunning) {
                        this.fetchData()
                    }
                }, this.options.retryDelay)
            } else {
                console.error('Max retries reached, stopping fetcher')
                this.options.onError(error instanceof Error ? error : new Error(errorMessage))
                this.stop()
            }

            return null
        }
    }

    private scheduleNextFetch(): void {
        if (!this.isRunning) {
            return
        }

        this.timerId = setTimeout(() => {
            if (this.isRunning) {
                this.fetchData()
                this.scheduleNextFetch()
            }
        }, this.options.interval)
    }
}

/**
 * 创建Yahoo Finance数据获取器的便捷函数 - 使用独立代理服务器
 */
export function createYahooFinanceFetcher(
    symbol: string,
    interval: string = '1m',
    options: Partial<FetcherOptions> = {}
): TimerFetcher {
    // 使用独立代理服务器来避免CORS问题
    const url = `http://localhost:3001/api/yahoo-finance/v8/finance/chart/${symbol}?interval=${interval}`

    return new TimerFetcher({
        url,
        interval: 60000, // 默认1分钟
        ...options
    })
}

/**
 * 创建通用JSON数据获取器的便捷函数
 */
export function createJsonFetcher(options: FetcherOptions): TimerFetcher {
    return new TimerFetcher(options)
}
