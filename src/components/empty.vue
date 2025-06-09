<template>
  <div class="empty py-24 flex-col flex gap-8 flex-items-center px-12">
    <img src="@/assets/image/no-data.png" alt="" class="w-full block" />
    <div class="font-size-14px font-extralight" v-if="!noTips">
      {{ tipsText }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
const props = defineProps({
  noTips: {
    type: Boolean,
    default: false,
  },
  tipsText: {
    type: String,
    default: "No more",
  },
});
</script>
<style lang="less" scoped></style>
