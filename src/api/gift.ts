import request from '@/utils/request'
export function create(data): Promise<any> {
    return request.post<any>('/gameplay/gift/receive', data)
}
export function list(params): Promise<any> {
    return request.get<any>('/gameplay/gift/logList', { params: params })
}