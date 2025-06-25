<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps({
  noTips: {
    type: Boolean,
    default: false,
  },
  tipsText: {
    type: String,
    default: 'No more',
  },
})
const { t } = useI18n()
</script>

<template>
  <div class="empty flex flex-col gap-8 flex-items-center px-12 py-24">
    <img src="@/assets/image/no-data.png" alt="" class="block w-full">
    <div v-if="!noTips" class="font-size-14px font-extralight">
      {{ t(tipsText) }}
    </div>
  </div>
</template>

<style lang="less" scoped></style>
