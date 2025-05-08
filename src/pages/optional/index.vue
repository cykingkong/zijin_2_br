<template>
  <div class="optional-content">
    <VanNavBar title="" clickable placeholder :left-arrow="false">
      <template #left>
        <div class="flex flex-items-center gap-6 font-size-22" @click="handleClickPop">
          <van-icon name="wap-nav" color="white" class="font-size-22" /> {{ $t('menus.optional') }}
        </div>
      </template>
      <template #right>
        <van-icon name="search" class="font-size-22" color="white" />
      </template>
    </VanNavBar>
    <section class="pb-20">
      <div class="top flex flex-justify-between flex-items-center  p-12">
        <div class="flex flex-items-center gap-6 ">
          <van-icon name="edit"></van-icon>
          编辑列表
        </div>
        <div class="flex flex-items-center gap-6">
          最新价 <van-icon name="arrow-down" color="white" />
        </div>
      </div>
      <div class="content p-12">
        <div class="add-title flex flex-items-center font-size-14 gap-4">
          <van-icon name="add"></van-icon>
          添加股票
        </div>
        <empty></empty>
      </div>
    </section>


    <!-- Popup -->
    <van-popup v-model:show="popVisible" position="left" :style="{ width: '80%', height: '100%' }">
      <div class="pop-content flex-col flex pt-24">
        <div class="pop-th flex-justify-between flex font-size-18 text-white  px-12">
          <div class="th-item font-size-18">我的自选</div>
        </div>
        <div class="tab-list my-12">
          <div class="tab h-60 line-height-60 text-left font-size-14 px-12" v-for="i in 100"
            :class="{ 'tab-active ': i == tabActive }" @click="tabActive = i">{{ i == 1 ?
              '全部股票'
              : "我的自选" + i }}</div>
        </div>
        <div class="footer fixed bottom-0 left-0 w-full h-60 flex ">
          <div class="flex flex-1 flex-items-center flex-justify-center gap-4">
            <van-icon name="edit"></van-icon>
            管理组合
          </div>
          <div class="flex flex-1 flex-items-center flex-justify-center gap-4">
            <van-icon name="add"></van-icon>
            添加列表
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue"
const popVisible = ref(false)
const tabActive = ref(1)
const handleClickPop = () => {
  popVisible.value = !popVisible.value
}



</script>
<route lang="json5">
    {
      name: 'optional',
      meta: {
        title: 'optional',
        i18n: 'menus.optional'
      },
    }
</route>
<style lang="less" scoped>
.tab-list {
  background: var(--bg-main);
  height: calc(100vh - 122px);
  overflow-y: auto;

  .tab {
    border-left: 4px solid var(--bg-main);
    transition: all 0.3;
  }

  .tab-active {
    background: rgb(51, 75, 142);
    color: #1678FF;
    border-left: 4px solid #1678FF
  }
}

.footer {
  border-top: 1px solid var(--border_color);

  .flex {
    &:first-of-type {
      border-right: 1px solid var(--border_color);
    }
  }

}

.add-title {
  color: var(--color_main)
}

.top {
  color: #747a8f
}
</style>
