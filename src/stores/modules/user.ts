import { defineStore } from 'pinia'
import type { LoginData, UserState } from '@/api/user'
import { clearToken, setToken } from '@/utils/auth'

import {
  getEmailCode,
  getUserInfo,
  getBalancePair,
  getBalance, dataAssets,
  // resetPassword,
  login as userLogin,
  logout as userLogout,
  register as userRegister,
  totalAsset
} from '@/api/user'
import { userCouponsList } from '@/api/product'
const InitUserInfo = {
  couponsList: [],
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
  const login = async (loginForm: LoginData) => {
    try {
      const { data } = await userLogin(loginForm)
      setToken(data.access_token)
      const { data: userInfo } = await getUserInfo()
      setInfo(userInfo)

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
      setInfo(data)
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
      setInfo(data)
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
    logout,
    getCode,
    register,
    getAssetsData,
    getUserCouponList,
  }
}, {
  persist: true,
})

export default useUserStore
