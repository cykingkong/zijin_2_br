<template>
    <div class="order-item w-full p-12 flex-col gap-8 flex mb-12">
        <div class="top flex flex-justify-between">
            <div class="l flex gap-4 flex-1">
                <div class="t font-size-14 down">大宗/買入</div>
                <div class="e">TLKM</div>
            </div>
            <div class="r font-size-14 text-blueGray flex-shrink-0 text-align-right">
                释放完成
            </div>
        </div>
        <!-- 时间价格 -->
        <div class="line flex flex-justify-between">
            <div class="left flex-1">
                <div class="l-t text-blueGray font-size-12 mb-2">时间</div>
                <div class="l-b">01-16 16:03:13</div>
            </div>
            <div class="right flex-1 text-align-right">
                <div class="r-t text-blueGray font-size-12 mb-2">价格</div>
                <div class="r-b">0</div>
            </div>
        </div>
        <!-- 成交量、价格 -->
        <div class="line flex flex-justify-between">
            <div class="left flex-1">
                <div class="l-t text-blueGray font-size-12 mb-2">成交量</div>
                <div class="l-b">01-16 16:03:13</div>
            </div>
            <div class="right flex-1 text-align-right">
                <div class="r-t text-blueGray font-size-12 mb-2">成交价格</div>
                <div class="r-b">0</div>
            </div>
        </div>
        <!-- 已释放 -->
        <div class="line flex flex-justify-between">
            <div class="left flex-1">
                <div class="l-t text-blueGray font-size-12 mb-2">已释放</div>
                <div class="l-b">01-16 16:03:13</div>
            </div>
            <div class="right flex-1 text-align-right">
                <div class="r-t text-blueGray font-size-12 mb-2">每日释放比例</div>
                <div class="r-b">0</div>
            </div>
        </div>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";




</script>
<style lang="less" scoped>
.order-item {
    background: #1F2639;
    border-radius: 8px;
    padding: 18px;
}
</style>
