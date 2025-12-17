<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "@/router";
import { productList, userProductList } from "@/api/product";

const activeName = ref(0);
const searchMarkShow = ref(false);
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const { t } = useI18n();
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const stockSkeleton = ref(false);
const stockList = ref<any>([]);
const tabList = ref([]);
const userProductArr = ref([])
const categoryId = ref();
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
    classId: tabList.value[activeName.value]?.id || null,
    ...page,
  });
  if (code == 200) {
    console.log(stockSkeleton.value);
    tabList.value = data.classList.map((e) => {
      return {
        name: e.class_name,
        id: e.class_id,
      }
    }) || []
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
const tabChange = (item: any) => {
  console.log(item, activeName.value)

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
  // getUserProArr()
});
</script>

<template>
  <div class="market relative overflow-hidden pb-[20px] bg-white min-h-screen">
    <!-- Top Tabs -->
    <div class="sticky top-0 z-50 bg-white">
      <van-tabs v-model:active="activeName" @click-tab="tabChange" line-width="180px" color="#333"
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
            <svg class="w-16 h-16" v-if="item.onlyNewUser" viewBox="0 0 16 16" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M4.66667 6.33333V9.66666L2 6.33333V6.33599V9.66666" stroke="#1B1B1B" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M6.66663 8.00001H8.66663" stroke="#1B1B1B" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M8.99996 6.336H6.66663V9.66667H8.99996" stroke="#1B1B1B" stroke-linecap="round"
                stroke-linejoin="round" />
              <path d="M10.6666 6.33333L11 9.66666H11.1426L12.3333 7.66666L13.524 9.66666H13.6666L14 6.33333"
                stroke="#1B1B1B" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M12.7413 4.33333C12.588 4.134 12.4253 3.94 12.2427 3.75733C9.89933 1.414 6.10067 1.414 3.75733 3.75733C3.57467 3.94 3.41267 4.134 3.25867 4.33333"
                stroke="#1B1B1B" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M3.25867 11.6667C3.412 11.866 3.57467 12.06 3.75733 12.2427C6.10067 14.586 9.89933 14.586 12.2427 12.2427C12.4253 12.06 12.5873 11.866 12.7413 11.6667"
                stroke="#1B1B1B" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <van-icon name="like-o" size="18" color="#333" v-else />


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
            {{ item.productName || 'Product Name' }}
          </div>
          <div class="bottom text-12 my-6">
            <div class="li flex justify-between">
              <div class="label text-[#666]">{{ $t('Cycle') }}</div>
              <div class="value text-amber">{{ `${item.incomeCycle} ${$t('Days')}` || '- ' + $t('Days') }}</div>
            </div>
            <div class="li flex justify-between">
              <div class="label text-[#666]">{{ $t('Daily') }}</div>
              <div class="value text-amber">₹ {{ item.dailyIncome }}</div>
            </div>
            <div class="li flex justify-between">
              <div class="label text-[#666]">{{ $t('Total') }}</div>
              <div class="value text-amber">₹ {{ item.totalIncome }}</div>
            </div>

          </div>
          <div class="price text-[16px] font-bold text-[#FF6B00]">
            ₹ {{ item.discountRate || '0.00' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <empty v-if="stockList && stockList.length == 0" :no-tips="true"></empty>
    <LoadMore :status="listStatus" @load-more="loadMore" />

  </div>
</template>

<route lang="json5">
{
  name: 'Market',
  meta: {
    title: 'Market',
    i18n: 'Product Center'
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
  // bottom: 6px;
  height: 1px;

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