<template>
    <div class="select-type-content">
        <van-index-bar>
            <van-index-anchor index="s" />
            <van-cell title="所有银行卡" @click="handleClickHerf(1)" />
            <van-index-anchor index="x" />
            <van-cell title="虚拟货币支付" @click="handleClickHerf(1)" />
        </van-index-bar>



    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const router = useRouter()
const handleClickHerf = (id: number) => {
    router.push({ path: '/profile/payMentMethod/add?type=' + id, query: { type: id } })
}



</script>
<style lang="less" scoped>
:deep(.van-index-bar__sidebar) {
    display: none;
}
</style>
