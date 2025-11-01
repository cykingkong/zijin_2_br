import request from '@/utils/request'
export function ipoOrderSell(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/ipoOrderSell', data)
}
export function orderPay(data): Promise<any> {
    return request.post<any>('/api/ipo/ipo_buy', data)
}
export function orderFullSubscribe(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/orderFullSubscribe', data)
}
export function orderSubscribe(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/orderSubscribe', data)
}

export function ipoProductList(params): Promise<any> {
    return request.get<any>('/api/ipo/ipo_list', { params: params })
}
export function ipoOrderList(params): Promise<any> {
    return request.get<any>('/api/ipo/order_list', { params: params })
}
export function ipoProductInfo(params): Promise<any> {
    return request.get<any>('/api/ipo/ipo_detail', { params: params })
}
export function ipoSub(data): Promise<any> {
    return request.post<any>('/api/ipo/ipo_sub', data)
}
// 申请配资
export function creditApply(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/creditApply', data)
}
export function creditApplyList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/ipo/creditApplyList', { params: params })
}
export function creditApplyInfo(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/ipo/creditApplyInfo', { params: params })
}