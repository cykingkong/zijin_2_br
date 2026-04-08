<template>
  <div class="help-page">
    <div class="help-shell">
      <header class="page-header">
        <div class="header-badge">{{ $t('Help') }}</div>
        <h1 class="page-title">{{ $t('Help') }}</h1>
      </header>

      <div class="order-list pb-[16px] flex-col flex gap-[16px]">
        <div v-for="(item, index) in orderListData" :key="index" @click="handleClickItem(item)"
          class="order-item">
          <div class="left h-full flex flex items-center justify-between">
            <div class="title text-[13px] font-bold">{{ item.title }}</div>
          </div>
          <div class="order-arrow">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.93994 13.28L10.2866 8.93333C10.7999 8.42 10.7999 7.58 10.2866 7.06667L5.93994 2.72"
                stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { helpList } from "@/api/image";
import { withdrawOrderGrid } from '@/api/withdraw'
const { proxy } = getCurrentInstance()!;
import stockItem from "@/components/stock-item.vue";

const orderTypeList = ref(['All', 'Deposit', 'Withdrawal'])
const activeTab = ref(0)
const orderListData = ref([]);
const router = useRouter();
const listStatus = ref(0); // 0: 初始, 1: 加载中, 2: 可加载更多, 3: 没有更多
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});

// 加载更多
const loadMore = () => {
  page.pageIndex++;
  getData();
};
const getData = () => {
  orderListData.value = [];


  getWalletLogsList()

}
const handleClickItem = (item: any) => {
  router.push("/aboutUs?id=" + item.id);
}
// 获取股票订单列表
const getWalletLogsList = async () => {
  try {
    listStatus.value = 1; // 开始加载
    const { data } = await helpList({
      ...page,
      type: activeTab.value == 0 ? null : activeTab.value,
    });

    if (!data || data.length === 0) {
      listStatus.value = 3; // 没有数据
      return;
    }

    if (page.pageIndex === 1) {
      // 第一页，直接替换数据
      orderListData.value = data || [];
    } else {
      // 后续页面，追加数据
      orderListData.value = orderListData.value.concat(data || []);
    }



    listStatus.value = 2; // 可以加载更多

  } catch (error) {
    console.error("获取订单列表失败:", error);
    listStatus.value = 3; // 出错时设置为没有更多
  }
};
onMounted(async () => {

  // 初始化加载
  await getWalletLogsList();
  setTimeout(() => {
    console.log(orderListData.value)

  }, 999)
})
const handleClickStockDetail = (item: any) => {
  // router.push("/buy/orderDetail?transaction_id=" + item.transaction_id);
};
</script>
<style lang="less" scoped>
.help-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(124, 255, 178, 0.14), transparent 30%),
    linear-gradient(180deg, #050505 0%, #000 100%);
  padding: 24px 20px 120px;
  color: #f5f5f5;
}

.help-shell {
  display: grid;
  gap: 18px;
}

.page-header {
  padding: 4px 2px 0;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid rgba(124, 255, 178, 0.35);
  border-radius: 999px;
  background: rgba(124, 255, 178, 0.08);
  color: #8bffbe;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-title {
  margin: 16px 0 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.order-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 58px;
  padding: 0 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.32);
}

.title {
  color: #f5f5f5;
}

.order-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: #8bffbe;
  background: rgba(124, 255, 178, 0.08);
  box-shadow:
    inset 0 0 0 1px rgba(124, 255, 178, 0.18),
    0 0 12px rgba(124, 255, 178, 0.16);
}
</style>
<route lang="json5">
    {
      name: 'help',
      meta: {
        title: 'Help',
        i18n: 'Help',
      },
    }
</route>
