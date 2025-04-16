<template>
  <div class="grid-content">
    <div v-for="(i,k) in gridList" :key="k" class="grid-item" >
        <div class="grid-img">
            <img :src="i.icon" alt="">
        </div>
        <div class="grid-text">
            {{ i.label }}
        </div>
    </div>
  </div>
</template>
<script setup>
import grid1 from '@/assets/theme/dark/image/etfNav/icon1-1.png'
import grid2 from '@/assets/theme/dark/image/etfNav/icon4-4.png'

    const gridList = [
        {
            label:'grid1',
            icon:grid1,
        },
        {
            label:'grid2',
            icon:grid2,
        },
        {
            label:'grid2',
            icon:grid2,
        },
        {
            label:'grid1',
            icon:grid1,
        },
        {
            label:'grid2',
            icon:grid2,
        },
        {
            label:'grid1',
            icon:grid1,
        },

    ]
</script>
  <style lang="less">
  .grid-content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
padding:12px 0;

  background: var(--banner-bg);
  .grid-item {
    flex: 1;
    height: 75px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap:6px;
    font-size: 16px;
    .grid-img{
        width: 48px;
        height: 48px;
        img{
            width:100%;
            height: 100%;
        }
    }
    .grid-text{
        color:var(--van-text)
    }
  }
}
</style>
