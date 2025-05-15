<template>
    <div class="">
        <div class="account-change-item flex py-12 px17">
            <div class="left flex flex-items-center gap-8 flex-shrink-0">
                <img src="@/assets/image/assets-center/in.png" alt="" class="up w-20 h-20" v-show="item.type == 2">
                <img src="@/assets/image/assets-center/out.png" alt="" class="up w-20 h-20" v-show="item.type == 1">
                <div class="left-info">
                    <div class="name text-white mb-">{{ item.logType }}</div>
                    <div class="desc font-size-12 text-gray mt-10">大宗交易</div>
                </div>
            </div>
            <div class="right flex-1 text-align-right">
                <div class="font-size-20" :class="item.type == 1 ? 'up' : 'down'">{{
                    addCommasToNumber(item.beforeBalance -
                        item.afterBalance) || '-' }}</div>
                <div class="time font-size-12 text-gray mt-10">{{ item.createAt }}</div>
            </div>
        </div>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { addCommasToNumber } from '@/utils/tool'
const props = defineProps({
    item: {
        type: Object,
        default: () => { }
    }

})



</script>
<style lang="less" scoped></style>
