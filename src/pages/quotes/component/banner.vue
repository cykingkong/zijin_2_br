<template>
  <div class="banner" />
</template>
<script lang="ts" setup>
const props = defineProps({
  banner: {
    type: String,
    default: () => []
  }
})
</script>
<style lang="less">
.banner {
  width: calc(100% - 24px);
  margin: 0 auto;
  min-height: 160px;
  border-radius: 8px;
  background: var(--banner-bg);
  border: 1px solid var(--van-border-color);
}
</style>
