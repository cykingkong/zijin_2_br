<template>
  <div class="webview-container">
    <iframe 
      :src="webviewUrl" 
      style="width: 100%; height: calc(100vh - 46px); border: none;"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const webviewUrl = computed(() => {
  const type = route.query.type
  
  if (type === 'baidu') {
    return 'https://www.baidu.com'
  } else if (type === 'douyin') {
    return 'https://www.douyin.com'
  } else {
    // 默认显示空白页面
    return 'about:blank'
  }
})
</script>

<style scoped>
.webview-container {
  width: 100%;
  height: calc(100vh - 46px);
  overflow: hidden;
}
</style>