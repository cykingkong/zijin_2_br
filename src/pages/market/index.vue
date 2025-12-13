<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "@/router";
import { productList, userProductList } from "@/api/product";

const activeName = ref(0);
const searchMarkShow = ref(false);
const page = reactive({
  pageIndex: 1,
  pageSize: 5,
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
const userProductArr = ref([])
const categoryId = ref("200");
const getUserProArr = async () => {
  try {
    const res = await userProductList({
      page: 1,
      pageSize: 10,
    })
  } catch (error) {
    console.log(error);

  }
}
const getProductList = async () => {
  if (page.pageIndex == 1) {
    stockSkeleton.value = true;
  }
  const { data, code } = await productList({
    type: categoryId.value,
    ...page,
  });
  if (code == 200) {
    console.log(stockSkeleton.value);

    if (!data.rows) {
      listStatus.value = 3;
      stockSkeleton.value = false;
      return;
    }
    if (page.pageIndex == 1) {
      stockList.value = data.rows || [];
    } else {
      let result = data.rows || [];
      stockList.value = stockList.value.concat(result);
    }
    stockSkeleton.value = false;

    // 根据新的分页格式判断是否还有更多数据
    if (stockList.value.length >= data.total) {
      listStatus.value = 3;
      return;
    }
    listStatus.value = 2;
    stockSkeleton.value = false;

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
  page.pageIndex = 1;
  stockList.value = [];
  listStatus.value = 1;
  getProductList();
};
const handleClickStock = (item: any) => {
  router.push(`/market/productDetail?productId=${item.productId}`);
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
  page.pageIndex++;
  getProductList();
};

onMounted(() => {
  getProductList();
  getUserProArr()
});
</script>

<template>
  <div class="market relative overflow-hidden pb-[20px] bg-white min-h-screen">
    <!-- Top Tabs -->
    <div class="sticky top-0 z-50 bg-white">
      <van-tabs v-model:active="activeName" @click-tab="tabChange" line-width="20px" color="#333"
        title-active-color="#333" title-inactive-color="#999" class="custom-tabs">
        <van-tab v-for="(item, index) in tabList" :title="item.name" :key="item.id">
        </van-tab>
      </van-tabs>
    </div>

    <!-- Product Grid -->
    <div v-if="stockSkeleton" class="product-list grid grid-cols-2 gap-x-[15px] gap-y-[24px] px-[16px] mt-[20px]">
      <!-- 骨架屏占位符 -->
      <div v-for="n in 6" :key="n" class="product-item skeleton-animation">
        <!-- Image Box -->
        <div
          class="img-box relative w-full aspect-square bg-[#F5F5F5] rounded-[20px] mb-[12px] flex items-center justify-center overflow-hidden">
          <!-- 图片骨架 -->
          <div class="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200"></div>
        </div>

        <!-- Info -->
        <div class="info">
          <div class="title bg-gray-200 rounded h-[20px] mb-[8px] w-3/4"></div>
          <div class="price bg-gray-200 rounded h-[18px] w-1/2"></div>
        </div>
      </div>
    </div>

    <div v-else class="product-list grid grid-cols-2 gap-x-[15px] gap-y-[24px] px-[16px] mt-[20px]">
      <div v-for="(item, index) in stockList" :key="index" class="product-item" @click="handleClickStock(item)">
        <!-- Image Box -->
        <div
          class="img-box relative w-full aspect-square bg-[#F5F5F5] rounded-[20px] mb-[12px] flex items-center justify-center overflow-hidden">
          <!-- Like Icon -->
          <div
            class="absolute top-[12px] right-[12px] w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow-sm z-10">
            <van-icon name="like-o" size="18" color="#333" />
          </div>

          <!-- Product Image -->
          <img v-if="item.productImage" :src="item.productImage" class="w-full h-full object-cover" />
          <div v-else class="text-[#ccc] text-4xl">
            <!-- Placeholder if no image -->
            <van-icon name="photo-o" />
          </div>
        </div>

        <!-- Info -->
        <div class="info">
          <div class="title text-[15px] font-bold text-[#1A1A1A] leading-[1.3] mb-[6px] line-clamp-2">
            {{ item.symbol || 'Product Name' }}
          </div>
          <div class="price text-[16px] font-bold text-[#FF6B00]">
            {{ item.lastPrice || '$0.00' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <empty v-if="stockList && stockList.length == 0"></empty>
    <LoadMore :status="listStatus" @load-more="loadMore" />

  </div>
</template>

<route lang="json5">
{
  name: 'Market',
  meta: {
    title: 'Market',
    i18n: 'Market'
  },
}
</route>

<style lang="less" scoped>
.quotes {
  padding-bottom: calc(var(--van-tabbar-height) + 2px);
}

:deep(.van-tabs__wrap) {
  height: 44px;
}

:deep(.van-tab) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.van-tabs__line) {
  background: #333;
  bottom: 6px;
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