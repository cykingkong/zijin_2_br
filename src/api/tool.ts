import request from '@/utils/request'

export function upload(data: any): Promise<any> {
    return request.post('auth/upload', data)
}
export function uploadImage(data: any): Promise<any> {
    return request.post('user/uploadImage', data)
}
export function getUserImagesNum(): Promise<any> {
    return request.get('user/getUserImagesNum',)
}