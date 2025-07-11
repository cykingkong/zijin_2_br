<script setup lang="ts">
import router from '@/router'
import { useStore } from '@/stores/modules/index'

import tabItem from './quotes/component/tab-item.vue'
import Banner from './quotes/component/banner.vue'
import Notice from './quotes/component/notice.vue'
import Grid from './quotes/component/grid.vue'

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
function handleClickGrid(val: any) {

  if (val === 0) {
    // local.setlocal('rankInfo', marketData.value.list[0])
    // router.push('/quotes/openTrade?id=' + marketData.value.list[0].tradingPairsId + '&categoryId=' + categoryId.value)
    router.push({
      path: '/quotes/rankList',
      // query: {
      //   id: marketData.value.list[0].tradingPairsId,
      //   categoryId: categoryId.value
      // }
    })
  }
  if (val === 1) {
    router.push(`/discount?categoryId=${categoryId.value}`)
  }
  if (val === 2) {
    router.push({
      path: '/fund',
      query: {
        categoryId: activeName.value == '200' ? "202" : "198",
      },
    })
  }
  if (val === 3) {
    // router.push('/quotes/accountChange?type=3' + '&categoryId=' + categoryId.value)
    router.push({
      path: '/quotes/accountChange',
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
    <header class="header flex">
      <div class="left">
        {{ t("menus.quotes") }}
      </div>
    </header>
    <van-tabs v-model:active="activeName" shrink @change="handleClickTabs">
      <van-tab v-for="item in marketData.category" :key="item.category_id" class="flex flex-col gap-12 pt-12"
        :title="item.name" :name="item.category_id">
        <Banner :banner="indexInfoData.banners" />
        <tabItem :category-id="item.category_id" :item="indexData" />
        <div class="top relative">
          <div class="z-index-999 absolute left-0 top-0 h-full w-full" @click="toDetail" />
          <TopStories :charts-desc="chartsDesc" :category_id="item.category_id" />
        </div>
        <!-- <Indicator :list="marketData.list" v-if="item.category_id == 200" @handle-click="handleClickIndicator" /> -->
        <!-- 金刚区 -->
        <Grid :category-id="Number(item.category_id)" @handle-click-grid="handleClickGrid" />
        <!-- 公告 -->
        <Notice v-if="indexInfoData.notice" :data="indexInfoData" @click-notice="clickNotice" />
        <!-- 排行 -->
        <!-- <Rank :rankList="marketData.list" :categoryId="item.category_id" @loadMore="loadMore"
          :rankListStatus="rankListStatus" /> -->

        <div class="top relative">
          <div class="z-index-999 absolute left-0 top-0 h-full w-full" @click="toDetail" />
          <hotmap :category_id="item.category_id" />
        </div>
        <StockMarketWidget :charts-desc="chartsDesc" :category_id="item.category_id" class="mt-12" />
      </van-tab>
    </van-tabs>
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
  height: var(--van-nav-bar-height);
  padding: 0 12px;
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
