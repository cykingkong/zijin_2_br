<template>
  <div class="language-page">
    <!-- 
        <van-search v-model="search" show-action :placeholder="t('input.PleaseEnter')" @search="onSearch">

        </van-search> -->

    <div class="bankAccount px-24 pt-[20px]">
      <div class="cell-box flex flex-col gap-[16px]">
        <div v-for="(item, index) in languageColumns" :key="index" @click="
          activeRadio = index;
        langChange(item);
        " :class="item.value == locale ? 'cell-active' : ''"
          class="cell-item px-[12px] w-full rounded-[12px] border border-[#E2E8F0] border-solid h-[72px] flex items-center justify-between mb-[16px]">
          <div class="left flex items-center h-40 gap-[12px]">
            <div class="w-40 h-40 flex-shrink-0 rounded-[12px] bg-[#EBECEF] flex items-center justify-center">
              <div class="iti-flag" :class="getCountryCode(item.value)"></div>
            </div>
            <div class="info h-full flex flex-col justify-center">
              <div class="t">{{ item.text }}</div>
            </div>
          </div>
          <!-- <div class="radio border-solid border-1px border-#D1D5DB rounded-full w-20px h-20px relative flex-shrink-0"
                        :class="activeRadio == index ? 'radio-active' : ''">
                    </div> -->
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-show="item.value == locale">
            <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#1b1b1b" />
            <rect x="3.33337" y="3.33301" width="13.3333" height="13.3333" rx="6.66667" fill="#1b1b1b" />
          </svg>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            v-show="item.value != locale">
            <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" fill="white" stroke="#E2E8F0" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { languageColumns, locale } from "@/utils/i18n";
const { t } = useI18n();
const { proxy } = getCurrentInstance()!;
const showPicker = ref(false);
const activeRadio = ref(0);
const router = useRouter();
const search = ref("");
const searchLoading = ref(false);

// 语言代码到国家代码的映射
const languageToCountryMap = {
  hi: "in", // 印地语
  "zh-CN": "cn", // 中国
  "zh-TW": "hk", // 中国
  "en-US": "us", // 美国
  ta: 'in', // 泰米尔语
  te: 'in' // 泰卢固语
};

function getCountryCode(languageCode) {
  return languageToCountryMap[languageCode] || "us";
}
function onSearch() { }
function langChange(item: any) {
  locale.value = item.value;

  setTimeout(() => {
    router.push("/profile");
  }, 400);
}

onMounted(() => { });
</script>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

.bottom-btn {
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
  padding-top: 8px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}

.radio-active {
  border-color: #6b39f4 !important;
  position: relative;
}

.radio-active::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 13.33px;
  height: 13.33px;
  background-color: #1b1b1b;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.cell-active {
  border-color: #1b1b1b !important;
  background-color: #f5f8ff !important;
  color: #1b1b1b !important;
}
</style>

<route lang="json5">
    {
      name: 'languange',
      meta: {
        title: 'languange',
        i18n: 'languange'
      },
    }
</route>