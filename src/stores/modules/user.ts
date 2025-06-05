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
} from '@/api/user'

const InitUserInfo = {

}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserState>({ ...InitUserInfo })

  // Set user's information
  const setInfo = (partial: Partial<UserState>) => {
    userInfo.value = { ...userInfo.value, ...partial }
  }

  const login = async (loginForm: LoginData) => {
    try {
      const { data } = await userLogin(loginForm)
      setToken(data.token)
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
      setToken(data.token)
    }
    catch (error) {
      clearToken()
      throw error
    }
  }
  const info = async () => {
    try {
      const { data } = await getUserInfo()
      const { data: ff2 } = await getBalance()
      const { data: ff3 } = await dataAssets()
      setInfo(data)
      setInfo(ff2)
      setInfo(ff3)
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
    login,
    logout,
    getCode,
    register,
    getAssetsData
  }
}, {
  persist: true,
})

export default useUserStore
