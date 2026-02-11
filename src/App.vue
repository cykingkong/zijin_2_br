<script setup lang="ts">
import useRouteCache from "@/stores/modules/routeCache";
import { Overlay, showLoadingToast, closeToast } from "vant";
import { useLoadingStore } from "@/stores/modules/loading";
import { useUserStore } from "@/stores";

import { useStore } from "@/stores/modules/index";
import { navTitleStore } from "@/stores/index";
import { getKfUrl } from '@/api/user'

import Socket from "./utils/Socket";
const navStore = navTitleStore();
const loadingStore = useLoadingStore();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
let ws = null;
useHead({
  title: "SIGNET",
  meta: [
    {
      name: "description",
      content: "An mobile web apps ",
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
const handleClickKf  = async ()=>{
  try{
    const {data,code} = await getKfUrl({
      userId:userInfo.value.userId?userInfo.value.userId: 0
    })
    if (code == 200) {
        window.open(data.kfUrl)
      }
  }catch(e){
    console.log(e)
  }
}


onMounted(() => {
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
  <div class="glass-btn w-40 h-40 fixed right-3 bottom-130" @click="handleClickKf">
    <svg class=" fill-[#25D366]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 221.9-99.6 221.9-222 0-59.3-23.2-115.1-64.9-157zM223.9 438.6c-32.6 0-64.5-8.8-93-25.6l-6.7-4-69.1 18.1 18.4-67.4-4.4-6.9c-18.5-29.4-28.3-63.3-28.3-98.9 0-101.6 82.7-184.3 184.3-184.3 49.2 0 95.3 19.2 130.1 54.1 34.8 34.8 54.1 80.9 54.1 130.1 0 101.6-82.7 184.3-184.3 184.3zm101.5-138.4c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg> 
  </div>
   
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

        /* 毛玻璃按钮核心样式 */  
        .glass-btn {  
            display: inline-flex;  
            justify-content: center;  
            align-items: center;  
            width: 40px;  
            height: 40px;  
            border-radius: 12px; /* 现代感的超圆角矩形 */  
            text-decoration: none;  
              
            /* 毛玻璃核心代码 */  
            background: rgba(255, 255, 255, 0.4); /* 极淡的白色半透明背景 */  
            backdrop-filter: blur(15px); /* 背景高斯模糊 */  
            -webkit-backdrop-filter: blur(15px); /* Safari 兼容 */  
            border: 1px solid rgba(255, 255, 255, 0.3); /* 半透明光感边框 */  
              
            box-shadow:   
                0 8px 32px 0 rgba(31, 38, 135, 0.45), /* 柔和的投影 */  
                inset 0 0 0 1px rgba(255,255,255,0.1); /* 内部微光 */  
  
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);  
        }  
  
        /* SVG 图标样式 */  
        .glass-btn svg {  
            width: 55%;  
            height: 55%;  
            /* 使用经典的 WhatsApp 绿，但在玻璃背景下显得更通透 */  
            fill: #25D366;   
            filter: drop-shadow(0 4px 6px rgba(37, 211, 102, 0.3)); /* 绿色辉光阴影 */  
            transition: all 0.4s ease;  
        }  
  
        /* 鼠标悬停效果 */  
        .glass-btn:hover {  
            /* 增加不透明度和模糊度 */  
            background: rgba(255, 255, 255, 0.2);  
            backdrop-filter: blur(20px);  
            -webkit-backdrop-filter: blur(20px);  
            border: 1px solid rgba(255, 255, 255, 0.5);  
              
            box-shadow:   
                0 15px 45px 0 rgba(31, 38, 135, 0.25),  
                inset 0 0 15px rgba(255,255,255,0.2);  
        }  
          
        .glass-btn:hover svg {  
            transform: scale(1.1); /* 图标轻微放大 */  
            filter: drop-shadow(0 6px 10px rgba(37, 211, 102, 0.5)); /* 增强辉光 */  
        }  
</style>
