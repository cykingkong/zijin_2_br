<template>
  <div class="bankAccount p-24 pb-120">
    <div class="cell-box flex flex-col gap-[16px]">
      <div
        class="cell-item px-[12px] w-full rounded-[12px] border border-[#E2E8F0] border-solid h-[72px] flex items-center justify-between"
        v-for="(item, index) in bankListData" :key="index">
        <div class="left flex items-center h-40 gap-[12px]">
          <div class="w-40 h-40 flex items-center justify-center flex-shrink-0 block bg-[#F8F9FD] rounded-full" alt="">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_5701_58995)">
                <rect width="28" height="28" rx="8" fill="#00CD88" fill-opacity="0.05" />
                <path
                  d="M16 16.3333C16 18.7267 14.06 20.6667 11.6667 20.6667C9.27337 20.6667 7.33337 18.7267 7.33337 16.3333C7.33337 13.94 9.27337 12 11.6667 12C11.78 12 11.9 12.0067 12.0134 12.0133C14.1267 12.18 15.82 13.8733 15.9867 15.9867C15.9934 16.1 16 16.22 16 16.3333Z"
                  fill="#161616" />
                <path opacity="0.4"
                  d="M20.6667 11.6668C20.6667 14.0602 18.7267 16.0002 16.3333 16.0002C16.22 16.0002 16.1 15.9935 15.9867 15.9868C15.82 13.8735 14.1267 12.1802 12.0133 12.0135C12.0067 11.9002 12 11.7802 12 11.6668C12 9.2735 13.94 7.3335 16.3333 7.3335C18.7267 7.3335 20.6667 9.2735 20.6667 11.6668Z"
                  fill="#161616" />
                <path
                  d="M9.7267 7.3335H8.00004C7.63337 7.3335 7.33337 7.6335 7.33337 8.00016V9.72683C7.33337 10.3202 8.05337 10.6202 8.47337 10.2002L10.2 8.4735C10.6134 8.0535 10.32 7.3335 9.7267 7.3335Z"
                  fill="#161616" />
                <path
                  d="M18.2733 20.6667H20C20.3666 20.6667 20.6666 20.3667 20.6666 20V18.2733C20.6666 17.68 19.9466 17.38 19.5266 17.8L17.8 19.5267C17.3866 19.9467 17.68 20.6667 18.2733 20.6667Z"
                  fill="#161616" />
              </g>
              <defs>
                <clipPath id="clip0_5701_58995">
                  <rect width="28" height="28" fill="white" />
                </clipPath>
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
            stroke="#1b1b1b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.66675 12.5L9.29175 12.1759C9.47591 12.1534 9.64758 12.0692 9.77925 11.9384L16.1384 5.5792C16.8426 4.87504 16.8426 3.73337 16.1384 3.02837V3.02837C15.4342 2.3242 14.2926 2.3242 13.5876 3.02837L7.28758 9.32837C7.16008 9.45587 7.07758 9.62087 7.05175 9.80004L6.66675 12.5Z"
            stroke="#1b1b1b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>


      </div>
      <empty v-if="bankListData.length == 0" :noTips="false" :tipsText="`${t('No more')}`"></empty>


    </div>


    <bottom-button color="#1B1B1B" :button-text="$t('Add Bank Account')" @click="herfUrl()"
      v-if="bankListData && bankListData.length == 0"></bottom-button>

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
      name: 'BankAccount',
      meta: {
        title: 'BankAccount',
        i18n: 'BankAccount'
      },
    }
    </route>