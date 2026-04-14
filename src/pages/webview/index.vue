<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const safeUrl = computed(() => {
  const rawUrl = Array.isArray(route.query.url) ? route.query.url[0] : route.query.url
  if (!rawUrl)
    return ''

  try {
    const decodedUrl = decodeURIComponent(String(rawUrl))
    const parsedUrl = new URL(decodedUrl)

    if (!['http:', 'https:'].includes(parsedUrl.protocol))
      return ''

    return parsedUrl.toString()
  }
  catch {
    return ''
  }
})

function handleBack() {
  router.replace('/profile')
}
</script>

<template>
  <div class="webview-page">
    <VanNavBar
      class="webview-nav"
      :title="''"
      :fixed="true"
      clickable
      :left-arrow="true"
            placeholder

      z-index="999"
      @click-left="handleBack"
    >
      <template #left>
        <div class="nav-left">
          <div class="nav-icon-wrap">
            <svg class="h-28 w-28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M23.3333 14.3201C23.3333 14.763 23.0041 15.1291 22.577 15.1871L22.4583 15.1951L4.95831 15.1951C4.47506 15.1951 4.08331 14.8033 4.08331 14.3201C4.08331 13.8771 4.41249 13.511 4.83958 13.4531L4.95831 13.4451L22.4583 13.4451C22.9416 13.4451 23.3333 13.8368 23.3333 14.3201Z"
                fill="#fff"
              />
              <path
                d="M12.6338 20.7284C12.9762 21.0694 12.9774 21.6234 12.6365 21.9658C12.3265 22.2771 11.8404 22.3064 11.4974 22.053L11.399 21.9685L4.3407 14.9405C4.02846 14.6296 4.00005 14.1418 4.2555 13.7987L4.34065 13.7004L11.399 6.67126C11.7414 6.33026 12.2954 6.33141 12.6364 6.67382C12.9464 6.98511 12.9737 7.47128 12.7188 7.8133L12.6339 7.91126L6.19848 14.3208L12.6338 20.7284Z"
                fill="#fff"
              />
            </svg>
          </div>
          <div class="nav-copy">
            <div class="nav-eyebrow">
              {{ $t('Payment') }}
            </div>
            <div class="nav-title">
              {{ $t('Payment Page') }}
            </div>
          </div>
        </div>
      </template>
    </VanNavBar>

    <iframe
      v-if="safeUrl"
      class="webview-frame"
      :src="safeUrl"
      title="payment-webview"
    />
    <div v-else class="webview-empty">
      {{ $t('Invalid payment link') }}
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'webview',
  meta: {
    i18n: ''
  },
}
</route>
<style lang="less" scoped>
.webview-page {
  min-height: 100vh;
  background: #050505;
  color: #f5f5f5;
}

:deep(.van-nav-bar) {
--van-nav-bar-background: rgba(8, 8, 8, 0.92);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(16px);
}

.webview-nav :deep(.van-nav-bar)::after {
  border-color: rgba(255, 255, 255, 0.06);
}

.webview-nav :deep(.van-nav-bar__content) {
  padding-inline: 20px;
}

.webview-nav :deep(.van-nav-bar__left) {
  left: 0;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(124, 255, 178, 0.18);
  border-radius: 14px;
  background: rgba(124, 255, 178, 0.08);
  box-shadow: inset 0 0 0 1px rgba(124, 255, 178, 0.12), 0 0 18px rgba(124, 255, 178, 0.14);
  backdrop-filter: blur(14px);
}

.nav-copy {
  display: grid;
  gap: 2px;
}

.nav-eyebrow {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8bffbe;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.25;
  color: #f5f5f5;
}

.webview-frame {
  display: block;
  width: 100%;
  height: calc(100vh - 46px);
  border: 0;
  background: #fff;
}

.webview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 46px);
  padding: 24px;
  color: #a3a3a3;
  text-align: center;
}
</style>
