<template>
    <div class="stockOrderList w-full p-24">
        <div class="content" v-for="(contentItem, index) in orderListData" :key="index">
            <div class="title color-#64748B text-14px">{{ contentItem.date }}</div>
            <div class="order-list py-16px flex-col flex gap-16px">
                <stockItem v-for="(item, itemIndex) in contentItem.transactions" :key="itemIndex" :item="item"
                    @click="handleClickStockDetail(item)" />
            </div>
        </div>
        <empty v-if="orderListData.length == 0" :no-tips="true" />
        <LoadMore :status="listStatus" @load-more="loadMore"></LoadMore>




    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { orderList } from '@/api/stock'
const { proxy } = getCurrentInstance()!
import stockItem from "../market/component/stock-item.vue";

const orderListData = ref([])
const router = useRouter()
const listStatus = ref(0) // 0: 初始, 1: 加载中, 2: 可加载更多, 3: 没有更多
const page = reactive({
    "page": 1,
    "size": 10
})

// 加载更多
const loadMore = () => {
    page.page++;
    getStockOrderList();
};

// 获取股票订单列表
const getStockOrderList = async () => {
    try {
        listStatus.value = 1; // 开始加载

        const { data } = await orderList({
            ...page
        });

        if (!data.list || data.list.length === 0) {
            listStatus.value = 3; // 没有数据
            return;
        }

        if (page.page === 1) {
            // 第一页，直接替换数据
            orderListData.value = data.list || [];
        } else {
            // 后续页面，追加数据
            orderListData.value = orderListData.value.concat(data.list || []);
        }

        // 判断是否还有更多数据
        if (!data.pagination.has_more) {
            listStatus.value = 3; // 没有更多数据
            return;
        }

        listStatus.value = 2; // 可以加载更多

    } catch (error) {
        console.error('获取订单列表失败:', error);
        listStatus.value = 3; // 出错时设置为没有更多
    }
}

// 初始化加载
getStockOrderList()

const handleClickStockDetail = (item: any) => {
    router.push('/buy/orderDetail?transaction_id=' + item.transaction_id)
}

</script>
<style lang="less" scoped>
.order-item {
    border: 1px solid #E9EAEB;

}
</style>
<route lang="json5">
    {
      name: 'transactions History',
      meta: {
        title: 'Loan List',
        i18n: 'Credit loansList',
      },
    }
</route>