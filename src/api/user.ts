import request from '@/utils/request'

export interface LoginData {
  account: string
  password: string
}

export interface LoginRes {
  token: string
}

export interface UserState {
  uid?: number
  name?: string
  avatar?: string
  userId?: string
}

export function login(data: any): Promise<any> {
  return request.post<LoginRes>('/app-api/user/login', data)
}

export function logout() {
  return request.post('/user/logout')
}

export function getUserInfo() {
  return request<UserState>('/app-api/user/info')
}

export function getEmailCode(): Promise<any> {
  return request.get('/user/email-code')
}


export function forgetPassword(data): Promise<any> {
  return request.post('/app-api/user/forgetPassword', data)
}
export function updatePassword(data): Promise<any> {
  return request.post('/app-api/user/updatePassword', data)
}
export function register(data): Promise<any> {
  return request.post('/app-api/user/register', data)
}
export function getCaptchaSlide(): Promise<any> {
  return request.post('/app-api/user/getCaptchaSlide')
}
export function sendCode(params): Promise<any> {
  return request.get('/app-api/user/sendCode', { params })
}
// 银行卡
export function UserCardGrid(params): Promise<any> {
  return request.get('/app-api/user/UserCardGrid', { params })
}
export function UserCardAdd(data): Promise<any> {
  return request.post('/app-api/user/UserCardAdd', data)
}
export function UserCardDel(data): Promise<any> {
  return request.post('/app-api/user/UserCardDel', data)
}
export function UserCardUpdate(data): Promise<any> {
  return request.post('/app-api/user/UserCardUpdate', data)
}
export function kyc(data): Promise<any> {
  return request.post('/app-api/user/kyc', data)
}
export function getKfUrl(params): Promise<any> {
  return request.get('/app-api/user/getKfUrl', { params })
}
// 用户信息相关
// 获取可用余额（全部）
export function getBalance(): Promise<any> {
  return request.get('/app-api/user/getBalance', {})
}
// 获取可用余额（币对）
export function getBalancePair(params): Promise<any> {
  return request.get('/app-api/user/getBalancePair', { params })
}
// 账变记录
export function walletLogsGrid(params): Promise<any> {
  return request.get('/app-api/user/walletLogsGrid', { params })
}
export function dataAssets(): Promise<any> {
  return request.get('/app-api/user/dataAssets', {})
}
export function bindPhone(data): Promise<any> {
  return request.post('/app-api/user/bindPhone', data)
}