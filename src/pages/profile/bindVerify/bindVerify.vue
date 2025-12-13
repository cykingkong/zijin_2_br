<template>
  <div class="bindVerify-content p-12 flex flex-col gap-24">
    <nationalityList ref="controlChildRef" :title="t('Pick')" @getName="getName"></nationalityList>
    <div class="phone-input flex items-center gap-[12px]" v-if="form.type == 'phone'">
      <div class="picker flex-shrink-0 h-[56px] bg-[#F8F9FD] rounded-[12px] flex items-center justify-center px-16"
        @click="hanleClickAreaPick">
        <div class="iti-flag mr-10 rounded-full" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
        <div class="num">+{{ areaInfo?.dialCode }}</div>
      </div>
      <inputCom :label="t('input.Phone')" :placeholder="t('Phone')" v-model:value="form.phone" :tips="''"
        class="flex-1 w-full">
      </inputCom>
    </div>
    <!-- <inputCom :label="t('input.Phone')" :placeholder="t('input.PleaseEnter')" v-model:value="form.phone" :tips="''">
      <template #picker>
        <div class="picker-box pr-8 mr-6 h-full flex items-center gap-8" @click="hanleClickAreaPick">

          <div class="iti-flag mr-10" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
      </template>
</inputCom> -->
    <inputCom :label="t('VerificationCode')" :placeholder="t('VerificationCode')" v-model:value="form.code" :tips="''">
      <template #sendCode>
        <div class="absolute right-0 font-size-12 sendCode text-[#000]" @click="getCode">
          {{ countdown > 0 ? `${countdown}s` : t("SendCode") }}
        </div>
      </template>
    </inputCom>
    <van-button type="primary" block @click="handleClickSubmit">{{
      t("Confirm")
    }}</van-button>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { sendCode, bindPhone, kyc } from "@/api/user";
import { useLoadingStore } from "@/stores/modules/loading";
const loadingStore = useLoadingStore();
const { t } = useI18n();
const { proxy } = getCurrentInstance();
const form = reactive({
  phone: "",
  type: "phone",
  code: "",
});
const timer = ref<NodeJS.Timeout>();

const countdown = ref(0);
const areaInfo = ref({
  code: "mx",
  dialCode: 52,
  key: "mx",
  name: "Mexico",
});
const router = useRouter();
const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();
};
const handleClickSubmitOriginal = async () => {
  try {
    let area = areaInfo.value?.dialCode;

    let params = {
      phone: area + form.phone,
      type: form.type,
      captcha: form.code,
    };
    const { data, code } = await bindPhone(params);
    if (code == 200) {
      showSuccessToast({});
      setTimeout(() => {
        router.back();
      }, 1000);
    }
  } catch (err) {
    console.log(err);
  }
};
const handleClickSubmit = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});
const getCode = async () => {
  if (countdown.value > 0) return;
  if (!form.phone && form.type == "phone") {
    showToast(t("PleaseEnter"));
    return;
  }

  try {
    let area = areaInfo.value?.dialCode;
    let params = {
      account: area + form.phone,

      type: form.type,
    };
    await sendCode(params);
    startCountdown();
  } catch (e) {
    // 处理错误
  }
};

const startCountdown = () => {
  countdown.value = 60;
  timer.value = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer.value);
      timer.value = undefined;
    }
  }, 1000);
};
const getName = (val: any) => {
  console.log(val, "vvvv");
  areaInfo.value = val;
};
</script>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

.sendCode {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #868c9a;
}
</style>
<route lang="json5">
{
  meta: {
    i18n: 'Phone verification'
  },
}
</route>
