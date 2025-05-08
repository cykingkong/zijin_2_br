import request from '@/utils/request'
// 获取产品详情

export function bondProductInfo(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/bond/bondProductInfo', { params })
}
// 获取产品列表
export function bondProductList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/bond/bondProductList', { params })
}
// 获取总收益数据
export function orderData(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/bond/orderData', { params })
}
// 获取订单列表
export function orderList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/bond/orderList', { params })
}
// 获取订单详情
export function orderInfo(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/bond/orderInfo', { params })
}
// 预约债券
export function placeOrder(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/bond/placeOrder', { data })
}
// 支付债券订单
export function placeOrderPay(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/bond/placeOrderPay', { data })
}
// 出售债券
export function sellOrder(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/bond/sellOrder', { data })
}
// 股息玩法
//获取产品列表
export function dividendProductList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/dividend/dividendProductList', { params })
}
// 预约股息
export function dividendPlaceOrder(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/dividend/placeOrder', { data })
}
// 支付股息订单
export function dividendPlaceOrderPay(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/dividend/placeOrderPay', { data })
}