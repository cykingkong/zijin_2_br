<template>
    <div class="fund-detail p-12">
        <div v-html="info.content"></div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { fundProductInfo } from "@/api/bond"
const info = ref({})
const getInfo = async (id) => {
    const res = await fundProductInfo({ id })
    console.log(res)
    info.value = res.data
}
const router = useRoute()
onMounted(() => {
    console.log(router)
    if (router.query.id) {
        getInfo(router.query.id as string)
    }
})


</script>

<style lang="less" scoped></style>
