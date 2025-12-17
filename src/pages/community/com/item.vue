<template>
    <div class="item w-full b border b-solid b-[#F0F0F0] p-16 rounded-16">

        <div class="info w-full flex gap-8">
            <div class="avatar rounded-full w-44 h-44 bg-[#f5f5f5]"></div>
            <div class="detail flex flex-col justify-between">
                <div class="name text-[#1B1B1B] text-16">{{ item?.userName || '匿名用户' }}</div>
                <div class="time text-[#888888] text-14">{{ item?.createdAt || '2023-01-01' }}</div>
            </div>
        </div>
        <div class="content my-12">
            <div class="text-[#888888] text-16">{{ item?.content || '暂无内容' }} </div>
        </div>
        <div class="picture-box">
            <!-- 单张图片 -->
            <div class="w-full min-h-[120px] rounded-[16px] overflow-hidden bg-[#f5f5f5]" v-if="arr.length == 1"
                v-for="(item, index) in arr" :key="index">
                <van-image :src="item" class="w-full h-full object-cover" @click="showImagePreview(index)"></van-image>
            </div>
            <!-- 两张图片 -->
            <div class="w-full grid grid-cols-3 gap-8" v-if="[2, 3].includes(arr.length)">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in arr" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>


            </div>
            <!-- 四张图片 -->
            <div class="w-full grid grid-cols-2 gap-8" v-if="arr.length == 4">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in arr" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>

                <!-- <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"></div> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { showImagePreview as previewImage } from 'vant';
const props = defineProps({
    arr: {
        type: Array,
        default: () => [1, 2, 3, 4,]
    },
    item: {
        type: Object,
        default: () => ({})
    }
})
const showImagePreview = (index) => {
    previewImage({
        images: props.arr,
        startPosition: index
    })
}
</script>