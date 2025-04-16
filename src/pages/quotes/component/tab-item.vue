<script setup>

</script>

<template>
  <div class="tab-item">
    <div class="indicator-content flex">
      <div v-for="i in 3" :key="i" class="indicator-item" :class="i % 2 === 1 ? 'up-bg' : 'down-bg'" >
        <div class="title">title</div>
        <div class="num">num</div>
        <div class="value">value</div>
        <div class="chart"></div>
      </div>
    </div>
    <slot />
  </div>
</template>

<style lang="less">
.tab-item {
  width: 100%;
  height: 100vh;
  padding: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  .indicator-content {
    width: 100%;
    gap: 6px;
    padding: 0 12px;
    .indicator-item {
      flex: 1;
      height: auto;
      border-radius: 8px;
      padding:12px ;

      .title{
        font-size: 12px;
        color:var(--van-text);
        line-height: 16px;
      }
      .num{
        font-size: 16px;
        line-height: 24px;

      }
      .value{
        font-size: 12px;
        line-height: 24px;

      }
      
    }
    .up-bg {
      background-image: var(--up-bg);
      .num{
        color:#06cda5!important
      }
      .chart{
        background: #06cda5!important;
        width: 100%;
        height: 55px;
      }
    }
    .down-bg {
      background-image: var(--down-bg);
      .num{
        color:#f43368!important
      }
      .chart{
        background: #f43368!important;
        width: 100%;
        height: 55px;
      }
    }
  }
}
</style>
