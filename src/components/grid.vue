<template>
  <div class="grid-box w-full px-24px mt-24px">
    <div class="grid flex">
      <div
        class="grid-item flex-1 text-center"
        v-for="(item, index) in gridList"
        :key="index"
        @click="handleClickItem(index)"
      >
        <img :src="item.image" alt="" class="w-56px h-56px mx-auto block" />
        <p class="text-14px text-#64748B mt-12px">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import grid1 from "@/assets/grid/grid1.jpg";
import grid2 from "@/assets/grid/grid2.jpg";
import grid3 from "@/assets/grid/grid3.jpg";
import grid4 from "@/assets/grid/grid4.jpg";
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
    image: grid1,
  },
  {
    name: t("Discount"),
    image: grid2,
  },
  {
    name: t("Fund"),
    image: grid3,
  },
  {
    name: t("IPO"),
    image: grid4,
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
</style>
