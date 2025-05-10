<template>
    <div class="li flex w-full items-center gap-20">
        <div class="logo w-50 h-50 rounded-full overflow-hidden bg-white">
            <img :src="item.assetInfo.logo" alt="" v-if="item.assetInfo" class="w-full h-full">
        </div>
        <div class="name font-size-22">{{ item.name }}</div>
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
