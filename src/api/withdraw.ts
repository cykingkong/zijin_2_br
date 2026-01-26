import request from '@/utils/request'

export function withdrawConfig(params: any): Promise<any> {
    return request.get('/app-api/withdraw/withdrawConfig', params)
}
export function coinWithdrawConfig(params: any): Promise<any> {
    return request.get('/app-api/withdraw/coinWithdrawConfig', params)
}
export function withdrawOrderGrid(params: any): Promise<any> {
    return request.get('/withdraw/withdrawOrderGrid', { params })
}
export function withdraw(data: any): Promise<any> {
    return request.post('app-api/withdraw/withdraw', data)
}