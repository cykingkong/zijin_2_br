<script setup lang="ts">
import router from '@/router'
import { useStore } from '@/stores/modules/index'
import grid1 from '@/assets/grid/grid1.jpg'
import grid2 from '@/assets/grid/grid2.jpg'
import grid3 from '@/assets/grid/grid3.jpg'
import grid4 from '@/assets/grid/grid4.jpg'
import Indicator from "@/pages/deal/components/indicator.vue";

import tabItem from './quotes/component/tab-item.vue'
import Banner from './quotes/component/banner.vue'
import Notice from './quotes/component/notice.vue'
import Grid from '@/components/grid.vue'

import hotmap from './quotes/component/hotmap.vue'
import TopStories from './quotes/component/topStories.vue'
import StockMarketWidget from './quotes/component/stockMarketWidget.vue'
import { useUserStore } from '@/stores'
import { navTitleStore } from '@/stores/index'

import { useI18n } from 'vue-i18n'
import { appCharts, indexInfo, market } from '@/api/market'
import { getKfUrl } from '@/api/user'
import local from '@/utils/local'
import { closeToast, showLoadingToast } from 'vant'

const { t } = useI18n()
const activeName = ref('')
const navStore = navTitleStore()

const store = useStore()
const requestCount = ref(0)

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const marketData = ref<any>([])
const indexInfoData = ref<any>({
  banners: [],
})
const gridList = ref<any>([
  {
    name: "股票",
    image: grid1
  },
  {
    name: "增发股",
    image: grid2
  },
  {
    name: "基金",
    image: grid3
  },
  {
    name: "IPO",
    image: grid4
  }
])
function handleClickGrid(val: any) {

  if (val === 0) {
    // local.setlocal('rankInfo', marketData.value.list[0])
    // router.push('/quotes/openTrade?id=' + marketData.value.list[0].tradingPairsId + '&categoryId=' + categoryId.value)
    router.push({
      path: '/market',
      // query: {
      //   id: marketData.value.list[0].tradingPairsId,
      //   categoryId: categoryId.value
      // }
    })
  }
  if (val === 1) {
    router.push(`/discount`)
  }
  if (val === 2) {
    router.push({
      path: '/fund',
      // query: {
      //   categoryId: activeName.value == '200' ? "202" : "198",
      // },
    })
  }
  if (val === 3) {
    // router.push('/quotes/accountChange?type=3' + '&categoryId=' + categoryId.value)
    router.push({
      path: '/IPO',
      query: {
        type: 3,
        categoryId: categoryId.value,
      },
    })
  }
}

function getContent(html: string) {
  if (!html)
    return ''
  const reg: RegExp = /<[^>]+>/g
  return html.replace(reg, '')
}
const indexData = ref({})
const chartsDesc = ref([])

const kfUrl = ref('')
async function initKfUrl() {
  const { data, code } = await getKfUrl({
    userId: userInfo.value.userId ? userInfo.value.userId : null,
  })
  if (code == 200) {
    kfUrl.value = data.kfUrl || ''
    setTimeout(() => {
      // window.open(kfUrl.value,'_blank');
      window.location.href = kfUrl.value
    }, 40)
  }
}
function toKfUrl() { }
async function getChartsDesc(type) {
  const { data, code } = await appCharts({ type })
  if (code == 200) {
    chartsDesc.value = data.rows || []
  }
}
function init() {
  indexInfo().then((res) => {
    indexInfoData.value = res.data
    if (res.data.notice) {
      indexInfoData.value.noticeContent = getContent(indexInfoData.value.notice)
      const readedNotice = local.getlocal('readedNotice')
      if (!readedNotice) {
        local.setlocal('readedNotice', '0')
        showDatePicker.value = true
      }
      else {
        if (readedNotice === '0') {
          showDatePicker.value = true
        }
      }
    }
  })
  getMarketInfo({})
  getChartsDesc(1)
  getMarketIndex({
    categoryId: 500,
  })
  // initKfUrl();
}
const page = reactive({
  pageIndex: 1,
  pageSize: 20,
})
const rankListStatus = ref(1) // 1-加载中 2-成功 3-已无更多
const proName = ref('')
function getMarketIndex(params) {
  market({ pageIndex: 1, pageSize: 20, ...params }).then(({ data, code }) => {
    if (code == 200) {
      indexData.value = data.list
    }
  })
}
function getMarketInfo(params) {
  let p = {
    ...page,
  }
  p.pageIndex = params.pageIndex || 1
  rankListStatus.value = 1
  requestCount.value++
  market({ ...p, ...params }).then((res) => {
    const { data, code } = res
    if (code == 200) {
      if (!data.list) {
        rankListStatus.value = 3
        return
      }
      rankListStatus.value = 2
      let result = []
      if (p.pageIndex == 1) {
        result = data.list || []
      }
      else {
        result = marketData.value.list.concat(data.list || [])
      }
      if (requestCount.value == 1) {
        activeName.value = data.category[0].category_id
        categoryId.value = data.category[0].category_id
      }

      marketData.value = {
        ...res.data,
        list: result,
      }
      store.setMarketList(result || [])
      if (data.total <= marketData.value.list.length) {
        rankListStatus.value = 3
      }
    }
    else {
      rankListStatus.value = 4
    }
  })
}
const categoryId = ref()
function handleClickTabs(val: any) {
  rankListStatus.value = 1
  categoryId.value = val
  marketData.value.list = []
  getMarketInfo({
    categoryId: val,
  })
  if (val == 200) {
    getMarketIndex({
      categoryId: 500,
    })
    getChartsDesc(1)
  }
  else if (val == 201) {
    getMarketIndex({
      categoryId: 501,
    })
    getChartsDesc(2)
  }
  else if (val == 202) {
    getMarketIndex({
      categoryId: 502,
    })
  }

  activeName.value = val
}
const showDatePicker = ref<boolean>(false)
function handleClickIndicator(val) {
  local.setlocal('rankInfo', val)
  // router.push('/quotes/detail?id=' + val.tradingPairsId + '&categoryId=' + categoryId.value)
  router.push({
    path: '/quotes/detail',
    query: {
      id: val.tradingPairsId,
      categoryId: categoryId.value,
    },
  })
}
function clickNotice() {
  showDatePicker.value = true
}
function cancelNotice() {
  showDatePicker.value = false
  local.setlocal('readedNotice', '1')
}
function confirmNotice() {
  try {
    local.setlocal('readedNotice', '1')
    if (indexInfoData.value.openUrl) {
      const urlEnum = {
        1: '/fund',
        2: '/discount',
        3: '/IPO',
        4: '/dividend',
      }
      const url = urlEnum[indexInfoData.value.openUrl]
      router.push(url)
    }
    showDatePicker.value = false
  }
  catch (e) {
    console.error(e)
  }
}

function toDetail() {
  const id = marketData.value.list[0].tradingPairsId || 1
  const categoryId = marketData.value.category[0].category_id || 200
  // router.push(`/quotes/detail?id=${id}&categoryId=${categoryId}`)
  router.push({
    path: '/quotes/detail',
    query: {
      id,
      categoryId,
    },
  })
}
showLoadingToast({
  message: '',
  duration: 0,
})
navStore.setShowNavLeft(false)
watch(
  () => navStore.showNavLeft,
  () => {
    if (navStore.showNavLeft) {
      closeToast()
    }
  },
)
onMounted(() => {
  init()
  // closeToast();
  navStore.setShowNavLeft(true)
})
</script>

<template>
  <div class="quotes">
    <header class="header flex items-center justify-between">
      <div class="left flex items-center gap-16px">
        <div class="icon w-24 h-24"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7.40777 0.91344C8.86368 0.310423 10.4242 0 12 0V6C11.212 6 10.4318 6.15518 9.70389 6.45675C8.97593 6.75826 8.31449 7.20021 7.75735 7.75735C7.20021 8.31449 6.75826 8.97593 6.45675 9.70389C6.15518 10.4318 6 11.212 6 12H0C0 10.4242 0.310423 8.86368 0.91344 7.40777C1.51653 5.95186 2.40041 4.62905 3.5147 3.5147C4.62905 2.40041 5.95186 1.51653 7.40777 0.91344Z"
              fill="#6B39F4" />
            <path
              d="M0 12C0 13.5758 0.310423 15.1363 0.91344 16.5922C1.51653 18.0481 2.40041 19.3709 3.5147 20.4853C4.62905 21.5996 5.95186 22.4835 7.40777 23.0866C8.86368 23.6896 10.4242 24 12 24C13.5758 24 15.1363 23.6896 16.5922 23.0866C18.0481 22.4835 19.3709 21.5996 20.4853 20.4853C21.5996 19.3709 22.4835 18.0481 23.0866 16.5922C23.6896 15.1363 24 13.5758 24 12H18C18 12.788 17.8448 13.5682 17.5432 14.2961C17.2417 15.0241 16.7998 15.6855 16.2427 16.2427C15.6855 16.7998 15.0241 17.2417 14.2961 17.5432C13.5682 17.8448 12.788 18 12 18C11.212 18 10.4318 17.8448 9.70389 17.5432C8.97593 17.2417 8.31449 16.7998 7.75735 16.2427C7.20021 15.6855 6.75826 15.0241 6.45675 14.2961C6.15518 13.5682 6 12.788 6 12H0Z"
              fill="#9774F7" />
            <path
              d="M12 8.18176C9.89127 8.18176 8.18182 9.89122 8.18182 11.9999H15.8182C15.8182 9.89122 14.1087 8.18176 12 8.18176Z"
              fill="#9774F7" />
            <path
              d="M12 15.8182C9.89127 15.8182 8.18182 14.1088 8.18182 12.0001H15.8182C15.8182 14.1088 14.1087 15.8182 12 15.8182Z"
              fill="#6B39F4" />
          </svg>
        </div> {{ t("Finline") }}
      </div>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12.02 2.91003C8.71 2.91003 6.02 5.60003 6.02 8.91003V11.8C6.02 12.41 5.76 13.34 5.45 13.86L4.3 15.77C3.59 16.95 4.08 18.26 5.38 18.7C9.69 20.14 14.34 20.14 18.65 18.7C19.86 18.3 20.39 16.87 19.73 15.77L18.58 13.86C18.28 13.34 18.02 12.41 18.02 11.8V8.91003C18.02 5.61003 15.32 2.91003 12.02 2.91003Z"
          stroke="#94A3B8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" />
        <path
          d="M13.87 3.19994C13.56 3.10994 13.24 3.03994 12.91 2.99994C11.95 2.87994 11.03 2.94994 10.17 3.19994C10.46 2.45994 11.18 1.93994 12.02 1.93994C12.86 1.93994 13.58 2.45994 13.87 3.19994Z"
          stroke="#94A3B8" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.89999 21.1801C9.35999 20.6401 9.01999 19.8801 9.01999 19.0601"
          stroke="#94A3B8" stroke-width="1.5" stroke-miterlimit="10" />
      </svg>
    </header>
    <div class="w-full px-24px mt-8">
      <img src="@/assets/bannerCard.jpg" class="w-full" alt="">
    </div>
    <Grid @handleClickGrid="handleClickGrid" />
    <Indicator :activeName="activeName" />

    <div class="kf-fixed fixed bottom-120px right-0 h-auto w-40 overflow-hidden rounded-12px" @click="initKfUrl">
      <img src="@/assets/kf.png" class="block h-full w-full scale-[1.1] bg-white" alt="">
    </div>
    <van-popup v-model:show="showDatePicker" position="center" round="true">
      <div class="h-auto max-h-500 overflow-y-auto p-12">
        <div class="div" v-html="indexInfoData.notice" />
      </div>
      <div class="w-full flex gap-12 px-12 pb-12">
        <div class="btn-box flex-1">
          <van-button type="default" class="h-40!" plain block @click="cancelNotice">
            {{ t("cancel")
            }}
          </van-button>
        </div>
        <div class="btn-box flex-1">
          <van-button type="primary" class="h-40!" block @click="confirmNotice">
            {{ t('confirm') }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<route lang="json5">
{
  name: 'home',
  meta: {
    title: 'quotes',
    i18n: 'menus.home'
  },
}
</route>

<style lang="less" scoped>
.quotes {
  // padding-bottom: calc(var(--van-tabbar-height) + 2px);
}

.iconTop3 {
  width: 9px;
  height: 8px;
}

.header {
  display: flex;
  height: 64px;
  padding: 0 24px;
  align-items: center;
  justify-content: space-between;
  color: var(--van-text);

  .left {
    font-size: 20px;
  }

  .right {
    display: flex;
    align-items: center;

    img {
      width: 22px;
      height: 22px;
    }
  }
}

.kf-fixed {
  z-index: 1002;
}

:deep(.van-tabs__line) {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
  width: 9px;
  height: 8px;
  background-size: 100% 100%;
}
</style>
