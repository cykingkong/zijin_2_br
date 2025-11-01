<template>
    <div class="title font-size-14 font-bold mt-24 mb-12 flex gap-12 items-center">
        <div class="flex justify-center tab-item rounded-10px p-12" :class="{ 'active': activeIndex == index }"
            v-for="(item, index) in list" :key="index" @click="handleClickItem(index)">
            {{ item.label }} </div>
    </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
interface listItem {
    label:String,
}

const props = defineProps({
    list: {
        type: Array<listItem>,
        default: () => []
    }
})
const emits = defineEmits(['change'])
const activeIndex = ref<Number>(0)
const handleClickItem = (index: any) => {
    activeIndex.value = index
    emits('change', index)
}


</script>
<style lang="less" scoped>
.tab-item {
    cursor: pointer;
    border: 1px solid #112542;
    transition: all 0.3s ease-in-out;
}

.active {
    position: relative;
    color: var(--van-white);
    background-color: #112542;

}
</style>
