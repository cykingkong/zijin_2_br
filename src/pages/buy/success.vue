<template>
  <div class="buy-success-content bg-white min-h-screen flex flex-col h-[100vh] overflow-hidden">
    <div class="mid w-full flex justify-center flex-col items-center mt-238">
      <svg width="96" height="96" class="w-96 h-96 mt" viewBox="0 0 96 96" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path d="M77.8687 26.7431L48.0002 56.5035L35.8472 44.3505" stroke="#169953" stroke-width="7"
          stroke-linecap="round" stroke-linejoin="round" />
        <path
          d="M81.1499 40.4649C84.7818 56.4355 76.5164 72.7267 61.4834 79.2276C46.4505 85.7285 28.9192 80.5929 19.7701 67.0081C10.621 53.4234 12.4524 35.2474 24.1276 23.7608C35.8028 12.2743 54.0062 10.7392 67.4402 20.1084"
          stroke="#169953" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <div class="t1 text-[18px] font-bold color-[#000]">{{ t('Payment success!') }}</div>
      <div class="t2 text-[16px] font-normal w-[261px] text-center mt-4 color-[#6B6B6B]">
        {{
          t('Thank you! We have successfully received your payment.')
        }}
      </div>
    </div>



    <BottomButton :button-text="t('Done')" color="#1B1B1B"></BottomButton>
  </div>
</template>

<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, onMounted, watch } from "vue";
const { t } = useI18n()
</script>

<style lang="less" scoped></style>
