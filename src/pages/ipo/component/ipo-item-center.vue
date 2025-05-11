<template>
    <div class="li flex w-full items-center justify-between ">
        <div class="l flex-1 font-size-16">
            <div class="num font-500">{{ item.totalNum }}</div>
            <div class="label text-blueGray-400 ">总销售额(份额)</div>
        </div>
        <div class="r flex-1 font-size-16">
            <div class="num font-500">{{ item.userSubscribed }}</div>
            <div class="label text-blueGray-400 ">数量(份额)</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"

const props = defineProps({
    item: {
        type: Object as () => any,
    },
})


</script>
<style lang="less" scoped>
.li {}
</style>
