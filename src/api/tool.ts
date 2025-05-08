import request from '@/utils/request'

export function uploadFile(data: any): Promise<any> {
    return request.put('/app-api/user/upload', data)
}