import request from '@/utils/request'
// 获取产品详情

export function day(params): Promise<any> {
    return request.get<any>('/gameplay/salary/day/config', { params })
}
export function week(params): Promise<any> {
    return request.get<any>('/gameplay/salary/weekly/config', { params })
}
export function month(params): Promise<any> {
    return request.get<any>('/gameplay/salary/monthly/config', { params })
}
export function year(params): Promise<any> {
    return request.get<any>('/gameplay/salary/year/config', { params })
}

export function receiveDay(params): Promise<any> {
    return request.post<any>('/gameplay/salary/day/receive', { params })
}
export function receiveWeek(params): Promise<any> {
    return request.post<any>('gameplay/salary/weekly/receive', { params })
}
export function receiveMonth(params): Promise<any> {
    return request.post<any>('/gameplay/salary/monthly/receive', { params })
}

export function dayRecord(params): Promise<any> {
    return request.get<any>('/gameplay/salary/day/record/list', { params })
}
export function weekRecord(params): Promise<any> {
    return request.get<any>('/gameplay/salary/weekly/record/list', { params })
}
export function monthRecord(params): Promise<any> {
    return request.get<any>('/gameplay/salary/monthly/record/list', { params })
}
