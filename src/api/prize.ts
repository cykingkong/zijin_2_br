import request from '@/utils/request'
import axios from 'axios'

export function getPrizeHome(): Promise<any> {
  return request.get('/gameplay/prize/home')
}

export async function getPrizePoolConfig(poolType: number): Promise<any> {
  try {
    return await request.get('/gameplay/prize/poolConfig', {
      params: { poolType },
    })
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data
      if (responseData?.code === 1001) {
        return responseData
      }
    }
    throw error
  }
}

export function exchangePrizeKey(data: { keyType: number; count?: number; orderId?: string }): Promise<any> {
  return request.post('/gameplay/prize/exchangeKey', data)
}

export function drawPrize(data: { poolType: number; clientCardNo?: number | null }): Promise<any> {
  return request.post('/gameplay/prize/draw', data)
}

export function resetPrizeRound(data: { poolType: number }): Promise<any> {
  return request.post('/gameplay/prize/resetRound', data)
}

export function getPrizeDrawLog(params: { pageIndex: number; pageSize: number }): Promise<any> {
  return request.get('/gameplay/prize/drawLog', { params })
}

export function getPrizePointLog(params: { pageIndex: number; pageSize: number }): Promise<any> {
  return request.get('/gameplay/prize/pointLog', { params })
}
