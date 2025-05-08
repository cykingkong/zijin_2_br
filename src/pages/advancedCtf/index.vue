<template>
    <div class="advancedCtf-content flex flex-col gap-12 px-12">
        <!-- 高级认证 -->
        <inputCom :label="'真实姓名'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <inputCom :label="'工作地址'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <inputCom :label="'家庭地址'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <inputCom :label="'与本人关系'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <inputCom :label="'亲属姓名'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <inputCom :label="'亲属地址'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <inputCom :label="'亲属电话'" v-model:value="parentValue" :onlyRead="false" :type="'text'"></inputCom>
        <van-button type="primary" block>申请认证</van-button>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from '@/components/inputCom.vue'




</script>
<style lang="less" scoped></style>
