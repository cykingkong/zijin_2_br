<template>
  <div class="stockOrderList w-full p-24">
    <div class="order-type-tab flex justify-center items-center mb-12 gap-[16px]">
      <div
        class="tab-item flex-1 flex items-center justify-center text-center border text-14 border-[#E5E5E5] border-solid rounded-[16px] py-4 px-6 h-40"
        :class="activeTab == index ? 'bg-[#F5F5F5] text-[#222222] font-bold' : 'text-[#999999]'"
        v-for="(item, index) in orderTypeList" :key="index" @click="activeTab = index; getWalletLogsList()">{{ $t(item)
        }}
      </div>
    </div>
    <div class="order-list pb-[16px] flex-col flex gap-[16px]">
      <stockItem v-for="(item, index) in orderListData" :key="index" :item="item"
        @click="handleClickStockDetail(item)" />
    </div>
    <empty v-if="orderListData.length == 0" :no-tips="true" />
    <LoadMore :status="listStatus" @load-more="loadMore"></LoadMore>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { walletLogsGrid } from "@/api/user";
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
  getWalletLogsList();
};

// 获取股票订单列表
const getWalletLogsList = async () => {
  try {
    listStatus.value = 1; // 开始加载

    const { data } = await walletLogsGrid({
      ...page,
      type: activeTab.value == 0 ? null : activeTab.value,
    });

    if (!data.rows || data.rows.length === 0) {
      listStatus.value = 3; // 没有数据
      return;
    }

    if (page.pageIndex === 1) {
      // 第一页，直接替换数据
      orderListData.value = data.rows || [];
    } else {
      // 后续页面，追加数据
      orderListData.value = orderListData.value.concat(data.rows || []);
    }

    // 判断是否还有更多数据
    if (data.rows.length <= data.total) {
      listStatus.value = 3; // 没有更多数据
      return;
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
  router.push("/buy/orderDetail?transaction_id=" + item.transaction_id);
};
</script>
<style lang="less" scoped>
.order-item {
  border: 1px solid #e9eaeb;
}
</style>
<route lang="json5">
    {
      name: 'walletLogs',
      meta: {
        title: 'walletLogs',
        i18n: 'walletLogs',
      },
    }
</route>