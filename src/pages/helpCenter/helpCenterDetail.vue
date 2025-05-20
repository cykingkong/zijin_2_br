<template>
    <div class="helpCenter  p-12 ">
        <div class="" v-html="data">
        </div>


    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
import { useStore } from '@/stores/modules/index';
const { proxy } = getCurrentInstance()
const store = useStore()
const route = useRoute()
import { indexInfo } from "@/api/market";
const data = ref()
const index = ref(0)
const qaList = computed(() => {
    return store.getQaList
})
onMounted(() => {
    if (route.query.index) {
        index.value = Number(route.query.index)
        data.value = qaList.value[index.value].a
    }
})


</script>
<style lang="less" scoped></style>
