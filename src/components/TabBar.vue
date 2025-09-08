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
    name: "Home",
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
    name: "Profile",
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
        <!-- Home -->
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          :class="props.active ? 'active' : ''" v-if="item.name == 'Home'">
          <path
            d="M19.7 8.71001L14.367 4.56201C13.899 4.19792 13.323 4.00024 12.73 4.00024C12.137 4.00024 11.561 4.19792 11.093 4.56201L5.759 8.71001C5.43844 8.9593 5.17909 9.27854 5.00076 9.64336C4.82242 10.0082 4.72981 10.4089 4.73 10.815V18.015C4.73 18.5454 4.94071 19.0542 5.31579 19.4292C5.69086 19.8043 6.19957 20.015 6.73 20.015H18.73C19.2604 20.015 19.7691 19.8043 20.1442 19.4292C20.5193 19.0542 20.73 18.5454 20.73 18.015V10.815C20.73 9.99201 20.35 9.21501 19.7 8.71001Z"
            stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16.7 15C14.49 16.333 10.908 16.333 8.7 15" stroke="#6B39F4" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <!-- Market -->
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="item.name == 'Market'" :class="props.active ? 'active' : ''">
          <path d="M3.10001 12H8.10001L12.1 20V4L16.1 12H21.1" stroke="#94A3B8" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <!-- Wallet -->
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="item.name == 'Wallet'" :class="props.active ? 'active' : ''">
          <path
            d="M17.9 8V5C17.9 4.73478 17.7947 4.48043 17.6071 4.29289C17.4196 4.10536 17.1652 4 16.9 4H6.90002C6.36959 4 5.86088 4.21071 5.48581 4.58579C5.11074 4.96086 4.90002 5.46957 4.90002 6M4.90002 6C4.90002 6.53043 5.11074 7.03914 5.48581 7.41421C5.86088 7.78929 6.36959 8 6.90002 8H18.9C19.1652 8 19.4196 8.10536 19.6071 8.29289C19.7947 8.48043 19.9 8.73478 19.9 9V12M4.90002 6V18C4.90002 18.5304 5.11074 19.0391 5.48581 19.4142C5.86088 19.7893 6.36959 20 6.90002 20H18.9C19.1652 20 19.4196 19.8946 19.6071 19.7071C19.7947 19.5196 19.9 19.2652 19.9 19V16"
            stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M20.9 12V16H16.9C16.3696 16 15.8609 15.7893 15.4858 15.4142C15.1107 15.0391 14.9 14.5304 14.9 14C14.9 13.4696 15.1107 12.9609 15.4858 12.5858C15.8609 12.2107 16.3696 12 16.9 12H20.9Z"
            stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <!-- Profile -->
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg"
          v-if="item.name == 'Profile'" :class="props.active ? 'active' : ''">
          <path
            d="M12.3 11C14.5092 11 16.3 9.20914 16.3 7C16.3 4.79086 14.5092 3 12.3 3C10.0909 3 8.30002 4.79086 8.30002 7C8.30002 9.20914 10.0909 11 12.3 11Z"
            stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M6.30002 21V19C6.30002 17.9391 6.72145 16.9217 7.47159 16.1716C8.22174 15.4214 9.23915 15 10.3 15H14.3C15.3609 15 16.3783 15.4214 17.1284 16.1716C17.8786 16.9217 18.3 17.9391 18.3 19V21"
            stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>



        <!-- <img :src="props.active ? item.onIcon : item.offIcon" v-else /> -->

      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<style lang="less" scoped>
.active {
  path {
    stroke: #693CFF !important;
  }
}
</style>