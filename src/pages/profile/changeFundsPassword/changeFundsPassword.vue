<template>
    <div class="changePassword-content flex flex-col gap-24 p-12">
        <!-- 修改资金密码 -->
        <inputCom :label="'新密码'" :placeholder="'请输入验证码'" :tips="'請輸入6位數字'"></inputCom>
        <inputCom :label="'确认新密码'" :placeholder="'请输入验证码'" :tips="'請輸入6位數字'"></inputCom>
        <van-radio-group v-model="checked" shape="dot" class="flex flex-col gap-12">
            <van-radio name="1" class="radio-item font-size-12" icon-size="15px">Radio 1</van-radio>
            <van-radio name="2 " class="radio-item font-size-12" icon-size="15px">Radio 2</van-radio>
        </van-radio-group>
        <inputCom :label="'验证码'" :placeholder="'请输入验证码'" :tips="''">
            <template #sendCode>
                <div class="absolute right-0 text-blue-500 font-size-12 sendCode">发送验证码</div>
            </template>
        </inputCom>
        <van-button type="primary" block>确定</van-button>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import inputCom from "@/components/inputCom.vue";
const checked = ref('1')


</script>
<style lang="less" scoped>
.sendCode {
    top: 50%;
    transform: translateY(-50%);
}
</style>
