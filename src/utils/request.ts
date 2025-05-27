import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify, showLoadingToast } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
// import local from './local'


// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头
export const REQUEST_TOKEN_KEY = 'Authorization'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  // 确保在错误处理时关闭loading
  error.config?.loadingToast?.close()

  if (error.response) {
    const { data = {}, status, statusText, } = error.response
    console.log(error.response, 'err')
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401) {
      showNotify({
        type: 'danger',
        message: '请重新登录',
      })
      // 如果你需要直接跳转登录页面
      location.replace('/login')
    }
  }
  return Promise.reject(error)
}

// 扩展Axios配置类型
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    loadingToast?: ReturnType<typeof showLoadingToast>
  }
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const toast = showLoadingToast({
    duration: 0,
    forbidClick: true,
    message: '加载中...'
  })
  config.loadingToast = toast
  let lang = localStorage.getItem('language')

  const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY)
  // 如果 token 存在
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[REQUEST_TOKEN_KEY] = `Bearer ${savedToken}`
  config.headers["language"] = lang || "zh";
  return config
}

// Add a request interceptor
request.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
function responseHandler(response: any) {
  const { code, message } = response.data
  response.config?.loadingToast?.close()

  if (code === 200) {
    // 成功时保持Toast显示
    return response.data
  } else {
    showNotify({
      type: 'danger',
      message: message
    })
    return Promise.reject(new Error(message))
  }
}

// Add a response interceptor
request.interceptors.response.use(responseHandler, errorHandler)

export default request
