<template>
  <van-popup
    v-model:show="showPicker"
    destroy-on-close
    round
    z-index="10000"
    :position="popType == 'discount' ? 'bottom' : 'bottom'"
    :safe-area-inset-bottom="true"
  >
    <div class="w-40 h-6 rounded-6px bg-#E2E8F0 mt-12px mx-auto"></div>
    <div class="w-full p-12 flex flex-col gap-12">
      <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
        <div class="name font-size-16 font-bold flex items-center gap-6">
          {{ item.name || item.fund_name }}
          <svg
            width="14"
            height="14"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.78 5.36978L10.1 4.57979C9.97 4.42979 9.865 4.14979 9.865 3.94979V3.09979C9.865 2.56979 9.43 2.13479 8.9 2.13479H8.05C7.855 2.13479 7.57 2.02979 7.42 1.89979L6.63 1.21979C6.285 0.924785 5.72 0.924785 5.37 1.21979L4.585 1.90479C4.435 2.02979 4.15 2.13479 3.955 2.13479H3.09C2.56 2.13479 2.125 2.56979 2.125 3.09979V3.95479C2.125 4.14979 2.02 4.42979 1.895 4.57979L1.22 5.37478C0.930002 5.71978 0.930002 6.27979 1.22 6.62478L1.895 7.41979C2.02 7.56979 2.125 7.84978 2.125 8.04479V8.89978C2.125 9.42978 2.56 9.86479 3.09 9.86479H3.955C4.15 9.86479 4.435 9.96979 4.585 10.0998L5.375 10.7798C5.72 11.0748 6.285 11.0748 6.635 10.7798L7.425 10.0998C7.575 9.96979 7.855 9.86479 8.055 9.86479H8.905C9.435 9.86479 9.87 9.42978 9.87 8.89978V8.04979C9.87 7.85478 9.975 7.56979 10.105 7.41979L10.785 6.62979C11.075 6.28479 11.075 5.71478 10.78 5.36978ZM8.08 5.05478L5.665 7.46978C5.595 7.53978 5.5 7.57978 5.4 7.57978C5.3 7.57978 5.205 7.53978 5.135 7.46978L3.925 6.25979C3.78 6.11479 3.78 5.87478 3.925 5.72978C4.07 5.58478 4.31 5.58478 4.455 5.72978L5.4 6.67479L7.55 4.52479C7.695 4.37979 7.935 4.37979 8.08 4.52479C8.225 4.66979 8.225 4.90978 8.08 5.05478Z"
              fill="#1BC256"
            />
          </svg>
        </div>
      </div>
      <div class="fundDivider w-full h-1px bg-#EBECEF"></div>

      <!-- <inputCom :label="popType == 'fund' ? t('BuyShare') : t('SellShare')" :placeholder="t('input.PleaseEnter')"
        v-model:value="form.amount" v-if="popType == 'fund'">
      </inputCom> -->
      <div
        class="input w-full rounded-12px bg-#F8F9FD text-align-center font-bold items-center text-16px h-58px flex px-24px gap-8px"
        :class="{
          'border-1px border-#E11D48': isInvalidAmount || isInvalidFormat,
        }"
        v-if="popType == 'fund'"
      >
        <div class="unit text-16px">MX$</div>
        <input
          type="text"
          placeholder=""
          v-model="form.amount"
          @input="handleAmountInput"
          @blur="handleAmountBlur"
          class="w-full h-full text-16px text-align-left input"
          :class="{ 'color-#E11D48': isInvalidAmount || isInvalidFormat }"
        />
      </div>

      <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">
        {{ t("You need to pay") }} MX$ {{ addCommasToNumber(item.amount) }}
      </div>
      <div class="w-full flex gap-12">
        <!-- <div class="btn-box flex-1">
          <van-button type="default" class="h-40!" plain block @click="showPicker = false">{{ t("cancel")
            }}</van-button>
        </div> -->
        <div class="btn-box flex-1">
          <van-button
            type="primary"
            color="#6B39F4"
            class="h-56px! rounded-12px"
            block
            @click="confirm"
            >{{ t(btnText) }}</van-button
          >
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import { addCommasToNumber } from "@/utils/tool";

const { t } = useI18n();
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  popType: {
    type: String,
    default: "fund",
  },
});
const emits = defineEmits(["onConfirm"]);
const btnText = ref("Confirm");
const isInvalidAmount = ref(false);
const isInvalidFormat = ref(false);
watch([() => props.item, () => props.popType], ([item, popType]) => {
  btnText.value = "Confirm";
  if (popType == "order") {
    if (item.status == "1") {
      btnText.value = "Buy";
    } else {
      btnText.value = "Confirm";
    }
  }
});
const form = reactive({
  id: "",
  amount: "",
});
const showPicker = ref(false);
const show = (val: boolean) => {
  if (val) {
    form.amount = props.item.min_amount || "";
  }
  showPicker.value = val;
};

const handleAmountInput = () => {
  // 检查是否为正整数
  const positiveIntegerRegex = /^[1-9]\d*$/;
  if (!positiveIntegerRegex.test(form.amount)) {
    isInvalidFormat.value = true;
    isInvalidAmount.value = false;
    return;
  }

  isInvalidFormat.value = false;
  const inputValue = parseFloat(form.amount) || 0;
  if (inputValue < props.item.minAmount) {
    isInvalidAmount.value = true;
  } else {
    isInvalidAmount.value = false;
  }
};

const handleAmountBlur = () => {
  // 检查是否为正整数
  const positiveIntegerRegex = /^[1-9]\d*$/;
  if (!positiveIntegerRegex.test(form.amount)) {
    isInvalidFormat.value = true;
    isInvalidAmount.value = false;
    // 清空无效输入
    form.amount = props.item.minAmount.toString();
    return;
  }

  isInvalidFormat.value = false;
  const inputValue = parseFloat(form.amount) || 0;
  if (inputValue < props.item.minAmount) {
    isInvalidAmount.value = true;
    // 如果输入值小于最小金额，重置为最小金额
    form.amount = props.item.minAmount.toString();
  } else {
    isInvalidAmount.value = false;
  }
};
const confirm = () => {
  form.id = props.item.id;
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
    border-color: #e11d48;
    background: #fef2f2;
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
    color: #e11d48;
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
