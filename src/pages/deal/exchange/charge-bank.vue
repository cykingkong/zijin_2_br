<template>
  <div class="color-blueGray-400 charge-bank-page p-12">
    <div class="color-blueGray-400 t font-size-18 mb-8">
      {{ t("BankCardDeposit") }}
    </div>
    <div class="color-blueGray-400 t font-size-14 mt-4">
      {{ t("BankCardDeposit") }}
    </div>
    <div class="color-blueGray-400 price-tab flex my-12 gap-12px flex-wrap">
      <div
        class="color-blueGray-400 price-item p-12 flex-1 text-align-center rounded-10 max-w-100px"
        v-for="item in priceTabArr"
        :key="item"
        @click="form.amount = item"
      >
        <div class="color-blueGray-400 t font-size-14">{{ item }}</div>
      </div>
    </div>
    <inputCom
      class="mt-12"
      :label="t('RechargeMethod')"
      :placeholder="''"
      v-model:value="form.methodId"
      :type="'picker'"
    >
      <div class="w-full flex justify-between">
        <div class="l flex-1 font-size-14" @click="showPicker = true">
          {{ form.methodId ? form.methodIdText : t("SelectRechargeMethod") }}
        </div>
        <div class="r flex-shrink-0">
          <van-icon name="arrow" class="rotate-90" />
        </div>
      </div>
    </inputCom>
    <inputCom
      :label="t('RechargeQuantity')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.amount"
      :tips="tips"
    >
    </inputCom>

    <div class="px-4 mt-4 py-4 centent">
      <!--    <div class="font-size-15">{{ t("RechargeInstructions") }}</div>
      <p class="color-blueGray-400 mt-2 text-12px">
        {{ t("DepositInquiryNotice") }}
      </p>
      <p class="color-blueGray-400 mt-2 text-12px">
        {{ t("PaymentSubmissionNotice") }}
      </p>
      <p class="color-blueGray-400 mt-2 text-12px">
        {{ t("SubmitReceiptReminder") }}
      </p>
      <p class="color-blueGray-400 mt-2 text-12px">
        {{ t("SecurityWarning") }}
      </p>
      <p class="color-blueGray-400 mt-2 text-12px">
        {{ t("OfficialAccountWarning") }}
      </p> -->
    </div>
    <van-button type="primary" block @click="handleClickSubmit">{{
      t("submit")
    }}</van-button>
    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="columns"
        :model-value="[form.methodId]"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { rechargeConfig, coinRechargeConfig, recharge } from "@/api/recharge";
import { useLoadingStore } from "@/stores/modules/loading";
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance();
const priceTabArr = ref([]);
const tips = ref("");
const columns = ref([]);
const showPicker = ref(false);
const { t } = useI18n();
const html = ``;
const form = reactive({
  amount: "",
  methodId: "",
  methodIdText: "",
});
const getRechargeConfig = async () => {
  rechargeConfig({ mode: "gp" }).then((res) => {
    priceTabArr.value = res.data.settings
      .find((item) => item.key === "recharge_number")
      .value.split(",");
    tips.value = `${t("RechargeRange")}${
      res.data.settings.find((item) => item.key === "recharge_min_amount").value
    }-10000000000`;
    columns.value = res.data.methods.map((e) => {
      return {
        text: e.method,
        value: e.id,
      };
    });
    form.methodId = columns.value[0].value;
    form.methodIdText = columns.value[0].text;
  });
};
const onConfirm = ({ selectedValues, selectedOptions }) => {
  form.methodId = selectedValues[0];
  form.methodIdText = selectedOptions[0].text;
  console.log(form, selectedValues);
  showPicker.value = false;
};
const handleClickSubmitOriginal = async () => {
  const { data, code } = await recharge(form);
  if (code === 200) {
     setTimeout(()=>{
          //  window.open(data.payUrl, "_blank");
           window.location.href = data.payUrl
    },40)
  }
};
const handleClickSubmit = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});

onMounted(() => {
  getRechargeConfig();
});
</script>


<route lang="json5">
{
  meta: {
    i18n: 'BankCardDeposit',
  },
}
</route>

<style lang="less" scoped>
.price-item {
  width: 33%;
  border: 1px solid #1678ff;
}
</style>
