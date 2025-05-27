<template>
    <div class="withdraw p-12 ">
        <div class="li flex items-center">
            <div class="label text-blueGray-400">提现时间：</div>
            <div class="value ">{{ item.createdAt }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">提现金额：</div>
            <div class="value ">{{ item.symbol }} {{ item.amount }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">手续费：</div>
            <div class="value ">{{ item.symbol }} {{ item.fee }}</div>
        </div>
        <div class="li flex items-center" v-if="item.content">
            <div class="text-blueGray-400 label">驳回理由：</div>
            <div class="value ">{{ item.content }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">提现状态：</div>
            <div class="value ">{{ withdrawEnum[item.status] }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!
const props = defineProps({
    item: Object
})
const withdrawEnum = {
    0: '审核中', 1: '已通过', 2: '已驳回'
}


</script>
<style lang="less" scoped>
.withdraw {
    border-bottom: 1px solid var(--border_color)
}
</style>
