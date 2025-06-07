<template>
  <div class="account-change-content">
    <VanNavBar title="" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack">
      <template #title>
        <div class="flex flex-items-center gap-6">{{ t(title) }}</div>
      </template>
    </VanNavBar>
    <!-- <van-tabs v-model:active="active" :sticky="true" @change="tabChange">
            <van-tab class="tabpan" v-for="(item, index) in tabList" :key="index" :title="item.name">
            </van-tab>
        </van-tabs> -->
    <div class="tab-content w-full flex">
      <div class="tab-item text-center font-size-16 flex-1 py-12" :class="active == index ? 'active-item' : ''"
        v-for="(item, index) in tabList" :key="index" @click="tabChange(index)" :title="item.name">
        {{ t(item.name) }}
      </div>
    </div>

    <block v-if="type != '3'">
      <TabItem v-for="(item, el) in accountChangeList" :key="el" :item="item"></TabItem>
    </block>
    <block v-if="type == '3'">
      <div class="px-12">
        <EntrustItem v-for="item in accountChangeList" :key="item.order_no" :entrust="item" state="submitted"
          @cancelOrder="cancelOrder" />
      </div>
    </block>
    <empty v-if="!accountChangeList.length" :no-tips="true"></empty>
    <LoadMore :status="listStatus" @load-more="loadMore" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import TabItem from "./component/accountChangeCom/tab-item.vue";
import EntrustItem from "@/pages/quotes/component/openTradeCom/EntrustItem.vue";
import LoadMore from "@/components/LoadMore.vue";
import { walletLogsGrid } from "@/api/user";
import { orderList as swapOrderList, swapOrderCancel } from "@/api/swap";
import { assetsLogsGrid } from "@/api/swap";
const active = ref(0);
const { t } = useI18n();
const router = useRouter();
const type = ref("");
const title = computed(() => {
  if (type.value == "2") {
    return "Asset flow";
  } else if (type.value == "3") {
    return "Stock transaction records";
  } else {
    return "Balance flow";
  }
});
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const tabList = computed(() => {
  if (type.value == "2") {
    return [
      {
        name: "All",
        value: 0,
      },
      {
        name: "Income",
        value: 1,
      },
      {
        name: "Expenditure",
        value: 2,
      },
    ];
  } else if (type.value == "3") {
    return [
      {
        name: "All",
        value: 0,
      },
      {
        name: "Buy",
        value: 1,
      },
      {
        name: "Sell",
        value: 2,
      },
    ];
  } else {
    return [
      {
        name: "All",
        value: null,
      },
      {
        name: "Income",
        value: 1,
      },
      {
        name: "Expenditure",
        value: 2,
      },
    ];
  }
});
const orderForm = ref({
  categoryId: "",
  direction: "", //方向 buy sell
});
const accountChangeList = ref([]);
const page = reactive({
  pageIndex: 1,
  pageSize: 10,
});
const resetPage = () => {
  page.pageIndex = 1;
};
const tabChange = (e) => {
  resetPage();
  accountChangeList.value = [];
  active.value = e;
  if (type.value == "2") {
    if (e == 0) {
      getAssetsLogsGrid();
    } else {
      getAssetsLogsGrid({ type: e });
    }
  } else if (type.value == "3") {
    orderForm.value.direction = e == 0 ? "" : e == 1 ? "buy" : "sell";
    getOrderList();
  } else {
    getAccountChangeList({ type: e });
  }
};
const loadMore = () => {
  page.pageIndex++;
  if (type.value == "2") {
    getAssetsLogsGrid();
  } else if (type.value == "3") {
    getOrderList();
  } else {
    getAccountChangeList();
  }
};
const listStatus = ref(1);
// 资金流水
const getAccountChangeList = async (params = {}) => {
  listStatus.value = 1;
  const res = await walletLogsGrid({
    ...page,
    ...params,
  });
  if (!res.data.rows) {
    listStatus.value = 3;
    return;
  }
  if (page.pageIndex == 1) {
    accountChangeList.value = res.data.rows || [];
  } else {
    accountChangeList.value = [
      ...accountChangeList.value,
      ...(res.data.rows || []),
    ];
  }
  if (res.data.total <= accountChangeList.value.length) {
    listStatus.value = 3;
    return;
  }
  listStatus.value = 2;

  // accountChangeList.value = res.data.rows
};
const getOrderList = async (params = {}) => {
  listStatus.value = 1;
  const { data, code } = await swapOrderList({
    ...page,
    ...params,
    ...orderForm.value,
  });
  if (code == 200) {
    // showToast('购入成功')
    if (!data.rows) {
      if (page.pageIndex == 1) {
        accountChangeList.value = []
      }
      listStatus.value = 3;
      return;
    }
    if (page.pageIndex == 1) {
      accountChangeList.value = data.rows || [];
    } else {
      accountChangeList.value = [
        ...accountChangeList.value,
        ...(data.rows || []),
      ];
    }
    if (data.total <= accountChangeList.value.length) {
      listStatus.value = 3;
      return;
    }
    listStatus.value = 2;
  }
};
const getAssetsLogsGrid = async (params = {}) => {
  const { data, code } = await assetsLogsGrid({ ...page, ...params });
  if (code == 200) {
    if (!data.rows) {
      if (page.pageIndex == 1) {
        accountChangeList.value = []
      }
      listStatus.value = 3;
      return;
    }
    if (page.pageIndex == 1) {
      accountChangeList.value = data.rows;
    } else {
      accountChangeList.value = [...accountChangeList.value, ...data.rows];
    }
    if (data.total <= accountChangeList.value.length) {
      listStatus.value = 3;
      return;
    }
    listStatus.value = 2;
  }
};
const cancelOrder = (val) => {
  let params = {
    id: val.id,
  };
  swapOrderCancel(params).then((res) => {
    if (res.code == 200) {
      showToast(t("Order canceled successfully"));
      page.pageIndex = 1;
      getOrderList();
    }
  });
};
const route = useRoute();

onMounted(() => {
  // type == 2  'assets接口'
  if (route.query.type) {
    type.value = route.query.type;
    if (route.query.type == "2") {
      getAssetsLogsGrid();
    } else if (route.query.type == "3") {
      orderForm.value.categoryId = route.query.categoryId || "";
      route.meta.title = "股票交易记录"; // 设置你需要的标题
      getOrderList();
    } else {
      getAccountChangeList();
    }
  }
});
</script>
<style lang="less" scoped>
.tabpan {
  padding: 0 12px;
}

.active-item {
  color: var(--color_main);
  position: relative;

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 4px;
    background: var(--color_main);
    border-radius: 2px;
  }
}
</style>
