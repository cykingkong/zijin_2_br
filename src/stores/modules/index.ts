import { defineStore } from 'pinia'
import local from '@/utils/local'

export const useStore = defineStore('main', () => {
    const listData = ref<any>({})
    const klineList = ref<any>([])
    const token = ref<String>(local.getlocal('token') || '')

    const setListData = (list: any[]) => {
        listData.value = list
    }
    const setklineList = (list: any) => {
        klineList.value = list
    }
    const setToken = (data: string) => {
        token.value = data
    }
    return {
        setListData,
        setklineList,
        setToken
    }
})
