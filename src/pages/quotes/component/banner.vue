<template>
  <div class="banner">
    <van-swipe :autoplay="3000" indicator-color="var(--theme-color)" class="w-full">
      <!-- <van-swipe-item v-for="(item, index) in banner" :key="index">
        <img :src="item.url" class="swipe-img" />
      </van-swipe-item> -->
      <van-swipe-item class="rounded-10px overflow-hidden h-auto!">

        <!-- <video  :autoplay="false" muted loop :webkit-playsinline="true"
          :playsinline="true"   /> -->

        <!-- <video ref="videoRef" muted playsinline loop webkit-playsinline x5-playsinline="true" x-webkit-airplay="deny"
          disablePictureInPicture :controls="false" class="swipe-img h-full!" @click="togglePlay">
          <source src="@/assets/bannerVideo.mp4?playsinline=1" type="video/mp4">
        </video> -->


      </van-swipe-item>

    </van-swipe>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'

interface BannerItem {
  url: string
}

const props = defineProps({
  banner: {
    type: Array as PropType<BannerItem[]>,
    default: () => []
  }
})

const videoRef = ref<HTMLVideoElement | null>(null)
const isPlaying = ref(false)

const togglePlay = () => {
  if (!videoRef.value) return

  if (isPlaying.value) {
    videoRef.value.pause()
  } else {
    videoRef.value.play().catch(e => console.error('Video play failed:', e))
  }

  isPlaying.value = !isPlaying.value
}
</script>
<style lang="less">
.banner {
  width: calc(100% - 24px);
  margin: 0 auto;
  // min-height: 160px;
  // border-radius: 8px;
  // background: var(--banner-bg);
  // border: 1px solid var(--van-border-color);
  overflow: hidden;

  .swipe-img {
    width: 100%;
    height: 160px;
    object-fit: cover;
  }
}
</style>
