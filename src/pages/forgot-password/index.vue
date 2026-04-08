<template>
  <div class="changePassword-content flex flex-col  p-12">

    <div class="top-image w-full bg-[]">
      <CloseButton @close="onBack">
        <template #right>
          <!-- <LangSelectDropdown v-model="lang" /> -->

        </template>
      </CloseButton>

    </div>

    <div class="label mb-8 mt-12 font-bold text-[28px]" :class="['flex items-center gap-4']">
      {{ t('Forgot password') }}
    </div>
    <div class="flex flex-col gap-[20px]">
      <div class="phone-input flex items-center gap-[12px]">
        <div class="picker flex-shrink-0 h-[48px] rounded-[12px] flex items-center justify-center px-16">
          <svg t="1775682910547" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5270" width="22" height="22"><path d="M0 511.48C0 229.004 228.972 0.015 511.465 0.015c282.463 0 511.464 228.989 511.464 511.465l-511.464 44.484L0 511.48z" fill="#FFDA44" p-id="5271"></path><path d="M68.443 767.212c88.449 152.882 253.717 255.718 443.022 255.718 189.305 0 354.605-102.836 443.053-255.718l-443.053-33.365-443.022 33.365z" fill="#D80027" p-id="5272"></path><path d="M954.488 767.212c43.536-75.223 68.441-162.562 68.441-255.715H0c0 93.154 24.908 180.493 68.443 255.715h886.045z" fill="#0052B4" p-id="5273"></path></svg>
          <div class="num">+{{ countryList[active]?.dialCode }}</div>

        </div>
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


  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";

import local from "@/utils/local";
import br from '@/assets/br.png'

import { useUserStore } from "@/stores";
import { forgetPassword, sendCode } from "@/api/user";
import loginTab from "@/components/tab.vue";

import { showToast, showSuccessToast, showFailToast } from 'vant';
const { t } = useI18n();
const lang = ref(local.getlocal('lang') || 'br')

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
let countryList = ref<any>([
  {
    code: "br",
    dialCode: 57,
    key: "br",
    name: "Brazil",
    img: br
  },
  // {
  //   code: "us",
  //   dialCode: 1,
  //   key: "us",
  //   name: "U.S.A",
  //   img: usa
  // },
])
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
      phone: `57${form.account}`
    };

    await sendCode(params);
    startCountdown();
  } catch (e) {
    // 处理错误
    console.log(e);
  }
};
const areaInfo = ref({
  code: "co",
  dialCode: 57,
  key: "co",
  name: "Colombia",
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
  if (!form.account) {
    showFailToast({
      message: 'Por favor, insira a conta'
    })
    return
  }
  let params = {
    ...form,
  };
  params.code = params.code.trim();

  if (params.type == "phone") {
    params.username = `57${params.account}`;
  }
  // params.password_confirmation = params.password.trim()
  if (params.password_confirmation.trim() != params.password.trim()) {
    showFailToast({
      message: 'As senhas não correspondem, por favor, digite novamente'
    })
    return
  }
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
