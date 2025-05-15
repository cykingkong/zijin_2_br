<template>
    <div class="li flex w-full items-center gap-20">
        <div class="logo w-50 h-50 rounded-full overflow-hidden bg-white">
            <img :src="item.logo" alt="" v-if="item && item.logo" class="w-full h-full">
            <img :src="item.ipoInfo.logo" alt="" v-if="item.ipoInfo" class="w-full h-full">

        </div>
        <div class="name font-size-22">{{ itemType == 'ipo' ? item.name : item.ipoInfo.name }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"

const props = defineProps({
    item: {
        type: Object as () => any,
    },
    itemType: {
        type: String,
        default: 'ipo'
    }
})


</script>
<style lang="less" scoped>
.li {}
</style>
