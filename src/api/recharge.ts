import request from '@/utils/request'
export function coinRechargeConfig(params: any = {}): Promise<any> {
    return request.get('/app-api/recharge/coinRechargeConfig', { params })
}
export function rechargeConfig(params: any = {}): Promise<any> {
    return request.get('/app-api/recharge/rechargeConfig', { params })
}
export function coinWithdrawConfig(params: any = {}): Promise<any> {
    return request.get('/app-api/withdraw/coinWithdrawConfig', { params })
}
export function recharge(data: any): Promise<any> {
    return request.post('app-api/recharge/recharge', data)
}
export function withdraw(data: any): Promise<any> {
    return request.post('app-api/withdraw/withdraw', data)
}
export function rechargeOrderGrid(params: any): Promise<any> {
    return request.get('/app-api/recharge/rechargeOrderGrid', { params })
}