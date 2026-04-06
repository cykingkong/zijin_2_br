import request from '@/utils/request'

export function getTreasureHome(): Promise<any> {
  return request.get('/gameplay/treasure/home')
}

export function buyTreasure(data: { issueId: number; buyCount: number }): Promise<any> {
  return request.post('/gameplay/treasure/buy', data)
}

export function getTreasureMyOrderList(params: { pageIndex: number; pageSize: number }): Promise<any> {
  return request.get('/gameplay/treasure/myOrderList', { params })
}

export function getTreasureDrawLogList(params: { issueId?: number; goodsId?: number; pageIndex: number; pageSize: number }): Promise<any> {
  return request.get('/gameplay/treasure/drawLogList', { params })
}
