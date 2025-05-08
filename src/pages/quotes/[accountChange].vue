<template>
    <div class="account-change-content">
        <van-tabs v-model:active="active" :sticky="true">
            <van-tab title="全部" class="tabpan">
                <TabItem v-for="(item, el) in accountChangeList" :key="el" :item="item"></TabItem>
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
import { walletLogsGrid } from "@/api/user"
const active = ref('1')
const accountChangeList = ref([
    { type: 1 },
    { type: 2 },
])
const page = reactive({
    page: 1,
    pageSize: 10,
})
const getAccountChangeList = async () => {
    const res = await walletLogsGrid({
        ...page,
    })
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
