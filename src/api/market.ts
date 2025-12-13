import request from '@/utils/request'

export function indexInfo(): Promise<any> {
    return request.get('/index/indexInfo')
}

export function articleList(params): Promise<any> {
    return request.get('/index/articleList', { params })
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
    return request.get('/api/stock/orderList', { params })
}
export function userOrderList(params, showLoading = true): Promise<any> {
    return request.get('/api/stock/userOrderList', {
        params,
        showLoading
    })
}
export function assetsSearch(params): Promise<any> {
    return request.get('/api/stock/assetsSearch', { params })
}