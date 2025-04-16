<template>
  <div class="notice flex" >
    <van-image
        :src="JPHorn"
        class="icon"
    />
    <div class="notice-content"></div>
    <van-image
        :src="more"
        class="icon"
    />
  </div>
</template>
<script setup>
import JPHorn from '../../../assets/JPHorn.png'
import more from '../../../assets/more.png'

</script>
<style lang="less">
.notice {
  width: 100%;
  border-radius: 30px;
  align-items:center;
  padding: 0 12px;
  background:var(--banner-bg);
  .icon{
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  .notice-content{
    height: 30px;
    flex:1;
  }
}
</style>
