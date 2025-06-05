<script setup lang="ts">

import { useUserStore } from '@/stores'
import { useI18n } from 'vue-i18n';


import UserInfo from '@/components/user-info.vue'
import Quickly from './components/quickly.vue';
import Indicator from './components/indicator.vue';
import grid1 from '@/assets/grid/grid5-quotes.png';
import grid2 from '@/assets/grid/grid6-quotes.png';
import grid3 from '@/assets/grid/grid4-quotes.png';
import grid4 from '@/assets/grid/grid8-quotes.png';
const { t } = useI18n()

const userStore = useUserStore()
const activeName = ref('1')
const router = useRouter()
const gridList = [
  {
    icon: grid1,
    text: t('deal.fund')
  },
  {
    icon: grid2,
    text: t('deal.discount')
  },
  {
    icon: grid3,
    text: t('deal.IPO')
  },
  {
    icon: grid4,
    text: t('deal.dividend')
  }
]
// watch(() => isLogin(), (val) => {
//   console.log(val, 'isLogin')
//   if (!val) {
//     router.push({ path: '/login' })
//   }
// }, {
//   immediate: true
// })
const handleClickTab = (index: any) => {
  switch (index) {
    case 0:
      router.push({ path: '/fund' })
      break;
    case 1:
      router.push({
        path: '/discount',
        query: {
          categoryId: activeName.value == '1' ? '200' : '201'
        }
      })
      break;
    case 2:
      router.push({ path: '/ipo' })
      break;
    case 3:
      router.push({
        path: '/dividend',
        query: {
          categoryId: activeName.value == '1' ? '200' : '201'
        }
      })
      break;
  }
}

onMounted(async () => {
  await userStore.info()

})
</script>

<template>
  <div class="deal-index">
    <VanNavBar title="" clickable placeholder :left-arrow="false">
      <template #left>
        {{ t('menus.deal') }}
      </template>
    </VanNavBar>
    <section class="deal flex flex-col">
      <van-tabs v-model:active="activeName">
        <van-tab :title="t('deal.AmericanStocks')" :name="'1'">
        </van-tab>
        <van-tab :title="t('deal.BrazilianStocks')" :name="'2'">
        </van-tab>
      </van-tabs>
      <div class="tab-content flex flex-col">
        <UserInfo :show-asset="true" :activeName="activeName" />
        <van-grid :border="false" column-num="4">
          <van-grid-item v-for="(i, k) in gridList" :key="k" @click="handleClickTab(k)">
            <div class="flex flex-col items-center">
              <img :src="i.icon" class="w-48 h-48" />
              <span class="text-12 mt-8 text-align-center h-32px">{{ i.text }}</span>
            </div>
          </van-grid-item>
        </van-grid>
        <Quickly />
        <Indicator :activeName="activeName" />
      </div>
    </section>
  </div>
</template>

<route lang="json5">
{
  name: 'deal',
  meta: {
    title: 'deal',
    i18n: 'menus.deal'
  },
}
</route>

<style lang="less" scoped>
.icon {
  color: var(--van-text-color);
}

.deal-index {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.time {
  color: #747a8f;
}

p {
  color: var(--van-text-color);

  margin: 0;
}

.tab-content {
  padding-top: 12px;
}

.content {
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--van-gary-1);
  }
}

:deep(.van-grid-item__content) {
  // background: #131a2e;
}
</style>
