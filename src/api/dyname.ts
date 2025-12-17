import request from '@/utils/request'
export function create(data): Promise<any> {
    return request.post<any>('/gameplay/dynamic/create', data)
}
export function list(params): Promise<any> {
    return request.get<any>('/gameplay/dynamic/list', { params: params })
}