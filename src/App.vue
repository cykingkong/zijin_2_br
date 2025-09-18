<script setup lang="ts">
import useRouteCache from "@/stores/modules/routeCache";
import { Overlay, showLoadingToast, closeToast } from "vant";
import { useLoadingStore } from "@/stores/modules/loading";
import { useStore } from "@/stores/modules/index";
import { navTitleStore } from "@/stores/index";

import Socket from "./utils/Socket";
const navStore = navTitleStore();
const loadingStore = useLoadingStore();
const store: any = useStore();
let ws = null;
useHead({
  title: "WTT excellent",
  meta: [
    {
      name: "description",
      content: "An mobile web apps template based on the Vue 3 ecosystem",
    },
    {
      name: "theme-color",
      content: "#1f1f1f",
    },
  ],
  link: [
    {
      rel: "icon",
      type: "image/svg+xml",
      href: () => "/favicon.ico",
    },
  ],
});

const keepAliveRouteNames = computed(() => {
  return useRouteCache().routeCaches as string[];
});

const SocketWs = () => {
  ws = new Socket("/wss");
  ws.on("open", () => {
    ws.send({
      action: "Subscribe",
      params: {
        tradingPairsId: 0,
        period: "",
      },
    });
  });
  ws.on("message", (res) => {
    if (res.code == 200 && JSON.stringify(res.data) != "{}" && res.msgType) {
      if (res.data && res.data.length) {
        store?.setklineList(res.data);
      }
    }
  });
  // tradingPairsId.value = props.trading_pair_id
};

onMounted(() => {
  // setTimeout(() => {
  //   localStorage.setItem("vueuse-color-scheme", "dark");
  // }, 80);
  // SocketWs();
});
</script>

<template>
  <van-config-provider>
    <nav-bar />
    <router-view v-slot="{ Component }">
      <section class="app-wrapper">
        <keep-alive :include="keepAliveRouteNames">
          <component :is="Component" />
        </keep-alive>
      </section>
    </router-view>
    <tab-bar />
  </van-config-provider>

  <Overlay :show="loadingStore.showGlobalLoading" class="overlay" z-index="99">
  </Overlay>
</template>

<style scoped>
.overlay {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style scoped>
.app-wrapper {
  width: 100%;
  position: relative;
  padding: 0px;
}
</style>
