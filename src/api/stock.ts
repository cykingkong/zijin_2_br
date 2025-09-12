import request from '@/utils/request'
// 获取股票列表
export function assetsList(params): Promise<any> {
    return request.get<any>('/api/stock/assetsList', { params })
}

export function assetsDetail(params): Promise<any> {
    return request.get<any>('/api/stock/assetsDetail', { params })
}

export function orderList(params): Promise<any> {
    return request.get<any>('/api/stock/orderList', { params })
}
export function orderLists(params): Promise<any> {
    return request.get<any>('/api/stock/orderLists', { params })
}
export function orderDetail(params): Promise<any> {
    return request.get<any>('/api/stock/orderDetail', { params })
}
export function buySell(data): Promise<any> {
    return request.post<any>('/api/stock/buySell', data)
}