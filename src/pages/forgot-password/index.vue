<template>
  <div class="changePassword-content flex flex-col  p-12">

    <div class="top-image w-full bg-[]">
      <CloseButton @close="onBack">
        <template #right>
          <LangSelectDropdown v-model="lang" />

        </template>
      </CloseButton>

    </div>

    <div class="label mb-8 mt-12 font-bold text-[28px]" :class="['flex items-center gap-4']">
      {{ t('Forgot password') }}
    </div>
    <div class="flex flex-col gap-[20px]">
      <div class="phone-input flex items-center gap-[12px]">
        <!-- <div class="picker flex-shrink-0 h-[48px] rounded-[12px] flex items-center justify-center px-16"
        @click="hanleClickAreaPick">
        <div class="iti-flag mr-10 rounded-full" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
        <div class="num">+{{ areaInfo?.dialCode }}</div>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6L8 10L12 6" fill="#1B1B1B" />
        </svg>
      </div> -->
        <inputCom :placeholder="t('PleaseEnterPhoneNumber')" v-model:value="form.account" :tips="''"
          class="flex-1 w-full">
        </inputCom>
      </div>
      <!-- <div class="label mb-8 mt-12" :class="['flex items-center gap-4']">
      {{ t('NewPassword') }}
    </div> -->

      <!-- <div class="label mb-8 mt-12" :class="['flex items-center gap-4']">
      {{ t('VerificationCode') }}
    </div> -->
      <div class="phone-input flex items-center gap-[12px]">
        <inputCom class="w-full" :placeholder="t('VerificationCode')" v-model:value="form.code" :tips="''">
          <template #sendCode>
            <div class="absolute right-0 font-size-12 h-18 flex justify-center items-center sendCode"
              :class="countdown > 0 ? 'text-gray-400' : 'text-[#000]'" @click="getCode">
              {{ countdown > 0 ? `${countdown}s` : t("Get") }}
            </div>
          </template>
        </inputCom>
      </div>
      <div class="phone-input flex items-center gap-[12px]">

        <inputCom class="w-full" v-model:value="form.password" :input-type="'password'" :placeholder="t('NewPassword')">
        </inputCom>
      </div>
      <div class="phone-input flex items-center gap-[12px]">

        <inputCom class="w-full" v-model:value="form.password_confirmation" :input-type="'password'"
          :placeholder="t('Confirm Password')">
        </inputCom>
      </div>
    </div>

    <bottom-button color="#1b1b1b" :button-text="t('Confirm')" @click="onSubmit"></bottom-button>
    <nationalityList ref="controlChildRef" :title="t('Pick')" @getName="getName"></nationalityList>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import local from "@/utils/local";

import { useUserStore } from "@/stores";
import { forgetPassword, sendCode } from "@/api/user";
import loginTab from "@/components/tab.vue";
const { t } = useI18n();
const lang = ref(local.getlocal('lang') || 'en')

const hasLogin = ref(false);
interface formDataInter {
  password: string,
  password_confirmation: string,
  type: string,
  username: string,
  code: string,
  phone: string,
  account: string
  password_type: string
}
const form = reactive<formDataInter>({
  password_type: '3',
  password: "",
  account: '',
  password_confirmation: "",
  type: "phone",
  phone: '',
  username: "",
  code: "",
});
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const toSetLang = () => {
  router.push("/profile/languange");
};
const forgotType = ref(0); // 1 忘记登录密码  2 忘记支付密码
const typeArr = [
  {
    label: `${t("Phone")}`,

    value: "phone",
  },
  {
    label: `${t("Email")}`,

    value: "email",
  },
];
const getName = (val: any) => {
  areaInfo.value = val;
};

const active = ref(0);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);

const countdown = ref(0);
const timer = ref();
const getCode = async () => {
  if (countdown.value > 0) return;

  try {
    let params = {
      type: 'phone',
      phone: `${areaInfo.value.dialCode}${form.phone}`
    };

    await sendCode(params);
    startCountdown();
  } catch (e) {
    // 处理错误
    console.log(e);
  }
};
const areaInfo = ref({
  code: "mx",
  dialCode: 52,
  key: "mx",
  name: "Mexico",
});
const changeActive = (val: any) => {
  active.value = val;
  form.type = val ? "email" : "phone";
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
const controlChildRef = ref();
const hanleClickAreaPick = () => {
  // controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
const onSubmit = async () => {
  let params = {
    ...form,
  };
  params.code = params.code.trim();

  if (params.type == "phone") {
    params.username = `${params.account}`;
  }
  params.password_confirmation = params.password.trim()
  const res = await forgetPassword(params);
  if (res.code === 200) {
    showSuccessToast(t(""));
    setTimeout(() => {
      router.push("/login");
    }, 480)
  }
};

onMounted(async () => {
  if (route.query.type) {
    form.type = route.query.type as string;
    await userStore.info();
    return;
  }
  if (route.query.noLogin) {
    hasLogin.value = true;
  }
});
</script>
<route lang="json5">
{
  name: 'forgotPassword',
  meta: {
    i18n: 'forgotPassword',
  },
}
</route>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

.sendCode {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #868c9a;
  color: #fff;
  background: #424242;
}

.link {
  color: #1678ff;
}

.steps-item,
.line {
  background: #868c9a;
}

.picker-box {
  position: relative;

  &::after {
    content: "";
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 16px;
    background: #868c9a;
  }
}

.green {
  background: #06cda5;
}

.phone-input {
  border: 1px solid #F0F0F0;
  border-radius: 12px;

  :deep(.input-box) {
    /* height: 48px; */
    margin-top: 0px;


  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}
</style>
