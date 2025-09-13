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
          <img :src="item.logo" alt="" v-if="item.logo" class="w-full h-full" />
          <img
            :src="item.ipoInfo.logo"
            alt=""
            v-if="item.ipoInfo"
            class="w-full h-full"
          />
        </div>
        <div class="name font-size-14">
          {{ item.name ? item.name : item.ipoInfo ? item.ipoInfo.name : "" }}
        </div>
      </div>
      <inputCom
        :label="
          popType == 'ipo' ? t('Subscription number') : t('Quantity sold')
        "
        :placeholder="t('input.PleaseEnter')"
        v-model:value="form.number"
        v-if="popType == 'ipo'"
      >
      </inputCom>
      <div class="sell-tips font-size-18 font-500" v-if="popType == 'order'">
        {{ t("All IPO shares will be sold out, please confirm!") }}
      </div>
      <div class="w-full flex gap-12">
        <div class="btn-box flex-1">
          <van-button
            type="default"
            class="h-40!"
            plain
            block
            @click="showPicker = false"
            v-if="popType == 'order'"
            >{{ t("cancel") }}</van-button
          >
          <van-button
            type="default"
            class="h-40!"
            plain
            block
            @click="confirm"
            v-else
            >{{ t("subscription") }}</van-button
          >
        </div>
        <div class="btn-box flex-1">
          <van-button
            type="primary"
            class="h-40!"
            block
            @click="confirm"
            v-if="popType == 'order'"
            >{{ t("Confirm") }}</van-button
          >
          <van-button
            type="primary"
            class="h-40!"
            block
            @click="confirmAll"
            v-else
            >{{ t("subscription all") }}</van-button
          >
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
    default: () => {},
  },
  popType: {
    type: String,
    default: "",
  },
});
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

const confirm = () => {
  form.ipoId = props.item.ipoId;
  let params = {
    ...form,
    type: props.popType,
  };
  emits("onConfirm", params);
};
const confirmAll = () => {
  let params = {
    ipoId: props.item.ipoId,
    type: props.popType,
    full: true,
  };
  emits("onConfirm", params);
};
defineExpose({
  show,
});
</script>
<style lang="less" scoped></style>
