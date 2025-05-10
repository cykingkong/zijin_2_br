<template>
    <div class="li flex w-full items-center justify-between ">
        <div class="label text-blueGray-400 ">{{ label }}</div>
        <div class="num font-500">{{ value }}</div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const props = defineProps({
    label: {
        type: String,
        default: ""
    },
    value: {
        type: String,
        default: "$1"
    }
})



</script>
<style lang="less" scoped></style>
