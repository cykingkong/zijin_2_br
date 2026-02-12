<template>

    <div class="new-detail min-h-[100vh] px-20">
        <div class="title text-center px-16 font-bold mb-16">{{ info.title||'-' }}</div>
        <div class="content" v-html="info.content"></div>
        <div class="picture-box">
            <!-- 单张图片 -->
            <div class="w-full min-h-[120px] rounded-[16px] overflow-hidden bg-[#f5f5f5]"
                v-if="info.pictureList.length == 1" v-for="(item, index) in info.pictureList" :key="index">
                <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                    @click="showImagePreview(index)"></van-image>
            </div>
            <!-- 两张图片 -->
            <div class="w-full grid grid-cols-3 gap-8" v-if="[2, 3].includes(info.pictureList.length)">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in info.pictureList" :key="index">
                    <van-image :src="item" fit="cover" class="w-full h-full object-cover"
                        @click="showImagePreview(index)"></van-image>
                </div>


            </div>
            <!-- 四张图片 -->
            <div class="w-full grid grid-cols-2 gap-8" v-if="info.pictureList.length == 4">
                <div class="w-full h-120 rounded-[16px] overflow-hidden bg-[#f5f5f5] flex-1"
                    v-for="(item, index) in info.pictureList" :key="index">
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
import { optimizeRichText } from '@/utils/richText';
import local from '@/utils/local';
import { showImagePreview as previewImage } from 'vant';

const content = ref(``)
const info = ref({
    content:"",
    pictureList:[]
})
const showImagePreview = (index) => {
    previewImage({
        images: info.value.pictureList,
        startPosition: index
    })
}
onMounted(() => {
    const item = local.getlocal('newDetail')
    if (item) {

        info.value = item
        info.value.content = optimizeRichText(item.content)
        // info.value.couponId = 5
    }
})
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