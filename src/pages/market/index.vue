<script setup lang="ts">
import { useI18n } from "vue-i18n";
import router from "@/router";
import { productList, userProductList } from "@/api/product";
import { addCommasToNumber } from "@/utils/tool";

const activeName = ref(0);
const searchMarkShow = ref(false);
const enumBtnText = {
  0: 'Sold out',
  1: 'Activate',
  2: 'Sold out',
  3: 'Pre-sale'
}

const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const { t } = useI18n();
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const stockSkeleton = ref(false);
const stockList = ref<any>([]);
const tabList = ref([]);
const search = ref("")
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
    productName: search.value || null
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
  page.pageIndex = 1;
  getProductList();
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
  <div class="market relative overflow-hidden pb-[20px] bg-[#f7f7f7] min-h-screen pt-[20px]">
    <div class=" phone-input my-16 mx-16 flex items-center px-20">
      <svg class="w-20 h-20 flex-shrink-0" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_6869_628)">
          <path
            d="M13.5817 13.5817C11.0814 16.0821 7.02753 16.0821 4.5272 13.5817C2.02687 11.0814 2.02687 7.02757 4.5272 4.52724C7.02753 2.02692 11.0814 2.02692 13.5817 4.52724C16.082 7.02757 16.082 11.0814 13.5817 13.5817ZM13.5817 13.5817L16.4112 16.4113"
            stroke="#8C91A2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_6869_628">
            <rect width="20" height="20" fill="white" />
          </clipPath>
        </defs>
      </svg>
      <inputCom :placeholder="t('Search')" v-model:value="search" :tips="''" :input-type="'search'"
        class="flex-1 w-full">
        <template #sendCode>
          <div class="absolute right--20 font-size-12 h-28 flex justify-center items-center sendCode text-[#1b1b1b]"
            @click="toSearch()">
            {{ t("Seach") }}
          </div>
        </template>
      </inputCom>
    </div>
    <!-- Top Tabs -->
    <div class="sticky top-0 z-50 flex  items-center px-16 gap-8 overflow-x-auto flex-wrap">
      <div
        class="tab-item  flex flex-1 text-nowrap  items-center justify-center text-center border text-14 border-[#E5E5E5] border-solid rounded-[16px] py-4 px-6 h-40"
        :class="activeName == index ? 'bg-[#CED0D8] text-[#222222] font-bold' : 'text-[#999999]'"
        v-for="(item, index) in tabList" :key="index" @click="activeName = index; getProductList()">{{ item.name
        }}
      </div>
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

    <div v-else v-for="(item, index) in stockList" :key="index"
      class="mx-[16px] my-16 product-item product-item  bg-[#fff] px-[8px] py-[14px] rounded-[20px] relative"
      @click="handleClickStock(item)">
      <div class="tag px-4 h-13 bg-[#FF64641A] text-[9px] color-[#FF6464] absolute right-0 top-0">
        <!-- {{ item.tagText || 'Sold out' }} -->
        {{ item.status == 2 ? t('Sold Out') : t('Buy Now') }}

      </div>
      <div class="top flex gap-[8px] pb-[13px] border-b-solid border-b-[1px] border-b-[#F5F5F5]">
        <div class="img w-68 h-68 flex-shrink-0 bg-[#555] rounded-[20px] overflow-hidden">
          <img v-if="item.productImage" :src="item.productImage" class="w-full h-full object-cover" />
        </div>
        <div class="info w-full">
          <div class="title font-bold text-[14px] color-[#161616]">
            {{ item.productName || 'Product Name' }}
          </div>
          <div class="desc text-[12px] color-[#8C91A2] font-normal">{{ item.levelLimit || 'LV1 and above' }}</div>
          <div class="flex justify-between items-end">
            <div class="price color-[#FF6464] font-[14px] font-bold">R$ {{ addCommasToNumber(item.discountPrice) ||
              '0.00' }}</div>
            <div class="button text-[14px] font-bold text-[#fff]  px-[12px] py-[6px] rounded-[8px]"
              :class="item.status == 2 ? 'bg-[#CED0D8]' : 'bg-[#161616]'" @click="handleClickStock(item)">
              {{ item.status == 2 ? t('Sold Out') : t('Buy Now') }}
            </div>
          </div>
        </div>
      </div>
      <div class="bottom flex pt-[13px]">
        <div class="item flex-1">
          <div class="label mb-4">{{ t('Validity period') }}</div>
          <div class="value text-left">{{ item.incomeCycle + 'D' || '0' + $t('Days') }}</div>
        </div>
        <div class="item flex-1">
          <div class="label text-center mb-4">{{ t('Every other day') }}</div>
          <div class="value text-center">R$ {{ addCommasToNumber(item.dailyIncome) || '0.00' }}</div>
        </div>
        <div class="item flex-1">
          <div class="label text-right mb-4">{{ t('Total Revenue') }}</div>
          <div class="value text-right">R$ {{ addCommasToNumber(item.totalIncome) || '0.00' }}</div>
        </div>
      </div>
    </div>
    <div class="list px-[20px] flex flex-col gap-[20px]">


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

.label {
  font-family: Space Grotesk;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;

}

.value {
  font-family: Space Grotesk;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  leading-trim: NONE;
  line-height: 100%;
  letter-spacing: 0px;
  vertical-align: middle;

}

.phone-input {
  border: 1px solid #F0F0F0;
  border-radius: 12px;
  background: #0000000D;


  :deep(.input-box) {
    height: 39px;
    margin-top: 0px;

    input {
      background: transparent;
    }

  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}

.sendCode {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #868c9a;
  color: #fff;
  background: #424242;
}

.tag {
  border-radius: 0 4px 0 4px;
}
</style>