<template>
    <div class="chat-item-content p-12 w-full">
        <div class="title-top flex justify-between items-center">
            <div class="label font-size-16 font-bold">{{ title }}</div>
            <div class="more font-size-12 color-blueGray">更多</div>
        </div>
        <slot class="w-full"></slot>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const props = defineProps({
    title: {
        type: String,
        default: "标题"
    }
})



</script>
<style lang="less" scoped>
.chat-item-content {
    background: var(--rank-bg);

}
</style>
