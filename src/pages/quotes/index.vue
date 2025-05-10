<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores'
import { useStore } from '@/stores/modules/index';

import defaultAvatar from '@/assets/images/default-avatar.svg'
import tabItem from './component/tab-item.vue'
import Banner from './component/banner.vue'
import Notice from './component/notice.vue'
import Grid from './component/grid.vue'
import Rank from './component/rank.vue'
import ChatItem from './component/chat-item.vue'
import Kline from '@/components/Kline.vue'
import klineChat from '@/components/klineChat.vue'
import { indexInfo, depth, market } from '@/api/market'
import Indicator from './component/indicator.vue'
const { t } = useI18n()
const activeName = ref()
const store = useStore();

const marketData = ref<any>([])
const indexInfoData = ref({})
const i = {
  price: [2.99, 32.99, 33, 32.95, 32.9, 33, 132.95, 322.9, 333, 322.95, 325.9, 363, 832.95, 326.9, 343, 362.95, 352.9],
  increase: -2,
}
const handleClickGrid = (val: any) => {
  console.log(val)
  if (val == 0) {
    router.push('/quotes/openTrade')
  }
  if (val == 1) {
    router.push('/quotes/accountChange')

  }
  if (val == 5) {

    router.push('/quotes/commodities')

  }
}
const init = () => {
  indexInfo().then(res => {
    console.log(res)
    indexInfoData.value = res.data
  })
  market({ pageIndex: 1, pageSize: 20 }).then(res => {
    console.log(res)
    marketData.value = res.data || []
    store.setMarketList(res.data.list || [])
    activeName.value = res.data.category[0].category_id
  })
}
const handleClickTabs = (val: any) => {
  market({ categoryId: val, pageIndex: 1, pageSize: 20 }).then(res => {
    console.log(res)
    marketData.value = res.data || []
  })
}
onMounted(() => {
  init()
})
</script>

<template>
  <div class="quotes">
    <header class="flex header">
      <div class="left">行情</div>
      <div class="right">
        <img data-v-8651d213=""
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIGSURBVHgB7ZjRcYMwDIaVLFBGYINmg9IJmg2abtANwgbtBmGEdgLIBNAJyAakE6jyoesJx0CwRZsHvjtdHGL/kSVHtgOwsPC/rMADRIzpZUv2QLYhi8XHFdmJ7JOsWK1WJ/gryLGELMdpHHhCszoWkb1hGHvwYDTFPPscumk0nMk+yI7cPvNzk3KT+oQsssaY9D9S2s+ggXGOrLYiYd7vTFRHxkbczx5fjo0NcS6bKs46uaWTQyjYLm5JCgHw5CSv4Au2v1bJARSwItl4p9oSqlFjzcBvupugrLCIZAeKGKdkFGEqZm3I6IEy2P66JclQ/7Xj2ZNoF6AM18BCPNoO9Xc5KNfbF8yD1L0b6uhycCPaFcyD1I2HOq7hxnE5KPdJlfLi4GrdMQdjmIdYtL+HOrocPIr2PcyD1C1gClYd9N+O+vXjKXXQJWAX0hQUwe4hxG8jwO7Jw0QxBgXUtlGHUPD5jTNTB0dPCKaWk95HLnauVImeJZxbouXUdKP7ZF6CBj0zN2tyP+Yoj91jP1dl5JpbnSkzRsx16iig3Vfl5m9qnNnPE0f/Crp7fUanmxfQgNdkg37UyPUOL+8mB9Sqtdiupwwv11QfDU8ssnRsJ3uvol7/zfCXJNCm0aRUip+gTXlF6SsGxmf08iwe6V7qNXBEMvy+rI3tJNwi5Nc7+5fCwsKN8QOkZM+cXDSOjQAAAABJRU5ErkJggg=="
          alt="search" class="w-12 h-12">
      </div>
    </header>
    <van-tabs v-model:active="activeName" shrink @change="handleClickTabs">

      <van-tab class="flex flex-col gap-12 pt-12" :title="item.name" :name="item.category_id"
        v-for="item in marketData.category" :key="item.category_id">
        <Banner :banner="indexInfoData.banner" />
        <tabItem v-if="item.category_id == 201">
        </tabItem>
        <Indicator :list="marketData.list" v-if="item.category_id == 200" />
        <!-- 金刚区 -->
        <Grid @handleClickGrid="handleClickGrid" :categoryId="item.category_id" />
        <!-- 公告 -->
        <Notice />
        <!-- 排行 -->
        <Rank :rankList="marketData.list" />
      </van-tab>
      <van-tab title="美股" name="b" v-if="false">
        <div class="flex-col flex gap-12">
          <Banner />
          <!-- 公告 -->
          <Notice />
          <ChatItem>
            <Kline class="m-auto" :nameId="'myChart20' + 1" :areaStyle="true" :increase="i.increase" :data="i.price"
              height="160px">
            </Kline>
          </ChatItem>
          <ChatItem :title="'资金净流入'">
            <Kline class="m-auto" :nameId="'myChart30' + 1" :areaStyle="false" :increase="i.increase" :data="i.price"
              height="160px">
            </Kline>
          </ChatItem>
          <ChatItem :title="'知名美股'">

          </ChatItem>
          <ChatItem :title="'知名美股'">
            <klineChat />
          </ChatItem>
        </div>

      </van-tab>
    </van-tabs>
  </div>
</template>

<route lang="json5">
    {
      name: 'quotes',
      meta: {
        title: 'quotes',
        i18n: 'menus.quotes'
      },
    }
</route>

<style lang="less" scoped>
.quotes {
  padding-bottom: calc(var(--van-tabbar-height) + 2px);
}

.iconTop3 {
  width: 9px;
  height: 8px;
}

.header {
  display: flex;
  height: 34px;
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

:deep(.van-tabs__line) {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
  width: 9px;
  height: 8px;
  background-size: 100% 100%;
}
</style>
