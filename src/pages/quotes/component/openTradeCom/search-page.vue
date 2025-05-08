<template>
    <div class="serch-page w-full px-12 pt-12">
        <div class="search-tab-box w-full flex flex-items-center">
            <div class="tab-item flex flex-1 flex-items-center flex-justify-center h-40 rounded-8px font-size-14"
                :class="{ 'active': true }" v-for="item in tabList" :key="item.label">{{ item.label }}</div>
        </div>
        <empty></empty>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const tabList = ref([
    { label: '当前委托', },
    { label: '历史委托', },
    { label: '成交历史', },
])



</script>
<style lang="less" scoped>
.search-tab-box {
    background: var(--input_background);
    ;
}
</style>
