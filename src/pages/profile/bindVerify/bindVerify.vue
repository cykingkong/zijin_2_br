<template>
  <div class="bindVerify-content p-12 flex flex-col gap-24">
    <nationalityList
      ref="controlChildRef"
      :title="t('pick')"
      @getName="getName"
    ></nationalityList>

    <inputCom
      :label="t('input.Phone')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.phone"
      :tips="''"
    >
      <template #picker>
        <div
          class="picker-box pr-8 mr-6 h-full flex items-center gap-8"
          @click="hanleClickAreaPick"
        >
          <!-- <img :src="icon1" alt="" class="w16 h16"> -->
          <div
            class="iti-flag mr-10"
            :class="areaInfo?.code"
            style="transform: scale(1.5)"
          ></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
      </template>
    </inputCom>
    <inputCom
      :label="t('VerificationCode')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.code"
      :tips="''"
    >
      <template #sendCode>
        <div
          class="absolute right-0 font-size-12 sendCode"
          :class="countdown > 0 ? 'text-gray-400' : 'text-blue-500'"
          @click="getCode"
        >
          {{ countdown > 0 ? `${countdown}s` : t("input.SendCode") }}
        </div>
      </template>
    </inputCom>
    <van-button type="primary" block @click="handleClickSubmit">{{
      t("confirm")
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
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
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
      code: form.code,
    };
    const { data, code } = await bindPhone(params);
    if (code == 200) {
      showToast(t("Binding successful"));
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
    showToast("input.PleaseEnter");
    return;
  }

  try {
    let area = areaInfo.value?.dialCode;
    let params = {
      phone: area + form.phone,

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
</style>
