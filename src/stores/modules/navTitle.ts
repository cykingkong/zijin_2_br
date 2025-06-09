
import { defineStore } from 'pinia'

const navTitleStore = defineStore('counter', () => {
    const navTitle = ref('')
    const showNavLeft = ref(true)
    const setNavTitle = (title: string) => {
        navTitle.value = title
    }
    const setShowNavLeft = (show: boolean) => {
        showNavLeft.value = show
    }
    return {
        navTitle,
        setNavTitle,
        showNavLeft,
        setShowNavLeft
    }
}, {
    persist: true,
})

export default navTitleStore
