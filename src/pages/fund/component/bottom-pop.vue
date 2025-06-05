<template>
  <van-popup v-model:show="showPicker" destroy-on-close round :position="popType == 'discount' ? 'bottom' : 'bottom'"
    :safe-area-inset-bottom="true">
    <div class="w-full p-12 flex flex-col gap-12">
      <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
        <div class="name font-size-14">
          {{ item.name || item.fundInfo.name }}
        </div>
      </div>
      <inputCom :label="popType == 'fund' ? t('BuyShare') : t('SellShare')" :placeholder="t('input.PleaseEnter')"
        v-model:value="form.amount" :tips="`${t('minimum quantity')}${item.minAmount}`" v-if="popType == 'fund'">
      </inputCom>
      <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">
        {{ t('You need to pay') }}{{ item.assetInfo.unit }} {{ item.amount }}
      </div>
      <div class="w-full flex gap-12">
        <div class="btn-box flex-1">
          <van-button type="default" class="h-40!" plain block @click="showPicker = false">{{ t("cancel")
          }}</van-button>
        </div>
        <div class="btn-box flex-1">
          <van-button type="primary" class="h-40!" block @click="confirm">{{
            btnText
          }}</van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
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
const btnText = ref("确认");
watch([() => props.item, () => props.popType], ([item, popType]) => {
  btnText.value = "确认";
  if (popType == "order") {
    if (item.status == "1") {
      btnText.value = "立即支付";
    } else {
      btnText.value = "确认";
    }
  }
});
const form = reactive({
  fundId: "",
  amount: "",
});
const showPicker = ref(false);
const show = (val: boolean) => {
  console.log(props.item);
  if (val) form.amount = "";
  showPicker.value = val;
};

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
<style lang="less" scoped></style>
