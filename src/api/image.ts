import request from '@/utils/request'
// 获取产品详情

export function imageList(params): Promise<any> {
    return request.get<any>('/user/imageList', { params })
}

export function helpList(params): Promise<any> {
    return request.get<any>('article/index', { params })
}
export function activityDetail(params): Promise<any> {
    return request.get<any>('article/detail', { params })
}
