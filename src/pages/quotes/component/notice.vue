<script setup>
import JPHorn from '../../../assets/JPHorn.png'
import more from '../../../assets/more.png'

const props = defineProps({
  data: {},
})
const emits = defineEmits(['clickNotice'])
function handleClickNotice() {
  emits('clickNotice')
}
</script>

<template>
  <div class="notice flex" @click="handleClickNotice">
    <van-image :src="JPHorn" class="icon" />

    <van-notice-bar scrollable :text="data.noticeContent" class="notice flex-1" />
    <van-image :src="more" class="icon" />
  </div>
</template>

<style lang="less">
.notice {
  width: 100%;
  border-radius: 30px;
  align-items: center;
  padding: 0 12px;
  background: var(--banner-bg);

  .icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .notice-content {
    flex: 1;
    overflow-x: auto;
    white-space: nowrap;
    height: 30px;
    flex: 1;
    line-height: 27px;
  }
}

.notice {
  color: #fff;
}
</style>
