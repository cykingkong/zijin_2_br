<template>
  <div class="stockOrderList w-full px-24 pt-[24px]">
    <!-- <div class="order-type-tab flex justify-center items-center mb-12 gap-[4px]">
      <div
        class="tab-item flex-1 flex items-center bg-[#0000000D] justify-center text-center border text-14 border-[#E5E5E5] border-solid rounded-[8px] py-4 px-6 h-28 text-[#00000033]"
        :class="activeTab == index ? 'bg-[#CED0D8] text-[#222222] font-bold' : 'text-[#999999]'"
        v-for="(item, index) in orderTypeList" :key="index" @click="activeTab = index; getData()">{{ $t(item)
        }}
      </div>
    </div> -->
    <div class="order-list pb-[16px] flex-col flex gap-[16px]">
      <div v-for="(item, index) in orderListData" :key="index" @click="handleClickItem(item)"
        class="order-item flex items-center justify-between px-[16px] h-[46px] py-6 rounded-[12px] bg-[#FFFFFF]">
        <div class="left h-full flex-col flex justify-between">
          <div class="title text-[12px] font-bold">{{ item.title }}</div>
          <!-- <div class="content text-[10px] text-[#666666]">{{ item.created_at }}</div> -->
        </div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5.93994 13.28L10.2866 8.93333C10.7999 8.42 10.7999 7.58 10.2866 7.06667L5.93994 2.72"
            stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
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
.order-item {
  // border: 1px solid #e9eaeb;
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