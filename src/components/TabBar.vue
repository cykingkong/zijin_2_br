<script setup lang="ts">
import { routeWhiteList } from "@/config/routes";

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
    // onIcon: tab2Active,
    // offIcon: tab2,
  },
  {
    name: "Product",
    path: "/market",
    // onIcon: tab3Active,
    // offIcon: tab3,
  },
  {
    name: "Teams",
    path: "/team",
    // onIcon: tab3Active,
    // offIcon: tab3,
  },
  {
    name: "Message",
    path: "/wallet",
    // onIcon: tab4Active,
    // offIcon: tab4,
  },
  {
    name: "Profile",
    path: "/profile",
    // onIcon: tab5Active,
    // offIcon: tab5,
  },
];
</script>

<template>
  <van-tabbar v-if="show" v-model="active" placeholder route z-index="9999" active-color="#1B1B1B"
    inactiveColor="#888888">
    <van-tabbar-item replace :to="item.path" v-for="(item, k) in tabList" :key="k">
      {{ t(item.name) }}
      <template #icon="props">
        <!-- Home -->

        <svg width="24" height="24" :class="props.active ? 'active' : ''" v-if="item.name == 'Home'" viewBox="0 0 24 24"
          fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 21V13C15 12.7348 14.8946 12.4804 14.7071 12.2929C14.5196 12.1053 14.2652 12 14 12H10C9.73478 12 9.48043 12.1053 9.29289 12.2929C9.10536 12.4804 9 12.7348 9 13V21M3 9.99999C2.99993 9.70906 3.06333 9.42161 3.18579 9.15771C3.30824 8.8938 3.4868 8.65979 3.709 8.47199L10.709 2.47199C11.07 2.1669 11.5274 1.99951 12 1.99951C12.4726 1.99951 12.93 2.1669 13.291 2.47199L20.291 8.47199C20.5132 8.65979 20.6918 8.8938 20.8142 9.15771C20.9367 9.42161 21.0001 9.70906 21 9.99999V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V9.99999Z"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <!-- Product -->

        <svg width="24" height="24" :class="props.active ? 'active' : ''" v-if="item.name == 'Product'"
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M18.064 7H5.93597C5.40897 7 4.97297 7.408 4.93797 7.933L4.14197 19.867C4.06497 21.021 4.98097 22 6.13797 22H17.862C19.019 22 19.935 21.021 19.858 19.867L19.062 7.933C19.027 7.408 18.591 7 18.064 7Z"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M15.001 9V5V5V5C15.001 3.343 13.658 2 12.001 2H12C10.343 2 9 3.343 9 5V5V5V9" stroke="#888888"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12 13.535C12.23 13.283 12.627 13 13.232 13C14.29 13 15 13.931 15 14.798C15 16.611 12.593 18 12 18C11.407 18 9 16.611 9 14.798C9 13.931 9.71 13 10.768 13C11.373 13 11.77 13.283 12 13.535Z"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <!-- Teamss -->
        <svg width="24" height="24" :class="props.active ? 'active' : ''" v-if="item.name == 'Teams'"
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 18C3 15.791 4.791 14 7 14H11C13.209 14 15 15.791 15 18" stroke="#888888" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 4.651C17.381 4.651 18.5 5.77 18.5 7.151C18.5 8.532 17.381 9.651 16 9.651" stroke="#888888"
            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M11.4049 4.99613C12.733 6.3243 12.733 8.4777 11.4049 9.80587C10.0767 11.134 7.9233 11.134 6.59513 9.80587C5.26696 8.4777 5.26696 6.3243 6.59513 4.99613C7.9233 3.66796 10.0767 3.66796 11.4049 4.99613"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17 13C19.209 13 21 14.791 21 17" stroke="#888888" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>


        <!-- Message -->

        <svg width="24" height="24" :class="props.active ? 'active' : ''" v-if="item.name == 'Message'"
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M12 3.99683C7.02789 3.99683 2.99622 7.35691 2.99622 11.497C3.07137 13.9954 4.44922 16.2719 6.62773 17.4972C6.41133 18.0853 6.11043 18.6387 5.7345 19.14C5.527 19.4429 5.53214 19.8436 5.74732 20.1411C5.96251 20.4386 6.34137 20.569 6.69406 20.4668C7.89689 20.1166 9.02904 19.5583 10.0391 18.8173C10.6857 18.9385 11.3422 18.9987 12 18.9973C16.972 18.9973 21.0037 15.6372 21.0037 11.497C21.0037 7.35692 16.972 3.99683 12 3.99683Z"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M12.0885 11.6615C12.1373 11.7104 12.1373 11.7896 12.0884 11.8384C12.0396 11.8872 11.9604 11.8872 11.9116 11.8384C11.8628 11.7896 11.8628 11.7104 11.9116 11.6615C11.9351 11.6381 11.9669 11.6249 12 11.6249C12.0332 11.6249 12.065 11.6381 12.0885 11.6615"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M16.0901 11.6615C16.1389 11.7104 16.1389 11.7896 16.0901 11.8384C16.0413 11.8872 15.9621 11.8872 15.9132 11.8384C15.8644 11.7896 15.8644 11.7104 15.9132 11.6615C15.9367 11.6381 15.9685 11.6249 16.0017 11.6249C16.0348 11.6249 16.0666 11.6381 16.0901 11.6615"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M8.08674 11.6615C8.13558 11.7104 8.13558 11.7896 8.08674 11.8384C8.03791 11.8872 7.95873 11.8872 7.90989 11.8384C7.86106 11.7896 7.86105 11.7104 7.90989 11.6615C7.93334 11.6381 7.96515 11.6249 7.99832 11.6249C8.03148 11.6249 8.06329 11.6381 8.08674 11.6615"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <!-- Profile -->

        <svg width="24" height="24" :class="props.active ? 'active' : ''" v-if="item.name == 'Profile'"
          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18.3639 5.63604C21.8787 9.15076 21.8787 14.8492 18.3639 18.3639C14.8492 21.8787 9.15074 21.8787 5.63604 18.3639C2.12132 14.8492 2.12132 9.15074 5.63604 5.63604C9.15076 2.12132 14.8492 2.12132 18.3639 5.63604"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M17.307 19.257C16.923 17.417 14.705 16 12 16C9.29499 16 7.07699 17.417 6.69299 19.257"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path
            d="M14.1213 7.87868C15.2929 9.05025 15.2929 10.9497 14.1213 12.1213C12.9497 13.2929 11.0502 13.2929 9.87868 12.1213C8.70711 10.9497 8.70711 9.05025 9.87868 7.87868C11.0502 6.70711 12.9497 6.70711 14.1213 7.87868"
            stroke="#888888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>

        <!-- <img :src="props.active ? item.onIcon : item.offIcon" v-else /> -->
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
<style lang="less" scoped>
.active {
  path {
    stroke: #1B1B1B !important;
  }
}
</style>