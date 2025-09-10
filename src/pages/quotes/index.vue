<script setup lang="ts">
import router from "@/router";
import { useStore } from "@/stores/modules/index";

// import tabItem from "./component/tab-item.vue";
// import Banner from "./component/banner.vue";
// import Notice from "./component/notice.vue";
// import Grid from "./component/grid.vue";
// import Rank from "./component/rank.vue";
// import TopStories from "./component/topStories.vue";
// import StockMarketWidget from "./component/stockMarketWidget.vue";
// import hotmap from "./component/hotmap.vue";

import { indexInfo, depth, market } from "@/api/market";
import local from "@/utils/local";

const { t } = useI18n();
const activeName = ref("");
const store = useStore();
const requestCount = ref(0);
const marketData = ref<any>([]);
const indexInfoData = ref<any>();

const handleClickGrid = (val: any) => {
  if (val == 0) {
    local.setlocal("rankInfo", marketData.value.list[0]);
    router.push(
      "/quotes/openTrade?id=" +
      marketData.value.list[0].tradingPairsId +
      "&categoryId=" +
      categoryId.value
    );
  }
  if (val == 1) {
    router.push("/discount?categoryId=" + categoryId.value);
  }
  if (val == 2) {
    router.push("/fund");
  }
  if (val == 3) {
    router.push(
      "/quotes/accountChange?type=3" + "&categoryId=" + categoryId.value
    );
  }
};

const getContent = (html: string) => {
  let reg = /<[^>]+>/g;
  return html.replace(reg, "");
};
const indexData = ref({});

const init = () => {
  indexInfo().then((res) => {
    indexInfoData.value = res.data;
    indexInfoData.value.noticeContent = getContent(indexInfoData.value.notice);
    console.log(indexInfoData.value);
  });
  getMarketInfo({});
};
const page = reactive({
  pageIndex: 1,
  pageSize: 20,
});
const rankListStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const getMarketIndex = (params) => {
  market({ pageIndex: 1, pageSize: 3, ...params }).then(({ data, code }) => {
    if (code == 200) {
      indexData.value = data.list;
    }
  });
};
const getMarketInfo = (params) => {
  let p = {
    ...page,
  };
  p.pageIndex = params.pageIndex || 1;
  rankListStatus.value = 1;
  requestCount.value++;
  market({ ...p, ...params }).then((res) => {
    const { data, code } = res;
    if (code == 200) {
      if (!data.list) {
        rankListStatus.value = 3;
        return;
      }
      rankListStatus.value = 2;
      let result = [];
      if (p.pageIndex == 1) {
        result = data.list || [];
      } else {
        result = marketData.value.list.concat(data.list || []);
      }
      if (requestCount.value == 1) {
        activeName.value = data.category[0].category_id;
        categoryId.value = data.category[0].category_id;
      }
      marketData.value = {
        ...res.data,
        list: result,
      };
      store.setMarketList(result || []);
      if (data.total <= marketData.value.list.length) {
        rankListStatus.value = 3;
      }
    } else {
      rankListStatus.value = 4;
    }
  });
};
const categoryId = ref();
const handleClickTabs = (val: any) => {
  console.log(val);
  rankListStatus.value = 1;
  categoryId.value = val;
  marketData.value.list = [];
  getMarketInfo({
    categoryId: val,
  });
  if (val == 200) {
    getMarketIndex({
      categoryId: 500,
    });
  } else if (val == 201) {
    getMarketIndex({
      categoryId: 501,
    });
  } else if (val == 202) {
    getMarketIndex({
      categoryId: 502,
    });
  }

  activeName.value = val;
};
const showDatePicker = ref(false);
const handleClickIndicator = (val) => {
  local.setlocal("rankInfo", val);
  router.push(
    "/quotes/detail?id=" +
    val.tradingPairsId +
    "&categoryId=" +
    categoryId.value
  );
};
const clickNotice = () => {
  showDatePicker.value = true;
};
const loadMore = () => {
  if (rankListStatus.value == 4) {
    return;
  }
  let index = (page.pageIndex += 1);
  getMarketInfo({
    pageIndex: index,
  });
};
const toDetail = () => {
  let id = marketData.value.list[0].tradingPairsId || 1;
  let categoryId = marketData.value.category[0].category_id || 200;
  router.push(`/quotes/detail?id=${id}&categoryId=${categoryId}`);
};
onMounted(() => {
  init();
});
</script>

<template>
  <div class="quotes">
    <header class="flex header">
      <div class="left">行情</div>
      <!-- <div class="right">
        <img data-v-8651d213=""
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAIGSURBVHgB7ZjRcYMwDIaVLFBGYINmg9IJmg2abtANwgbtBmGEdgLIBNAJyAakE6jyoesJx0CwRZsHvjtdHGL/kSVHtgOwsPC/rMADRIzpZUv2QLYhi8XHFdmJ7JOsWK1WJ/gryLGELMdpHHhCszoWkb1hGHvwYDTFPPscumk0nMk+yI7cPvNzk3KT+oQsssaY9D9S2s+ggXGOrLYiYd7vTFRHxkbczx5fjo0NcS6bKs46uaWTQyjYLm5JCgHw5CSv4Au2v1bJARSwItl4p9oSqlFjzcBvupugrLCIZAeKGKdkFGEqZm3I6IEy2P66JclQ/7Xj2ZNoF6AM18BCPNoO9Xc5KNfbF8yD1L0b6uhycCPaFcyD1I2HOq7hxnE5KPdJlfLi4GrdMQdjmIdYtL+HOrocPIr2PcyD1C1gClYd9N+O+vXjKXXQJWAX0hQUwe4hxG8jwO7Jw0QxBgXUtlGHUPD5jTNTB0dPCKaWk95HLnauVImeJZxbouXUdKP7ZF6CBj0zN2tyP+Yoj91jP1dl5JpbnSkzRsx16iig3Vfl5m9qnNnPE0f/Crp7fUanmxfQgNdkg37UyPUOL+8mB9Sqtdiupwwv11QfDU8ssnRsJ3uvol7/zfCXJNCm0aRUip+gTXlF6SsGxmf08iwe6V7qNXBEMvy+rI3tJNwi5Nc7+5fCwsKN8QOkZM+cXDSOjQAAAABJRU5ErkJggg=="
          alt="search" class="w-12 h-12">
      </div> -->
    </header>
    <van-tabs v-model:active="activeName" shrink @change="handleClickTabs">
      <van-tab class="flex flex-col gap-12 pt-12" :title="item.name" :name="item.category_id"
        v-for="item in marketData.category" :key="item.category_id">
        <Banner :banner="indexInfoData.banners" />
        <tabItem :categoryId="item.category_id" :item="indexData"> </tabItem>
        <div class="top relative">
          <div class="z-index-999 absolute top-0 left-0 w-full h-full" @click="toDetail"></div>
          <TopStories v-if="item.category_id == 200" />
        </div>
        <!-- <Indicator :list="marketData.list" v-if="item.category_id == 200" @handle-click="handleClickIndicator" /> -->
        <!-- 金刚区 -->
        <Grid @handleClickGrid="handleClickGrid" :categoryId="item.category_id" />
        <!-- 公告 -->
        <Notice @clickNotice="clickNotice" :data="indexInfoData" />
        <!-- 排行 -->
        <Rank :rankList="marketData.list" :categoryId="item.category_id" @loadMore="loadMore"
          :rankListStatus="rankListStatus" />

        <hotmap></hotmap>
      </van-tab>
    </van-tabs>
    <van-popup v-model:show="showDatePicker" position="bottom">
      <div class="h-auto max-h-500 overflow-y-auto p-12">
        <div class="div" v-html="indexInfoData.notice"></div>
      </div>
    </van-popup>
  </div>
</template>



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

:deep(.van-tabs__line) {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC) no-repeat center;
  width: 9px;
  height: 8px;
  background-size: 100% 100%;
}
</style>
