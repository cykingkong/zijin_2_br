import request from '@/utils/request'

export function indexInfo(): Promise<any> {
    return request.get('/app-api/market/indexInfo')
}
export function appCharts(params): Promise<any> {
    return request.get('/app-api/market/appCharts', { params })
}
export function depth(params): Promise<any> {
    return request.get('/app-api/market/depth', { params })
}
export function kline(params): Promise<any> {
    return request.get('/app-api/market/kline', { params })
}
export function market(params): Promise<any> {
    return request.get('/app-api/market/market', { params })
}
export function assetsList(params): Promise<any> {
    return request.get('/app-api/market/assetsList', { params })
}
export function getCategoryPosition(params): Promise<any> {
    return request.get('/app-api/gameplay/swap_api/getCategoryPosition', { params })
}
