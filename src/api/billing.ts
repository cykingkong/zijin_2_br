import request from '@/utils/request'
// 获取产品详情

export function depositMethod(params): Promise<any> {
    return request.get<any>('/api/billing/depositMethod', { params })
}

export function withdraw_info(): Promise<any> {
    return request.get<any>('/api/billing/withdraw_info', {})
}
// 充值

export function deposit(data): Promise<any> {
    return request.post<any>('/api/billing/deposit', data)
}
export function withdraw(data): Promise<any> {
    return request.post<any>('/api/billing/withdraw', data)
}