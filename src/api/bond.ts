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
    return request.post<any>('/app-api/gameplay/bond/placeOrder', data)
}
// 支付债券订单
export function placeOrderPay(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/bond/placeOrderPay', data)
}
// 出售债券
export function sellOrder(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/bond/sellOrder', data)
}
// 股息玩法
//获取产品列表
export function dividendProductList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/dividend/dividendProductList', { params })
}
export function dividendOrderList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/dividend/orderList', { params })
}
// 预约股息
export function dividendPlaceOrder(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/dividend/placeOrder', data)
}
// 支付股息订单
export function dividendPlaceOrderPay(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/dividend/placeOrderPay', data)
}
// 折扣股玩法
// 获取订单详情
export function discountOrderList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/discount/orderList', { params })
}
//获取产品列表
export function discountList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/discount/discountList', { params })
}
export function discountOrderBuy(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/discount/discountOrderBuy', data)
}
export function discountOrderSell(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/discount/discountOrderSell', data)
}
// 基金
// 列表
export function fundProductList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/fund/fundProductList', { params })
}
// 订单列表
export function fundOrderList(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/fund/orderList', { params })
}
// 详情
export function fundProductInfo(params): Promise<any> {
    return request.get<any>('/app-api/gameplay/fund/fundProductInfo', { params })
}
// 赎回
export function orderRedeem(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/fund/orderRedeem', data)
}
// 购买
export function orderPay(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/fund/orderPay', data)
}
// 续期
export function orderReNew(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/fund/orderReNew', data)
}
// 预约
export function orderReserve(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/fund/orderReserve', data)
}
// 领取收益
export function orderGetProfit(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/fund/orderGetProfit', data)
}
// 领取收益
export function discountOrderFreeze(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/discount/discountOrderFreeze', data)
}