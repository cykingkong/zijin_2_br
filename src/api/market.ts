import request from '@/utils/request'

export function indexInfo(): Promise<any> {
    return request.get('/app-api/market/indexInfo')
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