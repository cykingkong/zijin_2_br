<template>
  <div class="grid-box w-full px-[20px] mt-[24px]">
    <div class="grid gap-x-[4px] gap-y-[14px] grid-cols-4">
      <div class="grid-item flex-1 text-center min-w-0" v-for="(item, index) in gridList" :key="index"
        @click="handleClickItem(index)">
        <div class="w-[44px] h-[44px] mx-auto block svg flex items-center justify-center">
          <img :src="item.image" alt="" class="w-[22px] h-[22px] mx-auto block" />
        </div>
        <p class="grid-label mt-[10px]">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import grid1 from "@/assets/grid/grid1.svg";
import grid2 from "@/assets/grid/grid2.svg";
import grid3 from "@/assets/grid/grid3.svg";
import grid4 from "@/assets/grid/grid4.svg";
import grid5 from "@/assets/grid/grid5.svg";
import grid6 from "@/assets/grid/grid6.svg";
import grid7 from "@/assets/grid/grid7.svg";
import grid8 from "@/assets/grid/grid8.svg";
import grid9 from "@/assets/grid/grid9.svg";
import grid10 from "@/assets/grid/grid10.svg";
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
    name: t("Sign in"),
    image: grid1,
  },
  {
    name: t("My team"),
    image: grid2,
  },
  {
    name: t("Invite Friends"),
    image: grid3,
  },
  {
    name: t("APP Download"),
    image: grid4,
  },
  {
    name: t("Weekly salary"),
    image: grid5,
  },
  {
    name: t("Month  salary"),
    image: grid6,
  },
  {
    name: t("Year salary"),
    image: grid7,
  },
  {
    name: t("Task Bonus"),
    image: grid8,
  },
  // {
  //   name: t("One Yuan Treasure"),
  //   image: grid9,
  // },
  // {
  //   name: t("Prize Draw"),
  //   image: grid10,
  // },
]);
const emits = defineEmits(["handleClickGrid"]);
const handleClickItem = (k) => {
  emits("handleClickGrid", k);
};
</script>
<style lang="less">
.grid-label {
  color: #161616;
  font-size: 11px;
  line-height: 1.25;
  text-align: center;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.svg {
  border-radius: 14px;
  box-shadow: 0px 10px 34px 0px rgba(0, 0, 0, 0.1);
}

.grid-item {}
</style>
