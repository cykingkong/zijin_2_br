<template>
  <div class="li flex w-full items-center justify-between text-blueGray-400">
    <div class="l flex-1 font-size-16">
      <div class="num font-500">{{ t('Scheduled time') }}</div>
      <div class="label">18/06 ~ 20/06</div>
    </div>
    <div class="r flex-1 font-size-16">
      <div class="num font-500">{{ t("Draw time") }}</div>
      <div class="label">20/06</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object as () => any,
  },
});
</script>
<style lang="less" scoped>
.li {
  div {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
}
</style>
