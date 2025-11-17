// 定义导航栏和标签栏可见的路由白名单
export const routeWhiteList: readonly string[] = [
  'home', // 首页
  'profile', // 个人中心
  'quotes',
  'optional',
  'news',
  'deal',
  // 'IPO',
  'portfolio',
  'wallet',
  'Market'
]
export const navWhiteList: readonly string[] = [
  'home', // 首页
  'profile', // 个人中心
  'quotes',
  'news',
  'deal',
  'openTrade',
  'optional',
  '/ipo/creditPage',
  'discount',
  'dividend',
  '/quotes/detail',
  '/quotes/accountChange',
  'portfolio',
  'ipo',
  'login', // 登录页面
  '/login/', // 登录主页面
  'register',
  '/buy/success',
  'wallet',
  'orderDetail',
  'fundOrderDetail',
  'searchStock',
  'wallet/exchange/deposit-success',
  'wallet/exchange/withdraw-success',
  'Market',
  'creditLoan',
  '/creditLoan/creditPage',
  '/creditLoan/loan'
]