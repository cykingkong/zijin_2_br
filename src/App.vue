<script setup lang="ts">
import useRouteCache from '@/stores/modules/routeCache'
import { Overlay, Loading } from 'vant'
import { useLoadingStore } from '@/stores/modules/loading'

const loadingStore = useLoadingStore()

useHead({
  title: 'Vue3 Vant Mobile',
  meta: [
    {
      name: 'description',
      content: 'An mobile web apps template based on the Vue 3 ecosystem',
    },
    {
      name: 'theme-color',
      content: () => isDark.value ? '#00aba9' : '#ffffff',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: () => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg',
    },
  ],
})

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[]
})

const mode = computed(() => {
  return isDark.value ? 'dark' : 'light'
})
</script>

<template>
  <van-config-provider :theme="mode">
    <nav-bar />
    <router-view v-slot="{ Component }">
      <section class="app-wrapper">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" />
        </keep-alive>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>

  <Overlay :show="loadingStore.showGlobalLoading" class="overlay">
    <!-- <Loading type="spinner" size="24px" vertical></Loading> -->
  </Overlay>
</template>

<style scoped>
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  padding: 0px;
}
</style>
