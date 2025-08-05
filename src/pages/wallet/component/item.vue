<template>
    <div
        class="item w-full rounded-12px border-1px border-solid border-#E2E8F0 min-h-78px flex items-center justify-between px-16px">
        <slot name="left">
            <div class="left h-46px flex items-center gap-16px">
                <div class="img rounded-full w-40px h-40px overflow-hidden"></div>
                <div class="info h-46px flex flex-col justify-between ">
                    <div class="name text-#0F172A text-14px font-bold">Send (AMD)</div>
                    <div class="name2 text-#64748B text-12px">Send (AMD)</div>
                </div>
            </div>
        </slot>

        <slot name="right">
            <div class="right h-46px flex items-center gap-16px">
                123
            </div>
        </slot>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const { proxy } = getCurrentInstance()!




</script>
<style lang="less" scoped></style>