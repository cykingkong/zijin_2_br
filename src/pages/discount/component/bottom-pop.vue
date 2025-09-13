<template>
  <van-popup
    v-model:show="showPicker"
    destroy-on-close
    round
    :position="'bottom'"
    :safe-area-inset-bottom="true"
    z-index="10000"
  >
    <div class="w-full p-12 flex flex-col gap-12">
      <div class="l flex flex-[2] flex-shrink-0 items-center gap-6">
        <div class="logo w-25 h-25 rounded-full overflow-hidden">
          <img :src="item.logo" alt="" class="w-full h-full" />
        </div>
        <div class="name font-size-14">
          {{ item.symbol }}
        </div>
      </div>
      <inputCom
        :label="popType == 'discount' ? t('BuyShare') : t('SellShare')"
        :tips="tips"
        :placeholder="t('input.PleaseEnter')"
        v-model:value="form.number"
        v-if="popType == 'discount'"
      >
      </inputCom>
      <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">
        {{ t("Discounted stocks will be sold, please confirm!") }}
      </div>
      <div class="w-full flex gap-12">
        <div class="btn-box flex-1">
          <van-button
            type="default"
            class="h-40!"
            plain
            block
            @click="showPicker = false"
            >{{ t("Cancel") }}</van-button
          >
        </div>
        <div class="btn-box flex-1">
          <van-button type="primary" class="h-40!" block @click="confirm">{{
            t("Confirm")
          }}</van-button>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
const props = defineProps({
  item: {
    type: Object,
    default: () => {},
  },
  popType: {
    type: String,
    default: "",
  },
});
const { t } = useI18n();
const emits = defineEmits(["onConfirm"]);
const form = reactive({
  id: "",
  number: "",
});
const showPicker = ref(false);
const show = (val: boolean) => {
  if (val) form.number = "";
  showPicker.value = val;
};
const tips = ref("");
watch(
  () => props.item,
  (newVal) => {
    if (newVal) {
      tips.value = `${t("MinBuyShare")}:${newVal.min}`;
    }
  },
  {
    immediate: true,
  }
);
const confirm = () => {
  if (form.number == "" && props.popType == "discount") {
    showToast(t("PleaseEnter"));
    return;
  }
  form.id = props.item.id;
  let params = {
    ...form,
    type: props.popType,
  };
  emits("onConfirm", params);
};
defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
