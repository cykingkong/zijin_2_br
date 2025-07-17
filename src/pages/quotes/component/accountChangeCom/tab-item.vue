<template>
    <div class="">
        <div class="account-change-item flex py-12 px17">
            <div class="left flex flex-items-center gap-8 flex-shrink-0 w-60%">
                <img src="@/assets/image/assets-center/in.png" alt="" class="up w-20 h-20" v-show="item.type == 1">
                <img src="@/assets/image/assets-center/out.png" alt="" class="up w-20 h-20" v-show="item.type == 2">
                <div class="left-info">
                    <div class="name text-white mb-">{{ item.logTypeDesc }}</div>
                    <div class="desc font-size-14 text-gray mt-10">{{ item.assetTypeDesc }}</div>
                </div>
            </div>
            <div class="right flex-1 text-align-right">
                <div class="font-size-20" :class="item.type == 1 ? 'up' : 'down'">{{ item.type == 1 ? '+' : '-' }} {{
                    item.assetInfo ? item.assetInfo.unit : '' }} {{
                        addCommasToNumber(item.amount) }}</div>
                <div class="time font-size-12 text-gray mt-10">{{ dayjs(item.createdAt).format("DD/MM/YYYY HH:mm:ss") }}
                </div>
            </div>
        </div>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import dayjs from 'dayjs'
import { addCommasToNumber } from '@/utils/tool'
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }

})



</script>
<style lang="less" scoped>
.time {
    white-space: nowrap;
}
</style>
