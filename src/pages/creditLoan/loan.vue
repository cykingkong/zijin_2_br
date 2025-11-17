<template>
    <div class="loan bg-#0F172A min-h-100vh p-24">
         <VanNavBar title="" :fixed="true" clickable :left-arrow="true" placeholder @click-left="onBack" z-index="999"
        class="transparent-navbar">
        <template #title>
         {{t('loan')}}
        </template>
      </VanNavBar>
        <div class="loan-content bg-#fff rounded-24 p-24">
            <img src="@/assets/image/loan.png" alt="" class="block mx-auto w-48">
            <!-- 待还金额 -->
            {{ t('Amount Due') }} 
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const pay_price = ref('1000000')
</script>

<style scoped lang="less">
// 透明导航栏样式
.transparent-navbar {
  background: transparent !important;
  --van-border-color: transparent !important;

  :deep(.van-nav-bar) {
    background: transparent !important;
    border-bottom: none !important;
  }

  :deep(.van-nav-bar__content) {
    background: transparent !important;
  }

  :deep(.van-nav-bar__title) {
    color: white !important;
  }

  :deep(.van-icon) {
    color: white !important;
  }
}
</style>
<route lang="json5">
{
  name: 'loan',
  meta: {
    title: 'loan',
    i18n: 'loan'
  },
}
</route>
