import request from '@/utils/request'

export function uploadFile(data: any): Promise<any> {
    return request.post('/api/user/upload', data)
}