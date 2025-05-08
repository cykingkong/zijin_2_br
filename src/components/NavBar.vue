<script setup lang="ts">
import { routeWhiteList,navWhiteList } from '@/config/routes'

const route = useRoute()
const router = useRouter()

function onBack() {
  if (window.history.state.back)
    history.back()
  else
    router.replace('/')
}

const { t } = useI18n()

const title = computed(() => {
  if (!route.meta)
    return ''

  return route.meta.i18n ? t(route.meta.i18n) : (route.meta.title || '')
})

const showLeftArrow = computed(() => route.name && routeWhiteList.includes(route.name))
const isShowNavBar = computed(() => route.name && navWhiteList.includes(route.name)) // 因为routeWhiteList所有页面都不需要显示，所以这里取反
</script>

<template>
  <VanNavBar
  v-if="!isShowNavBar"
    :title="title"
    :fixed="true"
    clickable placeholder
    :left-arrow="!showLeftArrow"
    @click-left="onBack"
  />
</template>
