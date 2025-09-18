<template>
  <div class="aboutUs p-12">
    <div class="about-us-content" v-html="data?.content"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { getArticleList } from "@/api/user";
const { proxy } = getCurrentInstance();
import { indexInfo } from "@/api/market";
const data = ref();
const getData = async () => {
  const res = await getArticleList({ key: "about_us" });
  data.value = res.data;
  console.log(res.data);
};
getData();
</script>
<route lang="json5">
{
  meta: {
    i18n: 'AboutUs',
  },
}
</route>
<style lang="less" scoped>
.aboutUs {
  padding-bottom: calc(env(safe-area-inset-bottom) + 20px);
}
</style>
