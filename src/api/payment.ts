import request from '@/utils/request'
export function userCardGrid(params): Promise<any> {
    return request.get<any>('/app-api/user/userCardGrid', { params })
}
export function userCardAdd(data): Promise<any> {
    return request.post<any>('/app-api/user/userCardAdd', data)
}
export function userCardUpdate(data): Promise<any> {
    return request.post<any>('/app-api/user/userCardUpdate', data)
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