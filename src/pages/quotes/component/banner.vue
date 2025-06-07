<template>
  <div class="banner">
    <van-swipe :autoplay="3000" indicator-color="var(--theme-color)" class="w-full">
      <!-- <van-swipe-item v-for="(item, index) in banner" :key="index">
        <img :src="item.url" class="swipe-img" />
      </van-swipe-item> -->
      <van-swipe-item class="rounded-10px overflow-hidden">
        <!-- <div class="w-full h-160px video-bg relative">
          <video autoplay muted loop
            style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -1;">
            <source src="@/assets/bannerVideo.mp4" type="video/mp4">
          </video>

        </div> -->
        <video src="@/assets/bannerVideo.mp4" autoplay="true" muted loop webkit-playsinline='true' playsinline='true'
          :controls="false" class="swipe-img h-full!" />
      </van-swipe-item>

    </van-swipe>
  </div>
</template>
<script lang="ts" setup>
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
</script>
<style lang="less">
.banner {
  width: calc(100% - 24px);
  margin: 0 auto;
  min-height: 160px;
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
