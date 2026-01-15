<template>
  <div class="bankAccount p-24 pb-120">
    <div class="cell-box flex flex-col gap-[16px]">
      <div
        class="cell-item px-[12px] w-full rounded-[12px] border border-[#E2E8F0] border-solid h-[72px] flex items-center justify-between"
        v-for="(item, index) in bankListData" :key="index">
        <div class="left flex items-center h-40 gap-[12px]">
          <div class="w-40 h-40 flex items-center justify-center flex-shrink-0 block bg-[#F8F9FD] rounded-full" alt="">
            <svg class="w-16 h-16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.4223 3.49854C15.2465 3.17201 14.9702 2.75219 14.5432 2.42566C14.3673 2.26239 14.1413 2.14577 13.8399 2.09913C13.6138 2.05248 13.3877 1.98251 13.1366 1.98251H13.0863C12.7849 1.98251 12.2072 2.02915 11.8807 2.4723C11.7049 2.63557 11.6546 2.89213 11.7049 3.17201C11.7551 3.38192 11.8807 3.54519 12.1067 3.59184C12.1067 3.59184 12.157 3.59184 12.2826 3.63848C12.2323 3.63848 12.157 3.7551 12.157 3.7551C12.0314 3.91837 11.7551 4.17493 10.9513 4.17493H10.9011C10.4992 4.17493 10.1476 4.05831 9.74567 3.59184C9.51961 3.26531 9.34378 2.77551 9.34378 1.93586C9.34378 1.51604 9.29355 1.11953 9.16796 0.862974C9.11772 0.653061 8.9419 0.489796 8.76608 0.373178C8.64049 0.25656 8.46466 0.209913 8.2386 0.163265C8.01254 0 7.6609 0 7.3846 0C7.03295 0 6.85713 0.0466472 6.75666 0.209913C6.75666 0.209913 6.75666 0.25656 6.70642 0.25656H6.48036C6.30454 0.25656 6.12871 0.303207 5.95289 0.303207C5.60124 0.349854 5.42542 0.466472 5.19936 0.629738C5.14912 0.676385 4.9733 0.83965 4.89794 1.04956C4.84771 1.21283 4.89794 1.32945 4.94818 1.37609C4.94818 1.37609 4.94818 1.42274 4.99841 1.42274C5.124 1.30612 5.29983 1.25948 5.57612 1.25948C5.92777 1.25948 6.45524 1.42274 6.60595 1.6793C6.83201 2.05248 6.78177 2.33236 6.73154 2.70554C6.60595 3.61516 6.20407 4.10496 5.45053 4.19825H5.04865C4.47094 4.19825 4.06906 4.03499 3.89323 3.70845C3.76765 3.59184 3.76765 3.54519 3.76765 3.54519C3.76765 3.54519 3.81788 3.54519 3.89323 3.49854C4.11929 3.38192 4.24488 3.28863 4.29512 3.07872C4.34535 2.8688 4.29512 2.58892 4.11929 2.37901C3.81788 2.09913 3.416 1.95918 2.91364 1.95918C2.61223 1.95918 2.38617 2.00583 2.21035 2.0758C1.50705 2.23907 1.0047 2.65889 0.602811 3.47522C0.301398 4.01166 0.0753388 4.75802 0.0251034 5.50437C-0.0251321 6.25073 -0.0251321 6.90379 0.0251034 7.48688C0.150692 8.44315 0.326516 9.04956 0.552576 9.63265C0.778635 10.2857 1.13028 10.8688 1.48193 11.4052C1.60752 11.6152 1.65776 11.7318 1.70799 11.7784C1.75823 11.7318 1.83358 11.6618 1.88382 11.5685C2.0094 11.4519 2.41129 10.9854 2.51176 10.8222C2.68758 10.7055 2.86341 10.4023 2.96388 10.1691L3.01411 10.0525L3.1397 10.1691C3.26529 10.2857 3.31553 10.379 3.31553 10.5423C3.31553 10.7055 3.26529 10.8688 3.18994 11.1953C3.06435 11.5219 2.88853 11.9417 2.66247 12.2682C2.66247 12.3149 2.61223 12.3848 2.61223 12.3848C2.48664 12.5948 2.43641 12.7114 2.48664 12.758C2.53688 12.758 2.7127 12.7114 2.88853 12.5481C3.11459 12.4548 3.51647 12.1283 4.01882 11.4286C4.42071 10.9388 4.72212 10.4023 4.99841 9.81924L5.04865 9.70262L5.17424 9.74927C5.22447 9.74927 5.29983 9.79592 5.29983 9.86589C5.35006 9.98251 5.35006 10.0758 5.35006 10.2391C5.29983 10.6122 5.04865 11.1487 4.89794 11.5219C4.59653 12.1749 4.01882 12.9213 3.61694 13.4577C3.61694 13.4577 3.49135 13.5743 3.49135 13.621C3.54159 13.6676 3.61694 13.7376 3.71741 13.7843L3.89323 13.9009C4.47094 14.3207 4.99841 14.7172 5.67659 15.0204C6.20407 15.3003 7.28413 15.8367 7.98743 15.9767C8.69072 15.8134 9.77079 15.277 10.2983 15.0204C11.0016 14.6472 11.5039 14.3207 12.0816 13.9009L12.2574 13.7843C12.383 13.7376 12.4333 13.621 12.4835 13.621C12.4835 13.621 12.4333 13.5743 12.4333 13.5044L12.383 13.4577C11.9811 12.9213 11.4034 12.1749 11.102 11.5219C10.9262 11.1487 10.7001 10.5656 10.6499 10.2391C10.6499 10.0758 10.6499 9.95918 10.7001 9.86589C10.7001 9.81924 10.7504 9.81924 10.8257 9.74927C10.876 9.70262 10.9513 9.70262 10.9513 9.70262L11.0016 9.81924C11.303 10.4023 11.6295 10.8921 11.9811 11.4286C12.5086 12.1283 12.9105 12.4548 13.0863 12.5481C13.2621 12.6647 13.438 12.758 13.4882 12.758H13.5636C13.6138 12.7114 13.5636 12.5948 13.438 12.3848C13.438 12.3382 13.3877 12.2682 13.3877 12.2682C13.1617 11.895 12.9859 11.5219 12.8603 11.1953C12.7347 10.8688 12.6844 10.7055 12.6844 10.5423C12.6844 10.379 12.7347 10.2157 12.8603 10.1691L12.9859 10.1224L13.0361 10.2391C13.1617 10.449 13.3877 10.7755 13.438 10.8921C13.5636 11.0554 13.9654 11.4752 14.0659 11.6385L14.2417 11.8017C14.292 11.7551 14.3673 11.6385 14.4678 11.4752V11.4286C14.8195 10.8921 15.0957 10.309 15.3972 9.65598C15.6232 9.00292 15.799 8.46647 15.9246 7.5102C15.9749 6.92711 16.0502 6.27405 15.9246 5.5277C15.9246 4.78134 15.7739 4.03499 15.4223 3.49854Z"
                fill="url(#paint0_radial_49_714)" />
              <defs>
                <radialGradient id="paint0_radial_49_714" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(0.438855 2.88211) scale(17.6636 16.4019)">
                  <stop stop-color="#20C4F4" />
                  <stop offset="0.304" stop-color="#09B4F0" />
                  <stop offset="0.5" stop-color="#00AEEF" />
                  <stop offset="0.8" stop-color="#0092C8" />
                  <stop offset="1" stop-color="#006E98" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <div class="info h-full flex flex-col justify-between">
            <div class="t">{{ item.address.receiveAccount }}</div>
            <div class="t2 text-[#64748B] text-[10px]">{{ item.address.receiveName }}</div>
          </div>
        </div>
        <svg class="w-20 h-20" @click="handleClickEdit(item)" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 10.8333V15.8333C15 16.7542 14.2542 17.5 13.3333 17.5H4.16667C3.24583 17.5 2.5 16.7542 2.5 15.8333V6.66667C2.5 5.74583 3.24583 5 4.16667 5H7.5"
            stroke="#FFCC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.66675 12.5L9.29175 12.1759C9.47591 12.1534 9.64758 12.0692 9.77925 11.9384L16.1384 5.5792C16.8426 4.87504 16.8426 3.73337 16.1384 3.02837V3.02837C15.4342 2.3242 14.2926 2.3242 13.5876 3.02837L7.28758 9.32837C7.16008 9.45587 7.07758 9.62087 7.05175 9.80004L6.66675 12.5Z"
            stroke="#FFCC00" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>


      </div>
      <empty v-if="bankListData.length == 0" :noTips="false" :tipsText="`${t('No more')}`"></empty>


    </div>


    <bottom-button color="#1B1B1B" :button-text="$t('Add Bank Account')" @click="herfUrl()" v-if="bankListData && bankListData.length  ==  0"></bottom-button>

    <van-popup v-model:show="showPicker" destroy-on-close round :position="'bottom'" :safe-area-inset-bottom="true">
      <div class="content py-[12px]">
        <div class="mid w-[40px] h-[6px] bg-[#E2E8F0] rounded-[6px] mx-auto mb-[12px]"></div>
        <div
          class="title h-[38px] flex items-start justify-between border-b-[1px] border-b-[#E2E8F0] border-b-solid mb-[16px]">
          <div class="left pl-[24px] text-[16px] font-bold">{{ t("Picker") }}</div>
        </div>
        <div class="radio-group px-[24px]">
          <div
            class="radio-item w-full px-[16px] rounded-[12px] border border-[#E2E8F0] border-solid h-[58px] flex items-center justify-between mb-[16px]"
            :class="{ 'border-[#6B39F4] bg-[#F8F5FF]': activeRadio == index }" v-for="(item, index) in radioList"
            :key="index" @click="activeRadio = index">
            {{ item.title }}
            <div
              class="radio border-solid border border-[#D1D5DB] rounded-full w-[20px] h-[20px] relative flex-shrink-0"
              :class="activeRadio == index ? 'radio-active' : ''"></div>
          </div>
          <van-button type="primary" color="#6B39F4" block @click="
            showPicker = false;
          herfUrl();
          ">
            {{ t("Done") }}
          </van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { bank_list } from "@/api/payment";
import local from "@/utils/local";
const { proxy } = getCurrentInstance()!;
const showPicker = ref(false);
const activeRadio = ref(0);
const router = useRouter();
const bankListData = ref([]);
const { t } = useI18n();
const page = reactive({
  pageIndex: 1,
  pageSize: 30,
});
const radioList = [
  {
    title: t("Add bank card"),
    value: 0,
  },
  // {
  //     title: '添加数字货币',
  //     value: 1
  // }
];
const getBankList = async () => {
  const { data, code } = await bank_list({ ...page, wallet_type: "auto" });
  if (code == 200) {
    bankListData.value = data.rows;
  }
};
const herfUrl = () => {
  router.push({
    path: "/profile/bankAccount/addBank?edit=0",
  });
};
const handleClickEdit = (item: any) => {
  local.setlocal('bankAccountInfo', item)
  router.push("/profile/bankAccount/addBank?edit=1&id=" + item.id);
};
onMounted(() => {
  getBankList();
});
</script>
<style lang="less" scoped>
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
  background-color: #6b39f4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
</style>

<route lang="json5">
    {
      name: 'bankAccount',
      meta: {
        title: 'bankAccount',
        i18n: 'bankAccount'
      },
    }
    </route>