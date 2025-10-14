<template>
  <div class="grid-box w-full px-24px mt-24px">
    <div class="grid flex">
      <div class="grid-item flex-1 text-center" v-for="(item, index) in gridList" :key="index"
        @click="handleClickItem(index)">
        <!-- <img :src="item.image" alt="" class="w-56px h-56px mx-auto block" /> -->
        <div class="w-56px h-56px mx-auto block svg flex items-center justify-center">
          <svg class="w-24px h-24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="index == 0">
            <path d="M7 18V9" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path d="M12 18V6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path d="M17 18V13" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path
              d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
              stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg class="w-28px h-28px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="index == 1">
            <path
              d="M3.02906 13.0786C2.70318 12.3968 2.70318 11.6042 3.02906 10.9224C3.16995 10.6276 3.41022 10.3457 3.89074 9.78182C4.082 9.5574 4.17762 9.44518 4.25795 9.32534C4.44207 9.05063 4.56986 8.74211 4.63392 8.41767C4.66186 8.27613 4.67359 8.12917 4.69704 7.83524C4.75598 7.09674 4.78544 6.72748 4.89426 6.41942C5.14593 5.70689 5.70639 5.14643 6.41891 4.89476C6.72698 4.78595 7.09623 4.75648 7.83474 4.69755C8.12866 4.67409 8.27562 4.66236 8.41716 4.63442C8.74161 4.57037 9.05013 4.44257 9.32484 4.25845C9.44468 4.17813 9.55689 4.0825 9.78131 3.89125C10.3452 3.41072 10.6271 3.17045 10.9219 3.02956C11.6037 2.70369 12.3963 2.70369 13.0781 3.02956C13.3729 3.17045 13.6548 3.41072 14.2187 3.89125C14.4431 4.0825 14.5553 4.17813 14.6752 4.25845C14.9499 4.44257 15.2584 4.57037 15.5828 4.63442C15.7244 4.66236 15.8713 4.67409 16.1653 4.69755C16.9038 4.75648 17.273 4.78595 17.5811 4.89476C18.2936 5.14643 18.8541 5.70689 19.1057 6.41942M4.89426 17.5816C5.14593 18.2941 5.70639 18.8546 6.41891 19.1062C6.72698 19.2151 7.09623 19.2445 7.83474 19.3035C8.12866 19.3269 8.27563 19.3386 8.41716 19.3666C8.74161 19.4306 9.05013 19.5584 9.32484 19.7426C9.44468 19.8229 9.55689 19.9185 9.78131 20.1098C10.3452 20.5903 10.6271 20.8305 10.9219 20.9714C11.6037 21.2973 12.3963 21.2973 13.0781 20.9714C13.3729 20.8305 13.6548 20.5903 14.2187 20.1098C14.4431 19.9185 14.5553 19.8229 14.6752 19.7426C14.9499 19.5584 15.2584 19.4306 15.5828 19.3666C15.7244 19.3386 15.8713 19.3269 16.1653 19.3035C16.9038 19.2445 17.273 19.2151 17.5811 19.1062C18.2936 18.8546 18.8541 18.2941 19.1057 17.5816C19.2146 17.2735 19.244 16.9043 19.3029 16.1658C19.3264 15.8718 19.3381 15.7249 19.3661 15.5833C19.4301 15.2589 19.5579 14.9504 19.742 14.6757C19.8224 14.5558 19.918 14.4436 20.1092 14.2192C20.5898 13.6553 20.83 13.3734 20.9709 13.0786C21.2968 12.3968 21.2968 11.6042 20.9709 10.9224"
              stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path d="M9 15L15 9" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path
              d="M15.5 14.5C15.5 15.0523 15.0523 15.5 14.5 15.5C13.9477 15.5 13.5 15.0523 13.5 14.5C13.5 13.9477 13.9477 13.5 14.5 13.5C15.0523 13.5 15.5 13.9477 15.5 14.5Z"
              fill="#1C274C" />
            <path
              d="M10.5 9.5C10.5 10.0523 10.0523 10.5 9.5 10.5C8.94772 10.5 8.5 10.0523 8.5 9.5C8.5 8.94772 8.94772 8.5 9.5 8.5C10.0523 8.5 10.5 8.94772 10.5 9.5Z"
              fill="#1C274C" />
          </svg>
          <svg class="w-24px h-24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="index == 2">
            <path
              d="M6 8V7.25C5.58579 7.25 5.25 7.58579 5.25 8H6ZM10 8.75C10.4142 8.75 10.75 8.41421 10.75 8C10.75 7.58579 10.4142 7.25 10 7.25V8.75ZM10 12.75C10.4142 12.75 10.75 12.4142 10.75 12C10.75 11.5858 10.4142 11.25 10 11.25V12.75ZM18.6 8.45C18.8485 8.11863 18.7814 7.64853 18.45 7.4C18.1186 7.15147 17.6485 7.21863 17.4 7.55L18.6 8.45ZM11.4 15.55C11.1515 15.8814 11.2186 16.3515 11.55 16.6C11.8814 16.8485 12.3515 16.7814 12.6 16.45L11.4 15.55ZM12.6 7.55C12.3515 7.21863 11.8814 7.15147 11.55 7.4C11.2186 7.64853 11.1515 8.11863 11.4 8.45L12.6 7.55ZM17.4 16.45C17.6485 16.7814 18.1186 16.8485 18.45 16.6C18.7814 16.3515 18.8485 15.8814 18.6 15.55L17.4 16.45ZM5.25 16C5.25 16.4142 5.58579 16.75 6 16.75C6.41421 16.75 6.75 16.4142 6.75 16H5.25ZM6 8.75H10V7.25H6V8.75ZM6 12.75H10V11.25H6V12.75ZM17.4 7.55L14.4 11.55L15.6 12.45L18.6 8.45L17.4 7.55ZM14.4 11.55L11.4 15.55L12.6 16.45L15.6 12.45L14.4 11.55ZM11.4 8.45L14.4 12.45L15.6 11.55L12.6 7.55L11.4 8.45ZM14.4 12.45L17.4 16.45L18.6 15.55L15.6 11.55L14.4 12.45ZM5.25 8V12H6.75V8H5.25ZM5.25 12V16H6.75V12H5.25Z"
              fill="#1C274C" />
            <path
              d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
              stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <svg class="w-24px h-24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="index == 3">
            <path d="M7 8L7 9M7 16L7 12" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path
              d="M12 12C12 10.8954 12.8954 10 14 10C15.1046 10 16 10.8954 16 12C16 13.1046 15.1046 14 14 14C12.8954 14 12 13.1046 12 12Z"
              stroke="#1C274C" stroke-width="1.5" />
            <path d="M16 10L17 9" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path d="M11 15L12 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path d="M12 10L11 9" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path d="M17 15L16 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
            <path
              d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
              stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>

        <p class="text-14px text-#64748B mt-12px">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
// import grid1 from "@/assets/grid/grid1.jpg";
// import grid2 from "@/assets/grid/grid2.jpg";
// import grid3 from "@/assets/grid/grid3.jpg";
// import grid4 from "@/assets/grid/grid4.jpg";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps({
  categoryId: {
    type: Number,
    default: 0,
  },
});

const gridList = ref([
  {
    name: t("Stock"),
    // image: grid1,
  },
  {
    name: t("Discount"),
    // image: grid2,
  },
  {
    name: t("Fund"),
    // image: grid3,
  },
  {
    name: t("IPO"),
    // image: grid4,
  },
]);
const emits = defineEmits(["handleClickGrid"]);
const handleClickItem = (k) => {
  emits("handleClickGrid", k);
};
</script>
<style lang="less">
.grid-content {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 12px 0;
  gap: 12px;
  // background: #131a2e;

  .grid-item {
    flex: 1;
    // height: 75px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    font-size: 16px;

    .grid-img {
      width: 48px;
      height: 48px;



      img {
        width: 100%;
        height: 100%;
      }
    }



    .grid-text {
      color: var(--van-text);
      word-break: break-word;
    }
  }
}

.svg {
  border-radius: 50%;
  border: 1px solid #E2E8F0;
}
</style>
