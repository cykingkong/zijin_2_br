<template>
  <div class="bankAccount p-24 pb-120">
    <div class="cell-box flex flex-col gap-16px">
      <div
        class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between"
        v-for="(item, index) in bankListData"
        :key="index"
        @click="radioActive = index"
      >
        <div class="left flex items-center h-40 gap-12px">
          <div
            class="w-40 h-40 flex items-center justify-center flex-shrink-0 block bg-#6B39F4 rounded-full"
            alt=""
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.9 8V5C17.9 4.73478 17.7947 4.48043 17.6071 4.29289C17.4196 4.10536 17.1652 4 16.9 4H6.90002C6.36959 4 5.86088 4.21071 5.48581 4.58579C5.11074 4.96086 4.90002 5.46957 4.90002 6M4.90002 6C4.90002 6.53043 5.11074 7.03914 5.48581 7.41421C5.86088 7.78929 6.36959 8 6.90002 8H18.9C19.1652 8 19.4196 8.10536 19.6071 8.29289C19.7947 8.48043 19.9 8.73478 19.9 9V12M4.90002 6V18C4.90002 18.5304 5.11074 19.0391 5.48581 19.4142C5.86088 19.7893 6.36959 20 6.90002 20H18.9C19.1652 20 19.4196 19.8946 19.6071 19.7071C19.7947 19.5196 19.9 19.2652 19.9 19V16"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M20.9 12V16H16.9C16.3696 16 15.8609 15.7893 15.4858 15.4142C15.1107 15.0391 14.9 14.5304 14.9 14C14.9 13.4696 15.1107 12.9609 15.4858 12.5858C15.8609 12.2107 16.3696 12 16.9 12H20.9Z"
                stroke="#fff"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="info h-full flex flex-col justify-between">
            <div class="t">{{ item.account }}</div>
            <div class="t2 text-#64748B text-10px">{{ item.name }}</div>
          </div>
        </div>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-if="radioActive != index"
        >
          <rect
            x="0.5"
            y="0.5"
            width="19"
            height="19"
            rx="9.5"
            fill="white"
            stroke="#E2E8F0"
          />
        </svg>
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          v-else
        >
          <rect
            x="0.5"
            y="0.5"
            width="19"
            height="19"
            rx="9.5"
            stroke="#6B39F4"
          />
          <rect
            x="3.33325"
            y="3.3335"
            width="13.3333"
            height="13.3333"
            rx="6.66667"
            fill="#6B39F4"
          />
        </svg>
      </div>
      <empty v-if="bankListData.length == 0" :tipsText="t('No more')"></empty>
    </div>

    <div class="w-full bottom-btn bg-#FFF mt-24px fixed left-0 px-24px">
      <van-button
        type="primary"
        color="#6B39F4"
        block
        @click="handleClickConfirm"
      >
        {{ bankListData.length == 0 ? t("Add Bank Account") : t("Confirm") }}
      </van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { bank_list } from "@/api/payment";
const { proxy } = getCurrentInstance()!;
const { t } = useI18n();
const activeRadio = ref(0);
const router = useRouter();
const bankListData = ref([]);

const radioActive = ref("0");

const getBankList = async () => {
  const { data, code } = await bank_list({ wallet_type: "auto" });
  if (code == 200) {
    bankListData.value = data || [];
  }
};

const handleClickConfirm = () => {
  console.log(radioActive.value);
  if (bankListData.value && bankListData.value.length == 0) {
    router.replace("/profile/bankAccount/addBank?edit=0");
    return;
  }
  let item = bankListData.value[radioActive.value];

  localStorage.setItem("withdrawType", JSON.stringify(item));
  router.push(`/wallet/exchange/cashierCenter-withdraw`);
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
    name: 'Withdrawbank',
    meta: {
      title: 'Withdrawbank',
      i18n: 'Withdrawbank'
    },
  }
  </route>