import axios from 'axios'

export interface StockDataPoint {
    t: number      // 时间戳
    o: number      // 开盘价 (Open)
    h: number      // 最高价 (High)
    l: number      // 最低价 (Low)
    c: number      // 收盘价 (Close)
    v: number      // 成交量 (Volume)
}

export interface StockResponse {
    status: number
    data: StockDataPoint[]
}

export interface StockRequestParams {
    symbol: string
    start: string
    end: string
    interval?: string
    chartiq?: boolean
}

export class StockDataFetcher {
    private baseURL: string
    private client: any

    /**
     * 构造函数
     * 初始化API基础URL和axios客户端配置
     */
    constructor() {
        // 设置API的基础URL
        this.baseURL = 'https://stockanalysis.com/api/charts'
        // 创建axios客户端实例，配置超时时间和请求头
        this.client = axios.create({
            timeout: 15000,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
            }
        })
    }

    /**
     * 获取股票流式数据
     * @param params 请求参数
     * @returns Promise<StockResponse>
     */
    async getStockStream(params: StockRequestParams): Promise<StockResponse> {
        try {
            const response = await this.client.get(`/a/${params.symbol}/stream/c`, {
                params: {
                    chartiq: params.chartiq ?? true,
                    start: params.start,
                    end: params.end,
                    interval: params.interval ?? '1min'
                }
            })

            return response.data
        } catch (error) {
            console.error(`获取${params.symbol}股票数据失败:`, error)
            throw error
        }
    }

    /**
     * 获取VALE3股票数据
     * @param start 开始日期
     * @param end 结束日期
     * @param interval 时间间隔
     * @returns Promise<StockResponse>
     */
    async getVale3Data(start: string = '2025-08-13', end: string = '2025-08-14', interval: string = '1min'): Promise<StockResponse> {
        return this.getStockStream({
            symbol: 'bvmf-vale3',
            start,
            end,
            interval
        })
    }

    /**
     * 获取指定股票数据
     * @param symbol 股票代码
     * @param start 开始日期
     * @param end 结束日期
     * @param interval 时间间隔
     * @returns Promise<StockResponse>
     */
    async getStockData(symbol: string, start: string, end: string, interval: string = '1min'): Promise<StockResponse> {
        return this.getStockStream({
            symbol,
            start,
            end,
            interval
        })
    }

    /**
     * 获取最新价格
     * @param data 股票数据
     * @returns number | null
     */
    getLatestPrice(data: StockResponse): number | null {
        if (data.status === 200 && data.data.length > 0) {
            return data.data[data.data.length - 1].c
        }
        return null
    }

    /**
     * 获取价格变化
     * @param data 股票数据
     * @returns { change: number, changePercent: number } | null
     */
    getPriceChange(data: StockResponse): { change: number, changePercent: number } | null {
        if (data.status === 200 && data.data.length >= 2) {
            const latest = data.data[data.data.length - 1]
            const previous = data.data[data.data.length - 2]

            const change = latest.c - previous.c
            const changePercent = (change / previous.c) * 100

            return { change, changePercent }
        }
        return null
    }

    /**
     * 格式化时间戳
     * @param timestamp Unix时间戳
     * @returns string
     */
    formatTimestamp(timestamp: number): string {
        return new Date(timestamp * 1000).toLocaleString()
    }

    /**
     * 获取今日数据
     * @param symbol 股票代码
     * @returns Promise<StockResponse>
     */
    async getTodayData(symbol: string = 'bvmf-vale3'): Promise<StockResponse> {
        const today = new Date().toISOString().split('T')[0]
        return this.getStockData(symbol, today, today, '1min')
    }

    /**
     * 获取本周数据
     * @param symbol 股票代码
     * @returns Promise<StockResponse>
     */
    async getWeekData(symbol: string = 'bvmf-vale3'): Promise<StockResponse> {
        const today = new Date()
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
        const endOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 6))

        const start = startOfWeek.toISOString().split('T')[0]
        const end = endOfWeek.toISOString().split('T')[0]

        return this.getStockData(symbol, start, end, '1min')
    }
}

// 创建默认实例
export const stockFetcher = new StockDataFetcher()

// 导出便捷函数
export const getStockData = (params: StockRequestParams) => stockFetcher.getStockStream(params)
export const getVale3Data = (start?: string, end?: string, interval?: string) => stockFetcher.getVale3Data(start, end, interval)
export const getTodayData = (symbol?: string) => stockFetcher.getTodayData(symbol)
export const getWeekData = (symbol?: string) => stockFetcher.getWeekData(symbol)
