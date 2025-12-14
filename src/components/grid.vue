<template>
  <div class="grid-box w-full px-[24px] mt-[24px]">
    <div class="grid flex gap-8">
      <div class="grid-item flex-1 text-center" v-for="(item, index) in gridList" :key="index"
        @click="handleClickItem(index)">
        <!-- <img :src="item.image" alt="" class="w-56px h-56px mx-auto block" /> -->
        <div class="w-[56px] h-[56px] mx-auto block svg flex items-center justify-center">
          <svg class="w-[28px] h-[28px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="index == 0">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M20 8H4C3.448 8 3 8.448 3 9V11C3 11.552 3.448 12 4 12H20C20.552 12 21 11.552 21 11V9C21 8.448 20.552 8 20 8Z"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 21V8" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.696 6.612C14.618 7.734 12.921 8 12.099 8" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12.099 8.00001C12.099 8.00001 11.605 4.88401 12.82 3.62001" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.696 6.612C16.49 5.786 16.49 4.446 15.696 3.62C14.902 2.794 13.615 2.794 12.821 3.62"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.30402 6.612C9.38202 7.734 11.079 8 11.901 8" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M11.901 8.00001C11.901 8.00001 12.395 4.88401 11.18 3.62001" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.304 6.612C7.51 5.786 7.51 4.446 8.304 3.62C9.098 2.794 10.385 2.794 11.179 3.62"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M19 12V20C19 20.552 18.552 21 18 21H6C5.448 21 5 20.552 5 20V12" stroke="#1B1B1B"
              stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-if="index == 1" class="w-[28px] h-[28px]">
            <path
              d="M15.5345 9.46447C17.4871 11.4171 17.4871 14.5829 15.5345 16.5355C13.5819 18.4882 10.416 18.4882 8.46343 16.5355C6.51081 14.5829 6.51081 11.4171 8.46343 9.46447C10.416 7.51184 13.5819 7.51184 15.5345 9.46447"
              stroke="#1B1B1B" stroke-width="1.5093" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M12 13L8.46002 16.54" stroke="#1B1B1B" stroke-width="1.5093" stroke-linecap="round"
              stroke-linejoin="round" />
            <path
              d="M18.7172 6.28282C18.8636 6.42927 18.8636 6.66671 18.7172 6.81315C18.5707 6.9596 18.3333 6.9596 18.1869 6.81315C18.0404 6.66671 18.0404 6.42927 18.1869 6.28282C18.3333 6.13638 18.5707 6.13638 18.7172 6.28282Z"
              fill="#1B1B1B" />
            <path
              d="M18.7172 6.28282C18.8636 6.42927 18.8636 6.66671 18.7172 6.81315C18.5707 6.9596 18.3333 6.9596 18.1869 6.81315C18.0404 6.66671 18.0404 6.42927 18.1869 6.28282C18.3333 6.13638 18.5707 6.13638 18.7172 6.28282"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M5.81314 19.1868C5.95959 19.3332 5.95959 19.5707 5.81314 19.7171C5.66669 19.8636 5.42926 19.8636 5.28281 19.7171C5.13636 19.5707 5.13636 19.3332 5.28281 19.1868C5.42926 19.0404 5.66669 19.0404 5.81314 19.1868Z"
              fill="#1B1B1B" />
            <path
              d="M5.81314 19.1868C5.95959 19.3332 5.95959 19.5707 5.81314 19.7171C5.66669 19.8636 5.42926 19.8636 5.28281 19.7171C5.13636 19.5707 5.13636 19.3332 5.28281 19.1868C5.42926 19.0404 5.66669 19.0404 5.81314 19.1868"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M21.3902 12.7348C21.5366 12.8813 21.5366 13.1187 21.3902 13.2651C21.2437 13.4116 21.0063 13.4116 20.8598 13.2651C20.7134 13.1187 20.7134 12.8813 20.8598 12.7348C21.0063 12.5884 21.2437 12.5884 21.3902 12.7348Z"
              fill="#1B1B1B" />
            <path
              d="M21.3902 12.7348C21.5366 12.8813 21.5366 13.1187 21.3902 13.2651C21.2437 13.4116 21.0063 13.4116 20.8598 13.2651C20.7134 13.1187 20.7134 12.8813 20.8598 12.7348C21.0063 12.5884 21.2437 12.5884 21.3902 12.7348"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M3.14017 12.7348C3.28661 12.8813 3.28661 13.1187 3.14017 13.2651C2.99372 13.4116 2.75628 13.4116 2.60983 13.2651C2.46339 13.1187 2.46339 12.8813 2.60983 12.7348C2.75628 12.5884 2.99372 12.5884 3.14017 12.7348Z"
              fill="#1B1B1B" />
            <path
              d="M3.14017 12.7348C3.28661 12.8813 3.28661 13.1187 3.14017 13.2651C2.99372 13.4116 2.75628 13.4116 2.60983 13.2651C2.46339 13.1187 2.46339 12.8813 2.60983 12.7348C2.75628 12.5884 2.99372 12.5884 3.14017 12.7348"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M18.7172 19.1868C18.8636 19.3332 18.8636 19.5707 18.7172 19.7171C18.5707 19.8636 18.3333 19.8636 18.1869 19.7171C18.0404 19.5707 18.0404 19.3332 18.1869 19.1868C18.3333 19.0404 18.5707 19.0404 18.7172 19.1868Z"
              fill="#1B1B1B" />
            <path
              d="M18.7172 19.1868C18.8636 19.3332 18.8636 19.5707 18.7172 19.7171C18.5707 19.8636 18.3333 19.8636 18.1869 19.7171C18.0404 19.5707 18.0404 19.3332 18.1869 19.1868C18.3333 19.0404 18.5707 19.0404 18.7172 19.1868"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M5.81314 6.28284C5.95959 6.42929 5.95959 6.66672 5.81314 6.81317C5.66669 6.95962 5.42926 6.95962 5.28281 6.81317C5.13636 6.66672 5.13636 6.42929 5.28281 6.28284C5.42926 6.13639 5.66669 6.13639 5.81314 6.28284Z"
              fill="#1B1B1B" />
            <path
              d="M5.81314 6.28284C5.95959 6.42929 5.95959 6.66672 5.81314 6.81317C5.66669 6.95962 5.42926 6.95962 5.28281 6.81317C5.13636 6.66672 5.13636 6.42929 5.28281 6.28284C5.42926 6.13639 5.66669 6.13639 5.81314 6.28284"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M12.2652 3.60983C12.4116 3.75628 12.4116 3.99372 12.2652 4.14017C12.1187 4.28661 11.8813 4.28661 11.7348 4.14017C11.5884 3.99372 11.5884 3.75628 11.7348 3.60983C11.8813 3.46339 12.1187 3.46339 12.2652 3.60983Z"
              fill="#1B1B1B" />
            <path
              d="M12.2652 3.60983C12.4116 3.75628 12.4116 3.99372 12.2652 4.14017C12.1187 4.28661 11.8813 4.28661 11.7348 4.14017C11.5884 3.99372 11.5884 3.75628 11.7348 3.60983C11.8813 3.46339 12.1187 3.46339 12.2652 3.60983"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="w-[28px] h-[28px]" v-if="index == 2">
            <path
              d="M13.9749 4.02513C15.3417 5.39197 15.3417 7.60804 13.9749 8.97488C12.608 10.3417 10.392 10.3417 9.02513 8.97488C7.65829 7.60804 7.65829 5.39197 9.02513 4.02513C10.392 2.65829 12.608 2.65829 13.9749 4.02513"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M17.0325 11.9675C17.0505 11.9855 17.0505 12.0146 17.0325 12.0326C17.0146 12.0505 16.9854 12.0505 16.9675 12.0326C16.9495 12.0146 16.9495 11.9855 16.9675 11.9675C16.9854 11.9495 17.0146 11.9495 17.0325 11.9675"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M14.98 6.859C15.306 6.775 15.619 6.652 15.902 6.47C16.363 6.173 16.91 6 17.5 6H18.5V8.554C19.218 9.202 19.788 10.01 20.126 10.935H21C21.552 10.935 22 11.383 22 11.935V15C22 15.552 21.552 16 21 16H19.689C19.164 16.908 18.406 17.664 17.5 18.191V20C17.5 20.552 17.052 21 16.5 21H14.5C13.948 21 13.5 20.552 13.5 20V19H10V19.868C10 20.42 9.552 20.868 9 20.868H7C6.448 20.868 6 20.42 6 19.868V17.463C4.775 16.365 4 14.775 4 13C4 10.352 5.718 8.109 8.098 7.313"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2.288 10C1.819 10.273 1.5 10.776 1.5 11.358C1.5 12.229 2.206 12.935 3.077 12.935H4"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M8.5 10H14.5" stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg width="25" height="25" class="w-[28px] h-[28px]" v-if="index == 3" viewBox="0 0 25 25" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M21.0088 12.005C21.0088 16.9776 16.9776 21.0088 12.005 21.0088" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path d="M3.00122 12.005C3.00122 7.03237 7.03234 3.00125 12.005 3.00125" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M3.00122 12.005C3.00136 13.0596 3.18894 14.1059 3.55521 15.0949C3.72272 15.5542 4.19499 15.8278 4.67678 15.7446L5.66338 15.5706C6.46079 15.43 7.00285 14.6821 6.88834 13.8806L6.5914 11.802C6.53391 11.3996 6.31564 11.0377 5.98652 10.7992C5.6574 10.5606 5.24558 10.4658 4.84528 10.5364L3.08396 10.8469"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M21.0088 12.005C21.0088 7.03237 16.9776 3.00125 12.005 3.00125" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M21.0087 12.005C21.0086 13.0596 20.821 14.1059 20.4547 15.0949C20.2872 15.5542 19.8149 15.8278 19.3331 15.7446L18.3465 15.5706C17.5491 15.43 17.0071 14.6821 17.1216 13.8806L17.4185 11.802C17.476 11.3996 17.6943 11.0377 18.0234 10.7992C18.3525 10.5606 18.7643 10.4658 19.1646 10.5364L20.926 10.8469"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M13.4981 12.4962C13.4951 12.4962 13.4924 12.498 13.4912 12.5008C13.4901 12.5036 13.4907 12.5068 13.4928 12.509C13.495 12.5111 13.4982 12.5117 13.501 12.5106C13.5038 12.5094 13.5056 12.5067 13.5056 12.5037C13.5057 12.5017 13.505 12.4997 13.5036 12.4983C13.5021 12.4968 13.5002 12.4961 13.4981 12.4962"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path
              d="M10.5118 12.4992C10.5088 12.4992 10.506 12.501 10.5049 12.5038C10.5037 12.5066 10.5044 12.5098 10.5065 12.512C10.5087 12.5141 10.5119 12.5147 10.5147 12.5136C10.5175 12.5124 10.5193 12.5097 10.5193 12.5067C10.5194 12.5047 10.5187 12.5027 10.5172 12.5012C10.5158 12.4998 10.5138 12.4991 10.5118 12.4992"
              stroke="#1B1B1B" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg t="1765748432831" class="icon w-24 h-24" v-if="index == 4" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="3435" width="24" height="24">
            <path
              d="M969.6 436.48L547.8656 14.9504a50.944 50.944 0 0 0-71.68 0L54.4512 436.48a51.2 51.2 0 0 0 35.84 87.04h48.896v394.24A106.24 106.24 0 0 0 245.4272 1024h533.1456a106.1888 106.1888 0 0 0 106.0864-106.0864v-394.24h48.9472a51.2 51.2 0 0 0 35.84-87.04z m-166.5024 481.28a24.832 24.832 0 0 1-24.5248 24.4736H245.4272a24.832 24.832 0 0 1-24.4736-24.4736V496.128a41.3696 41.3696 0 0 0-0.768-6.7072 41.8304 41.8304 0 0 0 0.5632-6.7072 40.96 40.96 0 0 0-40.96-40.96h-15.36L512.0256 94.3104l347.5968 347.5968h-15.7184a40.704 40.704 0 0 0-39.2704 51.7632 40.96 40.96 0 0 0-1.536 10.9568z"
              p-id="3436" fill="#1B1B1B"></path>
            <path
              d="M595.9936 378.88a166.2464 166.2464 0 0 0-81.2032 21.248 166.2464 166.2464 0 0 0-247.552 145.0496c0 187.136 222.9248 285.44 232.3968 289.536a40.4992 40.4992 0 0 0 16.1792 3.328 40.96 40.96 0 0 0 20.48-5.4784c23.0912-13.4144 225.9968-135.3728 225.9968-287.3856A166.5024 166.5024 0 0 0 595.9936 378.88z m-82.432 371.8144c-46.4896-24.6272-164.7104-97.8944-164.7104-205.5168a84.5824 84.5824 0 0 1 139.4688-64.512 40.96 40.96 0 0 0 52.8896 0 84.5824 84.5824 0 0 1 139.4688 64.4608c0 80.2304-107.7248 166.912-167.1168 205.5168z"
              p-id="3437" fill="#1B1B1B"></path>
          </svg>

        </div>

        <p class="text-[14px]  text-[#64748B] mt-[12px] ">{{ item.name }}</p>
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
    name: t("Exchange"),
    // image: grid1,
  },
  {
    name: t("Lottery"),
    // image: grid2,
  },
  {
    name: t("Receive"),
    // image: grid3,
  },
  {
    name: t("Customer"),
    // image: grid4,
  },
  {
    name: t("Community"),
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
  border: 1px solid #E2E8F0;
}
</style>
