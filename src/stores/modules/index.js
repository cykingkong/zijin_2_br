import { defineStore } from 'pinia'
import local from '@/utils/local'

export const useStore = defineStore('main', {
  persist: {
    enabled: true,
    strategies: [
      {
        storage: localStorage,
        paths: ['token', 'userCardList']
      }
    ]
  },
  state: () => ({
    loginShow: false,
    listData: {},
    token: local.getlocal('token') || '',
    service: '',
    userCardList: [],
    marketList: [],
    qaList: [],
    withdrawParams: {}
  }),
  actions: {
    setLoginShow(showState) {
      this.loginShow = showState
    },
    setlistData(data) {
      this.listData = data
    },
    setToken(data) {
      this.token = data
    },
    setService(data) {
      this.service = data
    },
    setUserCardList(data) {
      this.userCardList = data
    },
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 1000))
    },
    setMarketList(data) {
      this.marketList = data
    },
    setWithdrawParams(data) {
      this.withdrawParams = data
    },
    setQaList(data) {
      this.qaList = data
    },

  },
  getters: {
    doubleCount: state => state.count * 2,
    getlistData: state => state.listData,
    getService: state => state.service,
    getUserCardList: state => state.userCardList,
    getToken: state => state.token,
    getMarketList: state => state.marketList,
    getQaList: state => state.qaList,
    getWithdrawParams: state => state.withdrawParams
  },
})