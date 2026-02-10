import request from '@/utils/request'
// 获取产品详情

export function seed(params): Promise<any> {
    return request.get<any>('/gameplay/seed/config', { params })
}

export function exchangeSeed(data): Promise<any> {
    return request.post<any>('/gameplay/seed/exchange', data)
}
