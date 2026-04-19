import request from '@/utils/request'

export interface TreasureDrawLogItem {
  id: number
  issueId: number
  issueNo: number
  goodsId: number
  goodsName: string
  winnerUserId: number
  winnerPhone: string
  winnerCode: string
  drawSource?: number
  createdAt: string
}

export interface TreasureIssueItem {
  issueId: number
  goodsId: number
  classId: number
  className?: string
  classDesc?: string
  goodsName: string
  goodsSubName?: string
  goodsImage?: string
  marketPrice?: number
  issueNo: number
  unitPrice: number
  totalCodes: number
  soldCodes: number
  leftCodes: number
  progress: number
  status: number
  drawSource?: number
  drawAt?: string
  canBuy: boolean
}

export interface TreasureClassItem {
  classId: number
  className?: string
  classDesc?: string
  issues: TreasureIssueItem[]
}

export interface TreasureHomeData {
  walletBalance: number
  classes: TreasureClassItem[]
  latestDrawLogs: TreasureDrawLogItem[]
}

export interface TreasureBuyParams {
  issueId: number
  buyCount: number
}

export interface TreasureOrderItem {
  orderId: number
  orderNo: string
  issueId: number
  issueNo: number
  goodsId: number
  goodsName: string
  goodsImage?: string
  buyCount: number
  unitPrice: number
  payAmount: number
  status: number
  createdAt: string
  codes: string[]
}

export interface TreasureListData<T> {
  rows: T[]
  total: number | string
}

export type TreasureRecordTab = 'draw' | 'order' | 'win'

export type OrderResultType = 'pending' | 'won' | 'lost'

export interface TreasureOrderView extends TreasureOrderItem {
  drawLog: TreasureDrawLogItem | null
  resultType: OrderResultType
}

export interface LatestDrawGroup {
  key: string
  goodsId: number
  goodsName: string
  records: TreasureDrawLogItem[]
}

export interface TreasureMyOrderListParams {
  pageIndex: number
  pageSize: number
}

export interface TreasureDrawLogListParams {
  issueId?: number
  goodsId?: number
  pageIndex: number
  pageSize: number
}

export function getTreasureHome(): Promise<any> {
  return request.get('/gameplay/treasure/home')
}

export function buyTreasure(data: TreasureBuyParams): Promise<any> {
  return request.post('/gameplay/treasure/buy', data)
}

export function getTreasureMyOrderList(params: TreasureMyOrderListParams): Promise<any> {
  return request.get('/gameplay/treasure/myOrderList', { params })
}

export function getTreasureDrawLogList(params: TreasureDrawLogListParams): Promise<any> {
  return request.get('/gameplay/treasure/drawLogList', { params })
}
