<script setup lang="ts">
import { reactive, ref } from "vue";
import { withdraw, withdrawConfig } from "@/api/withdraw";
import { useStore } from "@/stores/modules/index";
import { addCommasToNumber } from "@/utils/tool";
import { userCardGrid } from "@/api/payment";
import { useLoadingStore } from "@/stores/modules/loading";
import { method } from "lodash-es";

const router = useRouter();
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance();
const { t } = useI18n();
const priceTabArr = ref(["1999", "4999", "9999", "19999", "49999", "99999"]);
const tips = ref("");
const tips2 = ref("");
const tips3 = ref("");
const columns = ref([]);
const showPicker = ref(false);
const store = useStore();
const page = reactive({
  pageIndex: 1,
  pageSize: 200,
});
const form = reactive({
  num: "",
  methodId: "",
  assetId: "",
});
const withdrawFee = ref(0);
watch(
  () => form.num,
  (newVal) => {
    if (newVal) {
      let fee = withdrawFee.value;
      tips.value = `${t("Service fee")}: ${fee}%  ${t(
        "Minimum withdrawal amount"
      )}: ${config.value.symbol} ${config.value.minWithdraw} `;
    }
  }
);
const config = ref();
async function getRechargeConfig() {
  withdrawConfig({ mode: "gp" }).then((res) => {
    config.value = res.data;
    form.assetId = res.data.assetId;
    withdrawFee.value = res.data.withdrawFee;
    tips.value = `${t("Service fee")}: ${res.data.withdrawFee} %    ${t(
      "Minimum withdrawal amount"
    )}: ${res.data.symbol} ${res.data.minWithdraw} `;
    tips2.value = `${t("Balance")}: ${res.data.symbol} ${addCommasToNumber(
      res.data.balance
    )} `;
    tips3.value = `${t(
      "Withdrawal Time"
    )}: ${res.data.withdrawHour[0].substring(
      0,
      5
    )} - ${res.data.withdrawHour[1].substring(0, 5)} `;
  });
}
async function getList() {
  const { data } = await userCardGrid({
    ...page,
  });
  columns.value = data.rows
    ? data.rows.map((e) => {
        return {
          text: `${e.address.bankName}(${e.address.bankType})`,
          value: e.id,
        };
      })
    : [];
  store.setUserCardList(data.rows);
}
function onConfirm({ selectedValues, selectedOptions }) {
  form.methodId = selectedValues[0];
  form.methodIdText = selectedOptions[0].text;
  console.log(form, selectedValues);
  showPicker.value = false;
}
function handleClickPicker() {
  if (columns.value && columns.value.length == 0) {
    showToast({
      message: `${t("PleaseAdd Bank Card")}`,
      onClose: () => {
        router.push("/profile/payMentMethod/list");
      },
    });
    return;
  }
  showPicker.value = true;
}
async function handleClickSubmitOriginal() {
  //     console.log(store, 'params')
  if (!form.methodId) {
    showToast(`${t("input.PleaseSelect")} ${t("Bank card")}`);
    return;
  }
  if (!form.num) {
    showToast(`${t("input.PleaseEnter")} ${t("Withdrawal amount")}`);
    return;
  }

  store.setWithdrawParams({
    cardId: form.methodId,
    amount: form.num,
    networkId: 0,
    type: 1,
    assetId: form.assetId,
  });
  router.push("/deal/exchange/securityVerification?type=1");
  // const { data, code } = await withdraw({
  //     cardId: form.methodId,
  //     amount: form.num,
  //     networkId: 0,
  //     type: 1,
  //     assetId: 0,

  // })
  // if (code == 200) {
  //     showToast('提交成功')
  //     getRechargeConfig();

  // }
}
const handleClickSubmit = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});
onMounted(() => {
  getRechargeConfig();
  getList();
});
</script>

<template>
  <div class="charge-bank-page p-12 color-blueGray-400">
    <div class="t font-size-18 color-blueGray-400">
      {{ t("Bank card withdrawal") }}
    </div>
    <inputCom
      v-model:value="form.methodId"
      class="mt-12"
      :label="t('Bank card')"
      :placeholder="t('input.PleaseEnter')"
      type="picker"
    >
      <div class="w-full flex justify-between">
        <div class="l flex-1 font-size-14" @click="handleClickPicker">
          {{ form.methodId ? form.methodIdText : t("input.PleaseSelect") }}
        </div>
        <div class="r flex-shrink-0">
          <van-icon name="arrow" class="rotate-90" />
        </div>
      </div>
    </inputCom>
    <inputCom
      v-model:value="form.num"
      :label="t('Withdrawal amount')"
      :placeholder="t('input.PleaseEnter')"
      tips=""
    />
    <div class="font-size-12 line-height-16">
      {{ tips }}
    </div>
    <div class="mb-12 mt-4 font-size-12">
      {{ tips2 }}
    </div>
    <div class="mb-12 mt-4 font-size-12">
      {{ tips3 }}
    </div>
    <van-button type="primary" block @click="handleClickSubmit">
      {{ t("submit") }}
    </van-button>
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

<route lang="json5">
{
  meta: {
    i18n: 'Bank Withdrawal',
  },
}
</route>

<style lang="less" scoped>
.price-item {
  width: 33%;
  border: 1px solid #1678ff;
}
</style>
