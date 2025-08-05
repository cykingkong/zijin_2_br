<template>
  <van-popup v-model:show="showPicker" destroy-on-close round z-index="10000"
    :position="popType == 'discount' ? 'bottom' : 'bottom'" :safe-area-inset-bottom="true">
    <div class="w-40 h-6 rounded-6px bg-#E2E8F0 mt-12px mx-auto "></div>
    <div class="w-full p-12 flex flex-col gap-12">
      <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
        <div class="name font-size-14">
          {{ item.name || item.fundInfo.name }}
        </div>
      </div>
      <div class="fundDivider w-full h-1px bg-#EBECEF"></div>

      <!-- <inputCom :label="popType == 'fund' ? t('BuyShare') : t('SellShare')" :placeholder="t('input.PleaseEnter')"
        v-model:value="form.amount" v-if="popType == 'fund'">
      </inputCom> -->
      <div
        class="input w-full rounded-12px bg-#F8F9FD text-align-center font-bold  items-center text-16px h-58px flex px-24px gap-8px "
        :class="{ 'border-1px border-#E11D48': isInvalidAmount || isInvalidFormat }">
        <div class="unit  text-16px">R$</div>
        <input type="text" placeholder="" v-model="form.amount" @input="handleAmountInput" @blur="handleAmountBlur"
          class="w-full h-full text-16px text-align-left input"
          :class="{ 'color-#E11D48': isInvalidAmount || isInvalidFormat }">
      </div>

      <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">
        {{ t("You need to pay") }}{{ item.assetInfo.unit }} {{ addCommasToNumber(item.amount) }}
      </div>
      <div class="w-full flex gap-12">
        <!-- <div class="btn-box flex-1">
          <van-button type="default" class="h-40!" plain block @click="showPicker = false">{{ t("cancel")
            }}</van-button>
        </div> -->
        <div class="btn-box flex-1">
          <van-button type="primary" color="#6B39F4" class="h-56px! rounded-12px" block @click="confirm">{{
            t(btnText)
          }}</van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import { addCommasToNumber } from '@/utils/tool'

const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object,
    default: () => { },
  },
  popType: {
    type: String,
    default: "fund",
  },
});
const emits = defineEmits(["onConfirm"]);
const btnText = ref("confirm");
const isInvalidAmount = ref(false)
const isInvalidFormat = ref(false)
watch([() => props.item, () => props.popType], ([item, popType]) => {
  btnText.value = "confirm";
  if (popType == "order") {
    if (item.status == "1") {
      btnText.value = "Buy";
    } else {
      btnText.value = "confirm";
    }
  }
});
const form = reactive({
  fundId: "",
  amount: "",
});
const showPicker = ref(false);
const show = (val: boolean) => {

  if (val) { form.amount = props.item.minAmount || '' };
  showPicker.value = val;
};

const handleAmountInput = () => {
  // 检查是否为正整数
  const positiveIntegerRegex = /^[1-9]\d*$/
  if (!positiveIntegerRegex.test(form.amount)) {
    isInvalidFormat.value = true
    isInvalidAmount.value = false
    return
  }

  isInvalidFormat.value = false
  const inputValue = parseFloat(form.amount) || 0
  if (inputValue < props.item.minAmount) {
    isInvalidAmount.value = true
  } else {
    isInvalidAmount.value = false
  }
}

const handleAmountBlur = () => {
  // 检查是否为正整数
  const positiveIntegerRegex = /^[1-9]\d*$/
  if (!positiveIntegerRegex.test(form.amount)) {
    isInvalidFormat.value = true
    isInvalidAmount.value = false
    // 清空无效输入
    form.amount = props.item.minAmount.toString()
    return
  }

  isInvalidFormat.value = false
  const inputValue = parseFloat(form.amount) || 0
  if (inputValue < props.item.minAmount) {
    isInvalidAmount.value = true
    // 如果输入值小于最小金额，重置为最小金额
    form.amount = props.item.minAmount.toString()
  } else {
    isInvalidAmount.value = false
  }
}
const confirm = () => {
  form.fundId = props.item.id;
  let params = {
    ...form,
    type: props.popType,
    status: props.item.status,
  };
  emits("onConfirm", params);
};
defineExpose({
  show,
});
</script>
<style lang="less" scoped>
.input {
  transition: all 0.3s ease;

  &.border-1px {
    border-color: #E11D48;
    background: #FEF2F2;
  }
}

input {
  background: transparent;
  border: none;
  outline: none;

  &::placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &::-webkit-input-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &::-moz-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &:-ms-input-placeholder {
    color: #999999;
    font-size: 14px;
    font-weight: 400;
  }

  &.color-#E11D48 {
    color: #E11D48;
  }
}

.error-tip {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
