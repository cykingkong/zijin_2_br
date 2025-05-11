<script setup lang="ts">
import router from '@/router'
import { languageColumns, locale } from '@/utils/i18n'
import { useUserStore } from '@/stores'

const { t } = useI18n()
</script>

<template>
  <div class="news-index">
    <VanNavBar title="" :fixed="true" clickable placeholder :left-arrow="false">
      <template #left>
        {{ t('menus.news') }}
      </template>
      <template #right>
        <van-icon name="service-o" class="icon" />
      </template>
    </VanNavBar>
    <section class="news flex flex-col">
      <van-steps direction="vertical" :active="-1">
        <van-step>
          <p class="time">
            2016-07-12 12:40
          </p>
          <p class="step-content">
            Hari Kedua Arus Masuk ETF BTC Menunjukkan Kepercayaan di Tengah Volatilitas | Berita ETF
          </p>
        </van-step>
      </van-steps>
    </section>
  </div>
</template>

<route lang="json5">
{
  name: 'news',
  meta: {
    title: 'news',
    i18n: 'menus.news'
  },
}
</route>

<style lang="less" scoped>
.icon {
  color: var(--van-text-color);
}

.news-index {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.time {
  color: #747a8f;
}

p {
  color: var(--van-text-color);

  margin: 0;
}

.content {
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--van-gary-1);
  }
}
</style>
