<template>
  <div class="conversion-page p-12">
    <div class="title font-size-20 mb-12" @click="showPicker = true">
      {{ t("profile.conversion") }}
    </div>
    <div
      class="transfer w-full rounded-10 p-12 font-size-14 flex items-center mb-12"
    >
      <div class="left w-90% flex-shrink-0">
        <div class="li flex flex-shrink-0 gap-30">
          <div class="l flex items-center gap-8">
            <van-icon name="gold-coin-o" class="block" />
            {{ t("from") }}
          </div>
          <div
            class="mid flex-1 flex justify-between items-center"
            @click="handleClickPicker(0)"
          >
            {{ form.baseAssetIdDesc }}
            <van-icon name="arrow-down" class="w-20 h-20" />
          </div>
        </div>
        <van-icon name="down" class="my-12" />
        <div class="li flex flex-shrink-0 gap-30">
          <div class="l flex items-center gap-8">
            <van-icon name="gold-coin-o" class="block" />
            {{ t("to") }}
          </div>
          <div
            class="mid flex-1 flex justify-between items-center"
            @click="handleClickPicker(1)"
          >
            {{ form.quoteAssetIdDesc }}
            <van-icon name="arrow-down" class="w-20 h-20" />
          </div>
        </div>
      </div>
      <div class="r flex-1 items-center flex justify-center" @click="change">
        <van-icon name="exchange" size="20px" class="rotate-90" />
      </div>
    </div>
    <inputCom
      :label="t('price')"
      class="mb-12"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.amount"
      :tips="tips"
    >
      <template #sendCode>
        <div class="absolute right-0 font-size-12 sendCode">
          {{ form.baseAssetIdDesc }}
          <span class="text-blue-500" @click="maxAmount">{{ t("max") }}</span>
        </div>
      </template>
    </inputCom>
    <div class="canhasAmount mb-12">{{ canhasAmountTips }}</div>
    <van-button type="primary" block @click="handleClickSubmit">{{
      t("submit")
    }}</van-button>

    <van-popup v-model:show="showPicker" destroy-on-close position="bottom">
      <van-picker
        :columns="columns"
        :model-value="popType ? [form.baseAssetId] : [form.quoteAssetId]"
        @confirm="onConfirm"
        @cancel="showPicker = false"
      />
    </van-popup>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import { assetsList } from "@/api/market";
import { getBalance } from "@/api/user";
import { conversionInfo, conversion } from "@/api/conversion";
import { showToast, showSuccessToast, allowMultipleToast } from "vant";
import { addCommasToNumber } from "@/utils/tool";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const columns = ref([]);
const showPicker = ref(false);
const form = reactive({
  quoteAssetId: 0,
  quoteAssetIdDesc: "",
  baseAssetId: 0,
  baseAssetIdDesc: "",
  amount: "",
});
const price = ref(``);
const quotesPrice = ref(``);
const assetsListIds = ref({
  quoteAssetId: 0,
  baseAssetId: 0,
});
const getDescById = (id: number) => {
  const item = columns.value.find((item) => item.value == id);
  return item?.text || "";
};
const canhasAmount = ref(0);
const conversionInfoData = ref();
const userBalance = ref(0);
const balanceType = ref(0); // 0 的时候是base 1 quote
const tips = ref("");
const canhasAmountTips = ref("");
const popType = ref(0); // 0 base 1 quote
const handleClickPicker = (type: number) => {
  popType.value = type;
  showPicker.value = true;
  console.log(type);
};
watch(
  () => balanceType.value,
  (val) => {
    console.log(val, "val");
    if (val == 0) {
      console.log(
        "base",
        conversionInfoData.value.baseAssetSymbolName,
        addCommasToNumber(Number(price.value))
      );
      tips.value = `${t("Available balance")}:${
        conversionInfoData.value.baseAssetSymbolName
      } ${addCommasToNumber(Number(price.value))}`;
    } else {
      tips.value = `${t("Available balance")}:${
        conversionInfoData.value.quoteAssetSymbolName
      } ${addCommasToNumber(Number(quotesPrice.value))} `;
    }
  }
);
watch(
  () => form.amount,
  (val) => {
    if (balanceType.value == 0) {
      canhasAmount.value = form.amount
        ? Number(form.amount) * conversionInfoData.value.baseAssetAmountRate
        : 0;
      console.log(canhasAmount.value, "canhasAmount.value");
      canhasAmountTips.value = `${t("Estimated to obtain")}:${
        conversionInfoData.value.quoteAssetSymbolName
      } ${addCommasToNumber(canhasAmount.value)}`;
    } else {
      canhasAmount.value = form.amount
        ? Number(form.amount) * conversionInfoData.value.quoteAssetAmountRate
        : 0;
      canhasAmountTips.value = `${t("Estimated to obtain")}:${
        conversionInfoData.value.baseAssetSymbolName
      } ${addCommasToNumber(canhasAmount.value)}`;
    }
  }
);
const change = () => {
  form.amount = "";

  balanceType.value = balanceType.value == 0 ? 1 : 0;
  const temp = form.baseAssetId;
  form.baseAssetId = form.quoteAssetId;
  form.quoteAssetId = temp;
  const tempDesc = form.baseAssetIdDesc;
  form.baseAssetIdDesc = form.quoteAssetIdDesc;
  form.quoteAssetIdDesc = tempDesc;
  // const tempPrice = price.value
  // price.value = quotesPrice.value
  // quotesPrice.value = tempPrice
  // const tempSymbol = getDescById(form.baseAssetId)
  // tips.value = `${t('Available balance')}${tempSymbol} ${addCommasToNumber(Number(price.value))}`
};
const onConfirm = (value: any) => {
  change();
  showPicker.value = false;
};
const getBalanceColumns = async () => {
  const { data, code } = await assetsList({
    status: 1,
    isConversion: 1,
  });
  if (code == 200) {
    columns.value = data.rows
      ? data.rows.map((item) => {
          return {
            text: item.assetInfo.symbol,
            value: item.assetId,
          };
        })
      : [];
    assetsListIds.value = {
      quoteAssetId: data.rows[0].assetId,
      baseAssetId: data.rows[1].assetId,
    };
    form.quoteAssetId = columns.value[0].value;
    form.baseAssetId = columns.value[1].value;
    form.quoteAssetIdDesc = columns.value[0].text;
    form.baseAssetIdDesc = columns.value[1].text;
    balanceType.value = 0;
    // tips.value = `${t('Available balance')}${addCommasToNumber(Number(price.value))}`
  }
};
const maxAmount = () => {
  if (balanceType.value == 0) {
    form.amount = conversionInfoData.value.baseAssetBalance;
  } else {
    form.amount = conversionInfoData.value.quoteAssetBalance;
  }
};

const getInfo = async () => {
  const { data, code } = await conversionInfo({
    quoteAssetId: assetsListIds.value.quoteAssetId,
    baseAssetId: assetsListIds.value.baseAssetId,
  });
  if (code == 200) {
    conversionInfoData.value = data;
    price.value = `${data.baseAssetBalance}`;
    quotesPrice.value = `${data.quoteAssetBalance}`;
    if (balanceType.value == 0) {
      tips.value = `${t("Available balance")}${
        conversionInfoData.value.baseAssetSymbolName
      } ${addCommasToNumber(Number(price.value))} `;
    } else {
      tips.value = `${t("Available balance")}${
        conversionInfoData.value.quoteAssetSymbolName
      } ${addCommasToNumber(Number(quotesPrice.value))} `;
    }
  }
};
const handleClickSubmit = async () => {
  if (form.amount == "") {
    showToast({
      message: t("input.PleaseEnter") + t("Amount"),
      zIndex: 99,
    });
    return;
  }
  const { data, code } = await conversion({
    quoteAssetId: form.quoteAssetId,
    baseAssetId: form.baseAssetId,
    amount: Number(form.amount.replace(/,/g, "")),
  });
  if (code == 200) {
    console.log(data);

    showSuccessToast({
      zIndex: 9999,
    });
    form.amount = "";
    getInfo();
  }
};
onMounted(async () => {
  await getBalanceColumns();
  getInfo();
  allowMultipleToast();
});
</script>
<route lang="json5">
    {
        name:"conversion",
      meta: {
        i18n: 'profile.conversion'
      }
    }
  </route>
<style lang="less" scoped>
.transfer {
  background: var(--bg);
}
</style>
