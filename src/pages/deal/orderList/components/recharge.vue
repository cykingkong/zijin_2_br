<template>
    <div class="recharge p-12 ">
        <div class="li flex items-center">
            <div class="label text-blueGray-400">充值时间：</div>
            <div class="value ">{{ item.createdAt }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">充值金额：</div>
            <div class="value ">{{ item.symbol }} {{ item.amount }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">实际到账金额：</div>
            <div class="value ">{{ item.symbol }} {{ item.actualAmount }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">充值币种：</div>
            <div class="value "> {{ item.assetId }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">充值类型：</div>
            <div class="value ">{{ methodType[item.method] }}{{ item.methodName }}</div>
        </div>
        <div class="li flex items-center">
            <div class="text-blueGray-400 label">充值状态：</div>
            <div class="value ">{{ rechargeEnum[item.status] }}</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!
const props = defineProps({
    item: Object
})
const methodType = {
    'crypto': '数字货币',
    'bank_card': '银行卡',
}
const rechargeEnum = {
    0: '支付中', 1: '已支付', 2: '支付超时'
}


</script>
<style lang="less" scoped>
.recharge {
    border-bottom: 1px solid var(--border_color)
}
</style>
