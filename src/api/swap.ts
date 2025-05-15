import request from "@/utils/request";
export function orderList(params): Promise<any> {
    return request.get('/app-api/gameplay/swap_api/orderList', { params })
}
export function swapOrderAdd(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/swap_api/swapOrderAdd', data)
}
export function swapOrderCancel(data): Promise<any> {
    return request.post<any>('/app-api/gameplay/swap_api/swapOrderCancel', data)
}
export function getPosition(params): Promise<any> {
    return request.get('/app-api/gameplay/swap_api/getPosition', { params })
}