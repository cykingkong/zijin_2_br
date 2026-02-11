<template>

    <div class="new-detail min-h-[100vh]">
        <div class="title text-center px-16 font-bold"></div>
        <div class="content" v-html="content"></div>
        <div class="picture-box">
            <!-- 单张图片 -->
            <div class="w-full min-h-[120px] rounded-[16px] overflow-hidden bg-[#f5f5f5]"
                v-if="item.pictureList.length == 1" v-for="(item, index) in item.pictureList" :key="index">
                <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                    @click="showImagePreview(index)"></van-image>
            </div>
            <!-- 两张图片 -->
            <div class="w-full grid grid-cols-3 gap-8" v-if="[2, 3].includes(item.pictureList.length)">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in item.pictureList" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>


            </div>
            <!-- 四张图片 -->
            <div class="w-full grid grid-cols-2 gap-8" v-if="item.pictureList.length == 4">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in item.pictureList" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>

                <!-- <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"></div> -->
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
const content = ref(``)
</script>
<style lang="less" scoped></style>

<route lang="json5">
{
  name: 'newsDetail',
  meta: {
    i18n: ''
  },
}
</route>