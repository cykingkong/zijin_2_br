<script setup lang="ts">
import { routeWhiteList } from "@/config/routes";
import tab1 from "@/assets/tabNav/tab1.png";
import tab1Active from "@/assets/tabNav/tab1-active.png";
import tab2 from "@/assets/tabNav/tab2.png";
import tab2Active from "@/assets/tabNav/tab2-active.png";
import tab3 from "@/assets/tabNav/tab3.png";
import tab3Active from "@/assets/tabNav/tab3-active.png";
import tab4 from "@/assets/tabNav/tab4.png";
import tab4Active from "@/assets/tabNav/tab4-active.png";
import tab5 from "@/assets/tabNav/tab5.png";
import tab5Active from "@/assets/tabNav/tab5-active.png";

const { t } = useI18n();
const active = ref(0);
const route = useRoute();

const show = computed(() => route.name && routeWhiteList.includes(route.name));
const tabList = [
  // {
  //   name: '自选',
  //   path: '/optional',
  //   onIcon: tab1Active,
  //   offIcon: tab1
  // },
  {
    name: "layouts.quotes",
    path: "/",
    onIcon: tab2Active,
    offIcon: tab2,
  },
  {
    name: "Market",
    path: "/market",
    onIcon: tab3Active,
    offIcon: tab3,
  },
  {
    name: "Wallet",
    path: "/wallet",
    onIcon: tab4Active,
    offIcon: tab4,
  },
  {
    name: "layouts.profile",
    path: "/profile",
    onIcon: tab5Active,
    offIcon: tab5,
  },
];
</script>

<template>
  <van-tabbar v-if="show" v-model="active" placeholder route z-index="9999" active-color="#6b39f4">
    <van-tabbar-item replace :to="item.path" v-for="(item, k) in tabList" :key="k">
      {{ t(item.name) }}
      <template #icon="props">
        <img :src="props.active ? item.onIcon : item.offIcon" />
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
