import CryptoJS from 'crypto-js'
import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'
import { locale } from '@/utils/i18n'

import {
  getEmailCode,
  getUserInfo,
  getUserFakeInfo,
  getBalancePair,
  getBalance, dataAssets,
  // resetPassword,
  login as userLogin,
  seologin,
  logout as userLogout,
  register as userRegister,
  totalAsset, walletInfo, getTeamData, getTeamInfoData
} from '@/api/user'
import { userCouponsList } from '@/api/product'
const InitUserInfo = {
  couponsList: [],
}

let salesmartlyScriptPromise: Promise<void> | null = null

const loadSalesmartlyJS = (src?: string) => {
  if (!src || typeof window === 'undefined')
    return Promise.resolve()

  const scriptId = 'salesmartly-js'
  const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null

  if (existingScript)
    return salesmartlyScriptPromise || Promise.resolve()

  salesmartlyScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = scriptId
    script.src = src
    script.async = true

    script.onload = () => resolve()
    script.onerror = () => {
      salesmartlyScriptPromise = null
      script.remove()
      reject(new Error(`Failed to load Salesmartly script: ${src}`))
    }

    document.body.appendChild(script)
  })

  return salesmartlyScriptPromise
}

const setSalesmartlyLoginInfo = (params: { phone?: string, userId?: string | number, userName?: string }) => {
  if ((!params.phone && !params.userId && !params.userName) || typeof window === 'undefined')
    return

  const salesmartlyQueue = (window as any).ssq
  if (!salesmartlyQueue?.push)
    return

  salesmartlyQueue.push('setLoginInfo', {
    phone: params.phone,
    user_id: params.userId ? CryptoJS.MD5(String(params.userId)).toString() : undefined,
    user_name: params.userName,
    language: locale.value,
  })
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<any>({ ...InitUserInfo })

  // Set user's information
  const setInfo = (partial: Partial<any>) => {
    userInfo.value = { ...userInfo.value, ...partial }
  }
  const setCouponsList = (partial: any) => {
    userInfo.value.couponsList = [...partial]
  }
  const applyUserInfo = (data: any) => {
    setInfo(data)
    void loadSalesmartlyJS(data?.salesmartlyJS)
      .then(() => setSalesmartlyLoginInfo({
        phone: data?.phone,
        userId: data?.userId,
        userName: data?.username,
      }))
      .catch(() => { })
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { data } = await userLogin(loginForm)
      setToken(data.access_token)
      const { data: userInfo } = await getUserInfo()
      applyUserInfo(userInfo)

    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  const loginByToken = async (params: any) => {
    try {
      const { data } = await seologin(params)
      setToken(data.access_token)
      const { data: userInfo } = await getUserInfo()
      applyUserInfo(userInfo)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  const register = async (form: any) => {
    try {
      const { data } = await userRegister(form)
      setToken(data.access_token)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  const fetchTeamData = async (form: any) => {
    try {
      const { data } = await getTeamData(form)
      setInfo(data)
    } catch (error) {
      throw error
    }
  }
  const fetchTeamInfoData = async () => {
    try {
      const { data } = await getTeamInfoData()
      data.topData?.forEach((item: any) => {
        item.allUserCount = item.vaildUserCount + item.noVaildUserCount || 0
      })
      setInfo(data)
    } catch (error) {
      throw error
    }
  }
  const getWalletInfo = async () => {
    try {
      const { data } = await walletInfo({})
      setInfo(data)
    } catch (error) {
      throw error
    }
  }
  const getUserCouponList = async (couponStatus = null) => {
    try {
      const { data } = await userCouponsList({
        page: 1,
        pageSize: 100,
        status: couponStatus
      })
      setCouponsList(data.rows)
    } catch (error) {
      throw error
    }
  }
  const info = async () => {
    try {
      const { data } = await getUserInfo()
      // const { data: ff2 } = await getBalance()
      // const { data: ff3 } = await totalAsset()
      applyUserInfo(data)
      // setInfo(ff2)
      // setInfo(ff3)
    }
    catch (error) {
      // clearToken()
      throw error
    }
  }
  const getInfo = async () => {
    try {
      const { data } = await getUserInfo()
      applyUserInfo(data)
    }
    catch (error) {
      // clearToken()
      throw error
    }
  }
  const getAssetsData = async () => {
    try {
      const { data } = await dataAssets()
      setInfo(data)
    } catch (error) {
      // clearToken()
      throw error
    }
  }
  const logout = async () => {
    try {
      // await userLogout()
      clearToken()
      setInfo({ userId: "" })
    }
    finally {
      clearToken()
      setInfo({ ...InitUserInfo })
    }
  }

  const getCode = async () => {
    try {
      const data = await getEmailCode()
      return data
    }
    catch { }
  }

  // const reset = async () => {
  //   try {
  //     const data = await resetPassword()
  //     return data
  //   }
  //   catch { }
  // }



  return {
    userInfo,
    info,
    getInfo,
    login,
    loginByToken,
    logout,
    getCode,
    register,
    getAssetsData,
    getUserCouponList, getWalletInfo, fetchTeamData, fetchTeamInfoData,
    setInfo
  }
}, {
  persist: true,
})

export default useUserStore
