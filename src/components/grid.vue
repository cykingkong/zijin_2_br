<template>
  <div class="grid-box w-full px-[20px] mt-[24px]">
    <div class="grid  gap-8 grid-cols-4 ">
      <div class="grid-item flex-1 text-center" v-for="(item, index) in gridList" :key="index"
        @click="handleClickItem(index)">
        <div class="w-[54px] h-[54px] mx-auto block svg flex items-center justify-center">
          <img :src="item.image" alt="" class="w-[24px] h-[24px] mx-auto block" />
        </div>
        <p class="text-[11px]  text-[#161616] mt-[12px] text-nowrap">{{ item.name }}</p>
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
    flex-shrink: 0;

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
  border-radius: 16px;
  box-shadow: 0px 10px 34px 0px rgba(0, 0, 0, 0.1);

}

.grid-item {}
</style>
