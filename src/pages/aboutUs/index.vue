<template>
  <div class="aboutUs p-12">
    <div class="about-us-content" v-html="optimizeRichText(data)"></div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { indexInfo } from "@/api/market";
import {optimizeRichText} from "@/utils/richText"
const data = ref();
const getData = async () => {
  const res = await indexInfo();
  data.value = res.data.aboutUs || '';
  console.log(res.data);
};
getData();
</script>
<route lang="json5">
{
  name: 'aboutUs',
  meta: {
    i18n: 'Sobre Nós',
  },
}
</route>
<style lang="less" scoped>
.aboutUs {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}
</style>
