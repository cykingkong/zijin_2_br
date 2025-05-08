<template>
    <div class="bindVerify-content p-12 flex flex-col gap-24">
        <inputCom :label="'邮箱'" :placeholder="'请输入邮箱'"></inputCom>
        <inputCom :label="'验证码'" :placeholder="'请输入验证码'"></inputCom>
        <van-button type="primary" block>确认</van-button>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from "@/components/inputCom.vue";



</script>
<style lang="less" scoped></style>
