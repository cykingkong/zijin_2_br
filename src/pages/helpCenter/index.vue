<template>
    <div class="helpCenter  px-12 pb-12">

        <van-cell-group>
            <van-cell :title="e.q" isLink v-for="(e, k) in data.qa" :key="k" @click="handleClickCell(k)" />
        </van-cell-group>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { useStore } from '@/stores/modules/index';
const { proxy } = getCurrentInstance()
const store = useStore()
const router = useRouter()
import { indexInfo } from "@/api/market";
const data = ref({
    qa: []
})
const getData = async () => {
    const res = await indexInfo()
    if (res.code == 200) {
        data.value = res.data
        data.value.qa = JSON.parse(res.data.qa)
        store.setQaList(data.value.qa)
    }
}
const handleClickCell = (k: number) => {
    router.push('/helpCenter/helpCenterDetail?index=' + k)
}
getData()


</script>
<style lang="less" scoped></style>
