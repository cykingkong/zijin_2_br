<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import tabItem from './component/tab-item.vue'
import Banner from './component/banner.vue'
import Notice from './component/notice.vue'
import Grid from './component/grid.vue'
import Rank from './component/rank.vue'
import iconTop3 from '../../assets/image/icon_top3.png'
const { t } = useI18n()
const activeName = ref('a')
</script>

<template>
  <div class="quotes">
    <header class="flex header">
        <div class="left">行情</div>
        <div class="right" >
            <img data-v-8651d213="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIGSURBVHgB7ZjRcYMwDIaVLFBGYINmg9IJmg2abtANwgbtBmGEdgLIBNAJyAakE6jyoesJx0CwRZsHvjtdHGL/kSVHtgOwsPC/rMADRIzpZUv2QLYhi8XHFdmJ7JOsWK1WJ/gryLGELMdpHHhCszoWkb1hGHvwYDTFPPscumk0nMk+yI7cPvNzk3KT+oQsssaY9D9S2s+ggXGOrLYiYd7vTFRHxkbczx5fjo0NcS6bKs46uaWTQyjYLm5JCgHw5CSv4Au2v1bJARSwItl4p9oSqlFjzcBvupugrLCIZAeKGKdkFGEqZm3I6IEy2P66JclQ/7Xj2ZNoF6AM18BCPNoO9Xc5KNfbF8yD1L0b6uhycCPaFcyD1I2HOq7hxnE5KPdJlfLi4GrdMQdjmIdYtL+HOrocPIr2PcyD1C1gClYd9N+O+vXjKXXQJWAX0hQUwe4hxG8jwO7Jw0QxBgXUtlGHUPD5jTNTB0dPCKaWk95HLnauVImeJZxbouXUdKP7ZF6CBj0zN2tyP+Yoj91jP1dl5JpbnSkzRsx16iig3Vfl5m9qnNnPE0f/Crp7fUanmxfQgNdkg37UyPUOL+8mB9Sqtdiupwwv11QfDU8ssnRsJ3uvol7/zfCXJNCm0aRUip+gTXlF6SsGxmf08iwe6V7qNXBEMvy+rI3tJNwi5Nc7+5fCwsKN8QOkZM+cXDSOjQAAAABJRU5ErkJggg==" alt="search" class="w-12 h-12">
        </div>
    </header>
    <van-tabs v-model:active="activeName" shrink>
       
      <van-tab title="印尼股票" name="a">
     
        <tabItem>
          <Banner />

          <!-- 公告 -->
          <Notice />
          <!-- 金刚区 -->
          <Grid />
          <!-- 排行 -->
          <Rank />
        </tabItem>
      </van-tab>
      <van-tab title="美股" name="b">
        <!-- <tabItem /> -->
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
.iconTop3{
    width: 9px;
    height: 8px;
}
.header{
    display: flex;
    height: 34px;
    padding: 0 12px;
    align-items: center;
    justify-content: space-between;
    color:var(--van-text);
    .left{
        font-size: 20px;
    }
    .right{
        display: flex;
        align-items: center;
        img{
            width: 22px;
            height: 22px;
        }
    }
}
:deep(.van-tabs__line){
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
    width: 9px;
    height: 8px;
    background-size: 100% 100%;
}
</style>
