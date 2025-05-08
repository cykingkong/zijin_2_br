import request from '@/utils/request'
export function coinRechargeConfig(params: any = {}): Promise<any> {
    return request.get('/app-api/recharge/coinRechargeConfig', { params })
}
export function rechargeConfig(params: any = {}): Promise<any> {
    return request.get('/app-api/recharge/rechargeConfig', { params })
}
export function recharge(data: any): Promise<any> {
    return request.post('app-api/recharge/recharge', data)
}
export function rechargeOrderGrid(params: any): Promise<any> {
    return request.get('/app-api/recharge/rechargeOrderGrid', { params })
}