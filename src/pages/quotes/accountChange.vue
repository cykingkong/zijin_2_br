<template>
    <div class="account-change-content">
        <van-tabs v-model:active="active" :sticky="true" @change="tabChange">
            <van-tab title="全部" class="tabpan">
                <TabItem v-for="(item, el) in accountChangeList" :key="el" :item="item"></TabItem>
                <LoadMore :status="listStatus" @load-more="loadMore" />

            </van-tab>
            <van-tab title="法币交易" class="tabpan">
                <TabItem v-for="(item, el) in accountChangeList" :key="el" :item="item"></TabItem>
            </van-tab>
            <van-tab title="现金交易" class="tabpan">
                <TabItem v-for="(item, el) in accountChangeList" :key="el" :item="item"></TabItem>
            </van-tab>

        </van-tabs>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import TabItem from "./component/accountChangeCom/tab-item.vue";
import LoadMore from '@/components/LoadMore.vue'
import { walletLogsGrid } from "@/api/user"
const active = ref('')
const accountChangeList = ref([
    { type: 1 },
    { type: 2 },
])
const page = reactive({
    pageIndex: 1,
    pageSize: 10,
})
const resetPage = () => {
    page.pageIndex = 1

}
const tabChange = (e) => {
    resetPage()
    getAccountChangeList()
}
const loadMore = () => {
    page.pageIndex++
    getAccountChangeList()
}
const listStatus = ref(1)
const getAccountChangeList = async () => {
    listStatus.value = 1
    const res = await walletLogsGrid({
        ...page,
    })
    if (!res.data.rows) {
        listStatus.value = 3
        return
    }
    if (page.pageIndex == 1) {
        accountChangeList.value = res.data.rows || []
    } else {
        accountChangeList.value = [...accountChangeList.value, ...res.data.rows || []]
    }
    if (res.data.total <= accountChangeList.value.length) {
        listStatus.value = 3
        return
    }
    listStatus.value = 2

    // accountChangeList.value = res.data.rows


}
onMounted(() => {
    getAccountChangeList()
})
</script>
<style lang="less" scoped>
.tabpan {
    padding: 0 12px;
}
</style>
