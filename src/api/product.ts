import request from "@/utils/request";
export function productList(params): Promise<any> {
    return request.get('/gameplay/product/list', { params })
}
export function productInfo(params): Promise<any> {
    return request.get('/gameplay/product/info', { params })
}
export function userProductList(params): Promise<any> {
    return request.get('/gameplay/product/userProductList', { params })
}
export function productIncomeLogsList(params): Promise<any> {
    return request.get('/gameplay/product/productIncomeLogsList', { params })
}

export function couponInfo(params): Promise<any> {
    return request.get('/gameplay/product/couponInfo', { params })
}

export function userCouponsList(params): Promise<any> {
    return request.get('/gameplay/product/userCouponsList', { params })
}
export function couponList(params): Promise<any> {
    return request.get('/gameplay/product/couponList', { params })
}
export function claimIncome(data): Promise<any> {
    return request.post<any>('/gameplay/product/claimIncome', data)
}
export function receiveCoupon(data): Promise<any> {
    return request.post<any>('/gameplay/product/receiveCoupon', data)
}
export function getPosition(params): Promise<any> {
    return request.get('/app-api/gameplay/swap_api/getPosition', { params })
}
export function purchase(data): Promise<any> {
    return request.post<any>('/gameplay/product/purchase', data)
}



export function tipsList(params): Promise<any> {
    return request.get('/gameplay/product/tipsList', { params })
}