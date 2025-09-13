<template>
  <div class="color-blueGray-400 charge-bank-page p-12">
    <div class="color-blueGray-400 t font-size-18">
      {{ t("Withdraw USDT") }}
    </div>
    <div class="tips color-[#f43368] my-12">
      {{
        t("Please transfer the balance to your USD account before withdrawal")
      }}
    </div>
    <inputCom
      class="mt-12"
      :label="t('input.PleaseEnter')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.assetId"
      :type="'picker'"
    >
      <div class="w-full flex justify-between">
        <div class="l flex-1 font-size-14" @click="showPicker = true">
          {{ form.assetId ? form.assetIdText : t("input.pleaseSelect") }}
        </div>
        <div class="r flex-shrink-0">
          <van-icon name="arrow" class="rotate-90" />
        </div>
      </div>
    </inputCom>
    <div class="tab-title font-size-14 mb-12">
      {{ t("Blockchain network") }}
    </div>
    <div class="tab-box flex gap-12 mb-12">
      <div
        class="tab-item p-12 font-size-16 rounded-10px"
        v-for="(item, index) in btnList"
        @click="handleClickNetwork(index)"
        :class="{ 'active-item': index == activeBtn }"
        :key="index"
      >
        {{ item.label }}
      </div>
    </div>
    <inputCom
      :label="t('AddressInfo')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.address"
    >
    </inputCom>
    <inputCom
      :label="t('RechargeQuantity')"
      :placeholder="t('input.PleaseEnter')"
      :input-type="'number'"
      v-model:value="form.amount"
      :tips="tips"
      class="mb-12 relative"
    >
      <template #sendCode>
        <div class="absolute right-0 font-size-12 top-3 sendCode">
          USDT
          <span class="text-blue-500" @click="maxAmount">{{ t("All") }}</span>
        </div>
      </template>
    </inputCom>
    <div class="li flex justify-between font-size-14 mb-12">
      <div class="l">{{ t("Available") }}</div>
      <div class="r">
        {{ addCommasToNumber(Number(networkInfo.balance)) }}
        {{ networkInfo.symbol }}
      </div>
    </div>
    <div class="info color-blueGray-400 font-size-14 line-height-28 mb-12">
      <div class="li flex">{{ t("Amount to be received") }}</div>
      <div class="li">
        <span class="num color-white font-500"
          >{{ addCommasToNumber(Number(canWithdrawAmount)) }}
        </span>
        {{ networkInfo.symbol }}
      </div>
      <div class="li mb-12">
        {{ t("Withdrawal fee") }}:
        {{ addCommasToNumber(Number(form.amount) - Number(canWithdrawAmount)) }}
        USDT
      </div>
      <!-- <div class="li mb-6">提币说明：</div> -->
      <!-- <div class="html font-size-12" v-html="html"></div> -->
    </div>

    <van-button type="primary" block @click="orderInfoShow = true">{{
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
    <van-popup
      v-model:show="orderInfoShow"
      destroy-on-close
      position="bottom"
      :safe-area-inset-bottom="true"
      :closeable="true"
    >
      <div class="order-info-content text-align-center p-12 text-blueGray-400">
        <div class="font-size-20 mb-16">{{ t("Confirm order") }}</div>
        <div class="t2 font-size-16 mb-12">
          {{ t("Actual amount received") }}
        </div>
        <div class="num font-size-22 mb-12">
          <span class="price text-white font-500"
            >{{ addCommasToNumber(Number(canWithdrawAmount)) }}
          </span>
          USDT
        </div>
        <div class="li flex justify-between font-size-16 mb-12">
          <div class="l text-white">{{ t("Withdrawal address") }}</div>
          <div class="v">{{ form.address }}</div>
        </div>

        <div class="li flex justify-between font-size-16 mb-12">
          <div class="l text-white">{{ t("Withdrawal source account") }}</div>
          <div class="v">{{ "Wallet account" }}</div>
        </div>
        <div class="divdiver w-full h-1px bg-blueGray-400 my-12"></div>
        <div class="li flex justify-between font-size-16 mb-12">
          <div class="l text-white">{{ t("Currency") }}</div>
          <div class="v">{{ networkInfo.symbol }}</div>
        </div>
        <div class="li flex justify-between font-size-16 mb-12">
          <div class="l text-white">{{ t("Amount") }}</div>
          <div class="v">{{ networkInfo.symbol }} {{ form.amount }}</div>
        </div>
        <div class="li flex justify-between font-size-16 mb-12">
          <div class="l text-white">{{ t("Network fee") }}</div>
          <div class="v">{{ networkInfo.withdrawFee }} %</div>
        </div>
        <div class="tips text-align-left mb-12">
          {{
            t(
              "1. Please ensure you have entered the correct withdrawal address and that the selected transfer network matches the address. If the address is incorrect or the network does not match, your withdrawal may fail or be lost."
            )
          }}
        </div>
        <div class="tips text-align-left mb-12">
          {{ t("2. Withdrawal orders cannot be canceled once created.") }}
        </div>
        <van-button type="primary" block @click="handleClickSubmit()">{{
          t("Confirm")
        }}</van-button>
      </div>
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import {
  coinWithdrawConfig,
  coinRechargeConfig,
  withdraw,
} from "@/api/recharge";
import { useLoadingStore } from "@/stores/modules/loading";
import { addCommasToNumber } from "@/utils/tool";
import { useStore } from "@/stores/modules/index";
const store = useStore();
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance();
const priceTabArr = ref([]);
const tips = ref("");
const columns = ref([]);
const { t } = useI18n();
const showPicker = ref(false);
const orderInfoShow = ref(false);
const html = `<div class="text-grey mt-2 text-14" >·提币时间为24小时。 <br>
·目前提币只支持USDT币种。<br>
·提交提币申请后，该笔资金属于冻结状态是因为提现正在进行中，该笔资金暂时由系统托管，并不代表您损失了这笔资产或资产出现异常。 <br>
·提交提币申请后12h内到账，如预计提币时间后未到账请咨询在线客服。</div>`;
const active = ref(0);
const router = useRouter();
const activeBtn = ref(0);
const btnList = ref([]);
const configData = ref([]);
const form = reactive({
  amount: "",
  assetIdText: "",
  assetId: 0,
  address: "",
  cardId: 0,
  networkId: "",
  type: 1,
});
const networkInfo = ref({
  balance: 0,
  symbol: "USDT",
  withdrawFee: 0.1,
});
watch(
  () => form.methodId,
  (val) => {
    if (configData.value.length === 0) return;
    const data = configData.value.find((item) => item.method.baseId === val);
    console.log(data);
    btnList.value = data.network.map((e) => {
      return {
        label: e.name,
        value: e.id,
      };
    });
    form.networkId = data.network[0].name;
    networkInfo.value = data.network[0];
    tips.value = `${t("Minimum withdrawal amount")}:${
      data.network[0].minWithdraw
    }      ${t("Maximum withdrawal amount")}:${data.network[0].maxWithdraw} `;
    console.log(form, "data");
  }
);
const canWithdrawAmount = computed(() => {
  if (networkInfo.value) {
    if (networkInfo.value.withdrawFee == 0) return Number(form.amount);
    return (Number(form.amount) * networkInfo.value.withdrawFee) / 100;
  }
  return 0;
});
const handleClickNetwork = (index) => {
  activeBtn.value = index;
  // form.networkId = btnList.value[index].value
  networkInfo.value = configData.value.find(
    (item) => item.method.id === form.assetId
  ).network[index];
  console.log(form, "data", networkInfo.value);
};
const getRechargeConfig = async () => {
  coinWithdrawConfig({ mode: "gp" }).then((res) => {
    // priceTabArr.value = res.data.settings.find(item => item.key === 'recharge_number').value.split(',')
    // tips.value = `充值范围${res.data.settings.find(item => item.key === 'recharge_min_amount').value}-10000000000`
    configData.value = res.data;
    columns.value = res.data.map((e) => {
      return {
        text: e.method.name,
        value: e.method.baseId,
      };
    });
    form.assetId = res.data[0].method.id;
    form.assetIdText = res.data[0].method.name;

    btnList.value = res.data[0].network.map((e) => {
      return {
        label: e.name,
        value: e.id,
      };
    });
    form.networkId = res.data[0].network[0].name;
    console.log(res.data[0].network);
  });
};
const onConfirm = ({ selectedValues, selectedOptions, selectedIndexes }) => {
  form.methodId = configData.value[selectedIndexes[0]].method.baseId;
  console.log(selectedOptions[0].text);
  form.assetId = configData.value[selectedIndexes[0]].method.id;
  form.methodIdText = selectedOptions[0].text;
  form.assetIdText = selectedOptions[0].text;
  console.log(form, selectedValues, selectedOptions, selectedIndexes);
  showPicker.value = false;
};
const maxAmount = () => {
  form.amount = Number(networkInfo.value.balance);
};
const handleClickSubmitOriginal = async () => {
  if (!form.amount) {
    showToast("input.PleaseEnter");
    return;
  }
  if (Number(form.amount) < Number(networkInfo.value.minWithdraw)) {
    showToast(
      `${t("Minimum withdrawal amount")}:${networkInfo.value.minWithdraw}`
    );
    return;
  }
  if (Number(form.amount) > Number(networkInfo.value.maxWithdraw)) {
    showToast(
      `${t("Maximum withdrawal amount")}${networkInfo.value.maxWithdraw}`
    );
    return;
  }
  if (!form.address) {
    showToast("input.PleaseEnter");
    return;
  }
  if (!form.networkId) {
    showToast("input.PleaseEnter");
    return;
  }
  let params = {
    assetId: form.assetId,
    amount: form.amount,
    methodId: form.assetId,
    address: form.address,
    networkId: form.networkId,
    type: 2,
  };
  console.log(store, "params");
  store.setWithdrawParams(params);
  router.push("/deal/exchange/securityVerification");
  // const { data, code } = await withdraw(params)
  // if (code === 200) {
  //     showToast('提交充值成功')
  //     getRechargeConfig();
  //     orderInfoShow.value = false
  // }
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
    i18n: 'USDT Withdrawal',
  },
}
</route>
<style lang="less" scoped>
.price-item {
  width: 33%;
  border: 1px solid #1678ff;
}

.active-item {
  border-color: #1678ff;
  background: #1678ff;
  color: #fff;
}

.tab-item {
  border: 1px solid;
  border-color: #fff;
}

.active {
  background: #116677b0;
}

.charge-bank-page {
  padding-bottom: calc(env(safe-area-inset-bottom) + 24px);
}
</style>
