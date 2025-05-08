<template>
    <div class="authentication-content">
        <!-- 认证详情 -->
        <div
            class="pt-14 pb-14 box-border   px-12 font-size-14 flex-items-center flex flex-justify-between border-b-color">
            <div class="l">认证状态</div>
            <div class="r flex-items-center flex gap-8">
                <img src="@/assets/image/success.png" alt="" class="w16 h16">
                审核成功
            </div>
        </div>
        <div class="px-12 pt-12 flex-col flex gap-12">
            <inputCom :label="'国籍'" v-model:value="parentValue" :onlyRead="true" :type="'text'"></inputCom>
            <inputCom :label="'真实姓名'" v-model:value="parentValue" :onlyRead="true" :type="'text'"></inputCom>
            <inputCom :label="'證件/護照號碼'" v-model:value="parentValue" :onlyRead="true" :type="'text'"></inputCom>
            <inputCom :label="'證件照/上傳護照'" v-model:value="parentValue" :type="'imageShow'">
                <div class="flex  flex-justify-around w-full">
                    <div class="flex-1 w80 h80 "></div>
                    <div class="flex-1 w80 h80"></div>
                    <div class="flex-1 w80 h80"></div>
                </div>
            </inputCom>

        </div>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from '@/components/inputCom.vue'
const parentValue = ref('')


</script>
<style lang="less" scoped>
.border-b-color {
    border-bottom: 1px solid var(--border_color);
}
</style>