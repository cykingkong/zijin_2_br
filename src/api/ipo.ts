import request from '@/utils/request'
export function ipoOrderSell(data): Promise<any> {
    return request.post<any>('/api/ipo/ipo_sell', data)
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
export function ipoOrderList(params, options?: { showLoading?: boolean }): Promise<any> {
    return request.get<any>('/api/ipo/order_list', { params: params, showLoading: options?.showLoading },

    )
}
export function ipoProductInfo(params): Promise<any> {
    return request.get<any>('/api/ipo/ipo_detail', { params: params })
}
export function ipoSub(data): Promise<any> {
    return request.post<any>('/api/ipo/ipo_sub', data)
}
// 申请配资 0 审核中 1 已审核 2 已领取 3 已还完
export function creditApply(data): Promise<any> {
    return request.post<any>('/api/loan/create', data)
}
export function receive(data): Promise<any> {
    return request.post<any>('/api/loan/receive', data)
}
export function repay(data): Promise<any> {
    return request.post<any>('/api/loan/repay', data)
}
export function aplicar(params): Promise<any> {
    return request.get<any>('/api/loan/aplicar', { params: params })
}
export function loanIndex(params): Promise<any> {
    return request.get<any>('/api/loan/index', { params: params })
}
export function creditApplyInfo(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/ipo/creditApplyInfo', { params: params })
}