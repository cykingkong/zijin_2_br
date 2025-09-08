import request from '@/utils/request'
export function bank_list(params): Promise<any> {
    return request.get<any>('/api/user/bank_list', { params })
}

export function bank_info(params): Promise<any> {
    return request.get<any>('/api/user/get_bank', { params })
}
export function create_bank(data): Promise<any> {
    return request.post<any>('/api/user/create_bank', data)
}
export function userCardUpdate(data): Promise<any> {
    return request.post<any>('/api/user/edit_bank', data)
}
export function userCardDel(data): Promise<any> {
    return request.post<any>('/app-api/user/userCardDel', data)
}
//充值回调
export function aupay_notify(data): Promise<any> {
    return request.post<any>('/app-api/pay_notify/aupay_notify', data)
}
export function mgm_notify(data): Promise<any> {
    return request.post<any>('/app-api/pay_notify/mgm_notify', data)
}
export function qeawapay_notify(data): Promise<any> {
    return request.post<any>('/app-api/pay_notify/qeawapay_notify', data)
}