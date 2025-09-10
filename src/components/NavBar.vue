<script setup lang="ts">
import { routeWhiteList, navWhiteList } from "@/config/routes";
import { navTitleStore } from "@/stores/index";
const navStore = navTitleStore();

const route = useRoute();
const router = useRouter();

// 跟踪是否是首次加载
const isFirstLoad = ref(true);

function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}

const { t } = useI18n();

const title = computed(() => {
  if (navStore.navTitle) {
    return navStore.navTitle;
  } else {
    return route.meta.i18n ? t(route.meta.i18n) : route.meta.title || "";
  }
});

const showLeftArrow = computed(() => {
  // 如果是首次加载，隐藏返回按钮
  if (isFirstLoad.value) {
    console.log('首次加载，隐藏返回按钮', { isFirstLoad: isFirstLoad.value, routeName: route.name });
    return true; // 返回true表示隐藏返回按钮
  }
  // 原始逻辑：当路由在routeWhiteList中时，隐藏返回按钮
  const shouldHide = route.name && routeWhiteList.includes(route.name);
  console.log('返回按钮逻辑', {
    isFirstLoad: isFirstLoad.value,
    routeName: route.name,
    shouldHide,
    navStoreShowNavLeft: navStore.showNavLeft
  });
  return shouldHide;
});
const isShowNavBar = computed(() => {
  return route.name && navWhiteList.includes(route.name);
}); // 因为routeWhiteList所有页面都不需要显示，所以这里取反

// 页面加载完成后，允许显示返回按钮
onMounted(() => {
  // 延迟一点确保页面完全加载
  setTimeout(() => {
    isFirstLoad.value = false;
  }, 600);
});
</script>

<template>
  <VanNavBar v-if="!isShowNavBar" :title="title" :fixed="true" clickable placeholder
    :left-arrow="!showLeftArrow && navStore.showNavLeft" @click-left="onBack" />
</template>
