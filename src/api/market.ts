import request from '@/utils/request'

export function indexInfo(): Promise<any> {
    return request.get('/app-api/market/indexInfo')
}
export function depth(): Promise<any> {
    return request.get('/app-api/market/depth')
}
export function market(params): Promise<any> {
    return request.get('/app-api/market/market', { params })
}