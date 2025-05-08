<template>
    <div class="rechargeList-page p-12">

        <div class="w-full t font-16">请选择充值的币种</div>
        <div class="flex w-full gap-12 mt-12">
            <div class="channel-item  rounded-10 flex-1 text-align-center py-12" v-for="item in methodList"
                @click="toUrl('/deal/exchange/charge-bank')">
                <div class="font-size-12 ">{{ item.method.name }}</div>
            </div>

        </div>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { coinRechargeConfig, recharge } from '@/api/recharge'
const methodList = ref([])
const getCoinRechargeConfig = async () => {
    coinRechargeConfig({ mode: 'gp' }).then(res => {
        methodList.value = res.data
        // priceTabArr.value = res.data.settings.find(item => item.key === 'recharge_number').value.split(',')
        // tips.value = `充值范围${res.data.settings.find(item => item.key === 'recharge_min_amount').value}-10000000000`
        // columns.value = res.data.methods.map((e) => {
        //     return {
        //         text: e.method,
        //         value: e.id
        //     }
        // })
    })
}
onMounted(() => {
    getCoinRechargeConfig()
})


</script>
<style lang="less" scoped>
.channel-item {
    border: 1px solid #1678FF
}
</style>
