import request from '@/utils/request'
// 兑换比例
export function conversionInfo(params): Promise<any> {
    return request.get<any>('/app-api/conversion/conversionInfo', { params })
}
export function conversion(data): Promise<any> {
    return request.post<any>('/app-api/conversion/conversion', data)
}
export function coinConversion(data): Promise<any> {
    return request.post<any>('/app-api/conversion/coinConversion', data)
}