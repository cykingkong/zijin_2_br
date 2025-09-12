<script setup lang="ts">
import router from "@/router";
import Grid from "@/components/grid.vue";
import usStockIndexDetail from "../quotes/usStockIndexDetail.vue";
import { assetsList } from "@/api/stock";
import miniChartList from "@/components/miniChartList.vue";

const activeName = ref(0);
const searchMarkShow = ref(false);
const page = reactive({
  page: 1,
  size: 5,
});
const { t } = useI18n();
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const stockSkeleton = ref(false);
const stockList = ref<any>([]);
const tabList = ref([
  {
    name: t("US Stock"),
    id: "500",
  },
  {
    name: t("Mexico Stock"),
    id: "501",
  },
]);
const categoryId = ref("200");
const getStockList = async () => {
  if (page.page == 1) {
    stockSkeleton.value = true;
  }
  const { data, code } = await assetsList({
    type: categoryId.value,
    ...page,
  });
  if (code == 200) {
    console.log(stockSkeleton.value);
    if (stockSkeleton.value) {
      setTimeout(() => {
        stockSkeleton.value = false;
      }, 3000); // 修改为3秒
    }
    if (!data.list) {
      listStatus.value = 3;

      return;
    }
    if (page.page == 1) {
      stockList.value = data.list || [];
    } else {
      let result = data.list || [];
      stockList.value = stockList.value.concat(result);
    }

    // 根据新的分页格式判断是否还有更多数据
    if (!data.pagination.has_more) {
      listStatus.value = 3;
      return;
    }
    listStatus.value = 2;
  }
};
const tabChange = (index: number) => {
  activeName.value = index;
  if (index == 0) {
    categoryId.value = "200";
  } else {
    categoryId.value = "201";
  }
  // 重置分页和状态
  page.page = 1;
  stockList.value = [];
  listStatus.value = 1;
  getStockList();
};
const handleClickStock = (item: any) => {
  router.push(`/quotes/detail?symbol=${item.symbol}`);
};
function toSearch() {
  router.push("/market/search");
}

function handleClickGrid(val: any) {
  if (val === 0) {
  }
  if (val === 1) {
    router.push(`/discount`);
  }
  if (val === 2) {
    router.push({
      path: "/fund",
      // query: {
      //   categoryId: activeName.value == '200' ? "202" : "198",
      // },
    });
  }
  if (val === 3) {
    // router.push('/quotes/accountChange?type=3' + '&categoryId=' + categoryId.value)
    router.push({
      path: "/IPO",
      // query: {
      //     type: 3,
      //     categoryId: categoryId.value,
      // },
    });
  }
}
const loadMore = () => {
  page.page++;
  getStockList();
};
// watch(
//     () => store.getklineList,
//     (newV) => {
//         if (
//             newV &&
//             stockList.value &&
//             stockList.value.length
//         ) {
//             stockList.value.forEach((el) => {
//                 let listItem = newV.find((item: any) => {
//                     return item.tradingId == el.tradingPairsId;
//                 });
//                 if (listItem) {
//                     if (listItem.tradingId == el.tradingPairsId) {
//                         el.lastPrice = listItem.tick.close;
//                         el.dayIncrease = listItem.tick.dayIncrease;
//                         el.increase = listItem.tick.increase;
//                     }
//                 }
//             });
//         }
//     }
// );
onMounted(() => {
  getStockList();
});
</script>

<template>
  <div class="market relative overflow-hidden pb-20px">
    <Grid @handleClickGrid="handleClickGrid" class="mt-32px" />
    <div class="px-24px">
      <div class="tab-list flex items-center mt-32px gap-7px mb-31px">
        <div
          class="tab-item flex-1 items-center justify-center flex text-14px text-#94A3B8 bg-#F8F9FD py-4px"
          v-for="(item, index) in tabList"
          :key="index"
          @click="tabChange(index)"
          :class="{ 'bg-#F8F5FF color-#6B39F4! font-700': activeName == index }"
        >
          {{ item.name }}
        </div>
      </div>
      <div
        class="search w-full rounded-12px bg-#F8F9FD flex py-9 px-16 flex items-center gap-12px mb-16"
        @click="toSearch"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="9.80549"
            cy="9.80541"
            r="7.49047"
            stroke="#94A3B8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M15.0153 15.4043L17.9519 18.3334"
            stroke="#94A3B8"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="p text-16px text-#94A3B8">{{ t("Search") }}...</div>
      </div>
      <!-- <CardList class="mb-23px" :list="marketData"></CardList> -->

      <div class="list mb-16">
        <div class="label text-16px text-#0F172A font-700 mb-16px">
          {{ t("All Stocks") }}
        </div>
        <div class="list-content min-h-600 relative">
          <div
            class="skeleton-list bg-#fff z-99 w-full h-full absolute top-0 left-0"
            v-if="stockSkeleton"
          >
            <div
              class="list-skeleton bg-coolgray skeleton-animation w-full h-130 rounded-12px mb-16px"
              v-for="i in 5"
              :key="i"
            ></div>
          </div>

          <miniChartList
            :stockList="stockList"
            @itemClick="handleClickStock"
            itemClass="stock-item relative"
          />
          <empty
            v-if="!stockSkeleton && stockList.length == 0"
            :no-tips="true"
          />
          <LoadMore
            v-if="!stockSkeleton"
            :status="listStatus"
            @load-more="loadMore"
          ></LoadMore>
        </div>
      </div>
      <usStockIndexDetail></usStockIndexDetail>
    </div>
    <div
      class="search-mark w-full h-100vh min-h-100vh bg-#fff absolute transition-all transition-delay-1300 top-[-1000] left-0 z-1000"
      v-if="searchMarkShow"
      :class="{ 'top-0': searchMarkShow }"
      @click="searchMarkShow = false"
    ></div>
  </div>
</template>

<route lang="json5">
{
  name: 'Market',
  meta: {
    title: 'Market',
    i18n: 'menus.Market'
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
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAOCAYAAAAmL5yKAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAADxSURBVHgBnVHLDYJAEJ1ZjJ+LoQTsQDtA48GjJXj1YNQKKIGDIR4pQY8eTLQD7EBKIIZIBGEEiQSR5eNLNrs7efP27RsEDiZbR3J9OEXnrtce7Ndo5fEYT8D1cRluUrTslqPweFjw+jVdawrQO8w7ZiUHbkBqtub5oOdxfwRGmjMDwmm2TgDyeOPIpQIhk/vfAEGfqiRyBUbaI2qWgA/p1riv0oUkxHdwTzIAUYRCoNUUaPAJNHHgBaH10uYIJHoBql8OZM3uMxIMqAFGMDwuOmcWX4Qd1ARhHDbGY8ufcQWZNSsaWzmYwsIQTPgTCHR5AaMKT03qmstiAAAAAElFTkSuQmCC)
    no-repeat center;
  width: 9px;
  height: 8px;
  background-size: 100% 100%;
}

.skeleton-animation {
  animation: pulseskeleton 1s ease-in infinite;
}

@keyframes pulseskeleton {
  0% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.7;
  }
}
</style>
