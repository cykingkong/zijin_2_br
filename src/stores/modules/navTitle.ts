
import { defineStore } from 'pinia'

const navTitleStore = defineStore('counter', () => {
    const navTitle = ref('')
    const setNavTitle = (title: string) => {
        navTitle.value = title
    }
    return {
        navTitle,
        setNavTitle
    }
}, {
    persist: true,
})

export default navTitleStore
