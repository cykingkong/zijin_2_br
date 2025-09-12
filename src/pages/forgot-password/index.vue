<template>
  <div class="changePassword-content flex flex-col gap-24 p-12">
    <loginTab
      :list="typeArr"
      @change="changeActive"
      class="mb-0"
      v-if="hasLogin"
    ></loginTab>
    <inputCom
      :label="t('Email')"
      v-model:value="form.account"
      :placeholder="t('PleaseEnter')"
      v-if="form.type == 'email'"
    >
    </inputCom>

    <div
      class="phone-input flex items-center gap-12px"
      v-if="form.type == 'phone' && !hasLogin"
    >
      <inputCom
        :label="t('Phone')"
        :placeholder="t('PleaseEnter')"
        v-model:value="form.account"
        :tips="''"
        class="flex-1 w-full"
      >
      </inputCom>
    </div>
    <div
      class="phone-input flex items-center gap-12px"
      v-if="form.type == 'phone' && hasLogin"
    >
      <div
        class="picker flex-shrink-0 h-56px bg-#F8F9FD rounded-12px flex items-center justify-center px-16"
        @click="hanleClickAreaPick"
      >
        <div
          class="iti-flag mr-10 rounded-full"
          :class="areaInfo?.code"
          style="transform: scale(1.5)"
        ></div>
        <div class="num">+{{ areaInfo?.dialCode }}</div>
      </div>
      <inputCom
        :label="t('Phone')"
        :placeholder="t('PleaseEnterPhone')"
        v-model:value="form.phone"
        :tips="''"
        class="flex-1 w-full"
      >
      </inputCom>
    </div>

    <inputCom
      :label="t('NewPassword')"
      v-model:value="form.password"
      :placeholder="t('NewPassword')"
    >
    </inputCom>
    <!-- <inputCom :label="t('input.ConfirmPassword')" v-model:value="form.passwordConfirmation"
      :placeholder="t('input.PleaseEnter')"></inputCom> -->
    <inputCom
      :label="t('VerificationCode')"
      :placeholder="t('VerificationCode')"
      v-model:value="form.captcha"
      :tips="''"
    >
      <template #sendCode>
        <div
          class="absolute right-0 font-size-12 sendCode text-#000"
          @click="getCode"
        >
          {{ countdown > 0 ? `${countdown}s` : t("SendCode") }}
        </div>
      </template>
    </inputCom>
    <van-button
      type="primary"
      class="h-56px"
      color="#6b39f4"
      block
      @click="onSubmit"
      >{{ t("Confirm") }}</van-button
    >
    <nationalityList
      ref="controlChildRef"
      :title="t('Pick')"
      @getName="getName"
    ></nationalityList>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";

import { useUserStore } from "@/stores";
import { forgetPassword, sendCode } from "@/api/user";
import loginTab from "@/components/tab.vue";
const { t } = useI18n();
const hasLogin = ref(false);
const form = reactive({
  password: "",
  passwordConfirmation: "",
  type: "phone",
  username: "",
  captcha: "",
});
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
watch(
  () => userInfo.value,
  () => {
    if (hasLogin.value) {
      return;
    }
    if (userInfo.value?.phone) {
      form.type = "phone";
      form.account = userInfo.value?.phone;
    }
    if (userInfo.value?.email) {
      form.type = "email";
      form.account = userInfo.value?.email;
    }
  },
  {
    immediate: true,
  }
);
const countdown = ref(0);
const timer = ref();
const getCode = async () => {
  if (countdown.value > 0) return;
  if (!form.account && !hasLogin.value) {
    showToast(t("PleaseEnter"));
    return;
  }
  if (hasLogin.value) {
    if (form.type == "email" && !form.account) {
      showToast(t("PleaseEnter"));
      return;
    }
    if (form.type == "phone" && !form.phone) {
      showToast(t("PleaseEnter"));
      return;
    }
  }

  try {
    let params = {
      type: form.type,
      account:
        hasLogin.value && form.type == "phone"
          ? `${areaInfo.value.dialCode}${form.phone}`
          : form.account,
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
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
const onSubmit = async () => {
  let params = {
    ...form,
  };
  params.captcha = params.captcha.trim();
  if (hasLogin) {
    if (params.type == "phone") {
      params.account = `${areaInfo.value.dialCode}${params.phone}`;
    }
  }

  const res = await forgetPassword(params);
  if (res.code === 200) {
    showSuccessToast(t(""));
    router.push("/login");
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
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #868c9a;
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
</style>
