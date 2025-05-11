import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        showGlobalLoading: false
    }),
    actions: {
        show() {
            this.showGlobalLoading = true
        },
        hide() {
            this.showGlobalLoading = false
        }
    }
})
