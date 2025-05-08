import axios from 'axios'
import local from './local'

import { closeToast, showFailToast, showLoadingToast, showNotify, showSuccessToast, showToast } from 'vant'

const service = axios.create({
  baseURL: ``,
  withCredentials: true,
  timeout: 100000,
})
let isRefreshing = false // 是否已经出现 401 错误
let requests = [] // 请求队列

service.interceptors.request.use(
  (config) => {
    // if (config.url == '/api/login' || config.url == '/api/register') {
    //     isRefreshing = false
    // }
    // if (isRefreshing) {
    //     return Promise.reject(new Error("未授权，请重新登录"));
    // }
    let token = local.getlocal('token')
    let lang = local.getlocal('lang')
    config.headers.Authorization = `Bearer ${token}` || ''
    config.headers['content-type'] = 'multipart/form-data'
    config.headers.language = lang || 'zh'
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    const { config, response } = error
    console.log(response)
    if (response.status == 401) {
      // isRefreshing = true;
      // local.clear()
      // store.commit('setLoginShow');
      // router.replace("/login");
      return Promise.reject(response)
    }
    else if (response.status == 422) {
    //   ElMessage({
    //     message: response.data.message,
    //     type: 'warning',
    //   })

      // return Promise.reject(response);
    }
    else if (response.status == 404) {
    //   ElMessage({
    //     message: response.data.message,
    //     type: 'warning',
    //   })

      // return Promise.reject(response);
    }
    else if (response.status == 500) {
    //   ElMessage({
    //     message: response.data.message,
    //     type: 'warning',
    //   })

      // return Promise.reject(response);
    }
    else {
      isRefreshing = false
      return Promise.reject(response)
    }
  },
)

let request = (url, methods, params = {}, toast = false) => {
  if (!params.show) {
    showLoadingToast({
      message: '',
      forbidClick: true,
    })
  }
  let data = params
  let res
  if (methods == 'post') {
    res = service.post(url, { ...data })
  }
  else {
    res = service.get(url, { params: data })
  }
  return res
    .then((r) => {
      if (r.code == 200) {
        if (toast) {
        //   ElMessage({
        //     message: r.message,
        //     type: 'success',
        //   })
        }
      }
      else {
        // ElMessage({
        //   message: r.message,
        //   type: 'warning',
        // })
      }
      return Promise.resolve(r)
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}
// export default request;
export const POST = (url, params, toast) => request(url, 'post', params, toast)
export const GET = (url, params, toast) => request(url, 'get', params, toast)
