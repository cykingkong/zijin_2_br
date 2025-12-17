import request from '@/utils/request'
export function draw(data): Promise<any> {
    return request.post<any>('/gameplay/lottery/draw', data)
}
export function configList(params): Promise<any> {
    return request.get<any>('/gameplay/lottery/configList', { params: params })
}
export function logList(params): Promise<any> {
    return request.get<any>('/gameplay/lottery/logList', { params: params })
}