import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import useRouteCacheStore from '@/stores/modules/routeCache'
import { useUserStore } from '@/stores'

import { isLogin, getToken } from '@/utils/auth'
import setPageTitle from '@/utils/set-page-title'

NProgress.configure({ showSpinner: true, parent: '#app' })

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// This will update routes at runtime without reloading the page
if (import.meta.hot)
  handleHotUpdate(router)

router.beforeEach(async (to: EnhancedRouteLocation) => {
  // NProgress.start()
  // console.log(to, 'to', next)
  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  // setPageTitle(to.meta.title)
  // Safely check user info
  // console.log(isLogin() && !userStore.userInfo?.uid, 'isLogin() && !userStore.userInfo?.uid', from)
  if (!isLogin() && to.path !== '/login' && to.path !== '/' && to.path != '/register' && to.path != '/forgot-password') {
    return '/login'
  }

  if (isLogin() && !userStore.userInfo?.uid) {
    try {
      // await userStore.info()
    } catch (error) {
      console.error('Failed to fetch user info:', error)
    }
  }
})

router.afterEach(() => {
  // NProgress.done()
})

export default router
