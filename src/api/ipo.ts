import request from '@/utils/request'
export function ipoOrderSell(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/ipoOrderSell', data)
}
export function orderPay(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/orderPay', data)
}
export function orderFullSubscribe(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/orderFullSubscribe', data)
}
export function orderSubscribe(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/ipo/orderSubscribe', data)
}

export function ipoProductList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/ipo/ipoProductList', { params })
}
export function ipoOrderList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/ipo/orderList', { params })
}
// 申请配资
export function creditApply(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/ipo/creditApply', { params })
}