import request from '@/utils/request'
// 获取产品详情

export function depositMethod(params): Promise<any> {
    return request.get<any>('/recharge/rechargeConfig', { params })
}

export function withdraw_info(): Promise<any> {
    return request.get<any>('/withdraw/withdrawConfig', {})
}
// 充值
export function rechargeConfig(): Promise<any> {
    return request.get<any>('/recharge/rechargeConfig', {})
}
export function deposit(data): Promise<any> {
    return request.post<any>('/recharge/recharge', data)
}
export function withdraw(data): Promise<any> {
    return request.post<any>('/withdraw/withdraw', data)
}