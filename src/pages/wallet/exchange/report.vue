<template>
    <div class="report-page">
        <!-- 充值、提现记录 -->



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { rechargeOrderGrid } from '@/api/recharge'
const page = ref({
    pageIndex: 1,
    pageSize: 10,
    total: 0
})
const getRechargeOrderGrid = async () => {
    const res = await rechargeOrderGrid({
        ...page.value
    })
    console.log(res)
}



onMounted(() => {
    getRechargeOrderGrid()
})
</script>
<style lang="less" scoped></style>
