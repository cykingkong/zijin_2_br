import { createRouter, createWebHashHistory } from 'vue-router/auto'
import { handleHotUpdate, routes } from 'vue-router/auto-routes'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import type { EnhancedRouteLocation } from './types'
import useRouteCacheStore from '@/stores/modules/routeCache'
import { useUserStore } from '@/stores'

import { isLogin } from '@/utils/auth'

NProgress.configure({ showSpinner: true, parent: '#app' })

const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_APP_PUBLIC_PATH),
  routes,
})

// This will update routes at runtime without reloading the page
if (import.meta.hot)
  handleHotUpdate(router)

// 定义不需要登录的公开页面
const publicRoutes = [
  '/',
  '/login',
  '/login/login',
  '/register',
  '/forgot-password',
  '/profile/languange',
  '/webview',
]

router.beforeEach(async (to: EnhancedRouteLocation) => {
  // NProgress.start()
  const routeCacheStore = useRouteCacheStore()
  const userStore = useUserStore()

  // Route cache
  routeCacheStore.addRoute(to)

  // Set page title
  // setPageTitle(to.meta.title)

  console.log(to.path, 'to.path')

  // 检查是否需要登录
  const isPublicRoute = publicRoutes.includes(to.path)
  const isUserLoggedIn = isLogin()

  // 如果用户未登录且访问的不是公开页面，则跳转到登录页
  if (!isUserLoggedIn && !isPublicRoute) {
    console.log('用户未登录，跳转到登录页')
    return '/login'
  }

  // 如果用户已登录但没有用户信息，尝试获取用户信息
  if (isUserLoggedIn && !userStore.userInfo?.uid) {
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
