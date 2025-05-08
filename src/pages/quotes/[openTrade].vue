<template>
  <div class="openTrade-content">
    <VanNavBar title="123" :fixed="true" clickable placeholder :left-arrow="true">

      <template #title>
        <div class="flex flex-items-center gap-6"><van-icon name="exchange" @click="handleClickExchange" />LEAD</div>

      </template>
    </VanNavBar>
    <van-tabs v-model:active="activeName">
      <van-tab title="买入" :name="0">
        <tab1Page />
      </van-tab>
      <van-tab title="卖出" :name="1">
        <tab1Page :saleIn="false" />
      </van-tab>
      <van-tab title="撤单" :name="2">
        <TabTablePage :table-th="['委托时间', '委託/成交價', '委托数量', '状态']" :table-data="[]"></TabTablePage>
      </van-tab>
      <van-tab title="持仓" :name="3">
        <TabTablePage :table-th="['市值', '总盈亏', '持仓/可用', '成本/现价', '当日盈亏']" :table-data="[]" :td-type="2"></TabTablePage>

      </van-tab>
      <van-tab title="查询" :name="4">
        <SearchPage></SearchPage>
      </van-tab>
    </van-tabs>



    <!-- Popup -->
    <van-popup v-model:show="showLeft" position="left" :style="{ width: '80%', height: '100%' }">
      <div class="pop-content flex-col flex">
        <div class="pop-th flex-justify-between flex font-size-14 text-coolGray  my-12 px-12">
          <div class="th-item">名称</div>
          <div class="th-item text-align-right">最新价格/24H涨跌</div>
        </div>
        <div class="td flex-justify-between flex font-size-12  py-12 px-12" v-for="i in 100">
          <div class="th-item">LDSE</div>
          <div class="th-item text-align-right">
            <div class="t">0.33323123</div>
            <div class="up">-0.1</div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<route lang="json5">
    {
      name: 'openTrade',
      meta: {
        title: 'openTrade',
        i18n: 'menus.openTrade'
      },
    }
</route>
<script setup>
const activeName = ref('a')
import tab1Page from './component/openTradeCom/tab-page.vue';
import TabTablePage from './component/openTradeCom/tab-table-page.vue';
import SearchPage from './component/openTradeCom/search-page.vue';
const showLeft = ref(false)
const handleClickExchange = () => {
  showLeft.value = !showLeft.value
}
</script>