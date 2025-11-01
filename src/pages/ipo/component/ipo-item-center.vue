<template>
  <div class="li  w-full  text-blueGray-400">
    <div class="l  font-size-16 w-full flex  justify-between mb-12 gap-20">
      <div class="num font-500 max-w-[100px]">{{ t('Scheduled time') }}</div>
      <div class="label text-right whitespace-nowrap">{{item.sub_time_begin}} ～  {{ item.sub_time_end}}</div>
    </div>
    <div class="r  font-size-16  w-full flex  justify-between gap-20">
      <div class="num font-500 max-w-[100px]">{{ t("Draw time") }}</div>
      <div class="label text-right whitespace-nowrap">{{item.won_time_begin}} ~ {{ item.won_time_end }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import dayjs from "dayjs";
const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object as () => any,
  },
});
const subTime = computed(()=>{
  const items = props.item
  console.log(items)
    let  formatBeginTime =dayjs(items.sub_time_begin||'').format('DD/YY')
    let formatEndTime = dayjs(items.sub_time_end||'').format('DD/YY')
  return `${formatBeginTime} ~ ${formatEndTime}`
})
</script>
<style lang="less" scoped>
.li {
 
}
</style>
