<script setup lang="ts">
import { useRouter } from "vue-router";
import inputCom from "@/components/inputCom.vue";
import CloseButton from "@/components/CloseButton.vue";
import { forgetPassword, sendCode } from "@/api/user";

const { t } = useI18n();
const router = useRouter();

const loading = ref(false);
const inputType = ref("password");
const countdown = ref(0);
const timer = ref<number | undefined>();

const formData = reactive({
  account: "",
  password: "",
  code: "",
});

const validateEmail = (account: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account);

const onBack = () => {
  if (window.history.state.back)
    history.back();
  else
    router.replace("/login");
};

const changeInputType = () => {
  inputType.value = inputType.value === "password" ? "text" : "password";
};

const startCountdown = () => {
  countdown.value = 60;
  timer.value = window.setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0 && timer.value) {
      clearInterval(timer.value);
      timer.value = undefined;
    }
  }, 1000);
};

const getCode = async () => {
  if (countdown.value > 0)
    return;
  if (!formData.account || !validateEmail(formData.account)) {
    showToast(t("PleaseEnterEmail"));
    return;
  }

  await sendCode({
    type: "email",
    account: formData.account,
  });
  startCountdown();
};

const resetPassword = async () => {
  if (!formData.account || !validateEmail(formData.account)) {
    showToast(t("PleaseEnterEmail"));
    return;
  }
  if (!formData.code) {
    showToast(t("Please Enter Code"));
    return;
  }
  if (!formData.password) {
    showToast(t("Please Enter Password"));
    return;
  }

  loading.value = true;
  try {
    await forgetPassword({
      account: formData.account,
      password: formData.password,
      code: formData.code,
    });
    showToast(t("Success"));
    router.replace("/login");
  }
  finally {
    loading.value = false;
  }
};

onUnmounted(() => {
  if (timer.value)
    clearInterval(timer.value);
});
</script>

<template>
  <div class="forgot-password-page m-x-a w-full min-h-screen px-[20px] pt-[24px] pb-[40px]">
    <div class="forgot-password-hero">
      <CloseButton>
        <template #left>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" @click="onBack">
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="#111111" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="rgba(255,255,255,0.06)" />
            <path d="M21.6667 16.6667L18.3333 20L21.6667 23.3333" stroke="#F5F5F5" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </template>
        <template #right>
          <div class="e"></div>
        </template>
      </CloseButton>

      <div class="mid-logo h-[64px] overflow-hidden ml-[16px] mt-[20px]">
        <img src="@/assets/logo.jpg" alt="" class="w-auto h-full block">
      </div>

      <!-- <div class="text-left m-x-a mt-[20px] px-[16px]">
        <div class="hero-tag">{{ t("Recover Access") }}</div>
        <div class="text-[32px] font-bold leading-[1.15] mt-[14px] text-[#F5F5F5]">
          {{ t("Forgot Password") }}
        </div>
        <div class="hero-subtitle mt-[10px]">
          {{ t("ResetPasswordSubtitle") }}
        </div>
      </div> -->
    </div>

    <div class="forgot-password-form mt-[24px] p-[20px]">
      <!-- <div class="info-panel mb-[20px]">
        <div class="info-panel__title">{{ t("Security Verification") }}</div>
        <div class="info-panel__desc">
          {{ t("ResetPasswordTips") }}
        </div>
      </div> -->

      <div class="form-input mb-20">
        <inputCom v-model:value="formData.account" :placeholder="t('PleaseEnterEmail')" :tips="''" class="flex-1 w-full" />
      </div>

      <div class="form-input mb-20">
        <inputCom v-model:value="formData.code" :placeholder="t('Code')" :onlyRead="false" :inputType="'text'">
          <template #sendCode>
            <div class="absolute right-0 font-size-12 h-18 flex justify-center items-center send-code"
              :class="countdown > 0 ? 'send-code--disabled' : ''" @click="getCode">
              {{ countdown > 0 ? `${countdown}s` : t("Get") }}
            </div>
          </template>
        </inputCom>
      </div>

      <div class="form-input mb-20">
        <inputCom v-model:value="formData.password" :placeholder="t('Password')" :onlyRead="false" :inputType="inputType">
          <template #sendCode>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              @click="changeInputType" v-if="inputType === 'text'">
              <path d="M3 3L21 21" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M10.584 10.587C10.2087 10.962 9.99775 11.4708 9.99756 12.0013C9.99737 12.5318 10.2079 13.0407 10.583 13.416C10.958 13.7913 11.4667 14.0022 11.9973 14.0024C12.5278 14.0026 13.0367 13.792 13.412 13.417"
                stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M9.363 5.365C10.2204 5.11972 11.1082 4.99684 12 5C16 5 19.333 7.333 22 12C21.222 13.361 20.388 14.524 19.497 15.488M17.357 17.349C15.726 18.449 13.942 19 12 19C8 19 4.667 16.667 2 12C3.369 9.605 4.913 7.825 6.632 6.659"
                stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              v-else @click="changeInputType">
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z"
                stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </inputCom>
      </div>

      <van-button type="primary" color="#1B1B1B" class="submit-btn h-[52px]! rounded-full!" block :loading="loading"
        @click="resetPassword">
        {{ t("Reset Password") }}
      </van-button>

      <div class="switch-entry" @click="router.replace('/login')">
        <span class="switch-entry__muted">{{ t("RememberPasswordPrompt") }}</span>
        {{ t("Log in") }}
      </div>
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'forgotPassword',
  meta: {
    i18n: 'login'
  },
}
</route>

<style lang="less" scoped>
.forgot-password-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(124, 255, 178, 0.16), transparent 32%),
    linear-gradient(180deg, #050505 0%, #000000 100%);
  color: #f5f5f5;
}

.forgot-password-hero {
  position: relative;
  padding: 8px 0 0;
}

.hero-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border: 1px solid rgba(124, 255, 178, 0.35);
  border-radius: 999px;
  background: rgba(124, 255, 178, 0.08);
  color: #8bffbe;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-subtitle {
  color: #a3a3a3;
  font-size: 14px;
  line-height: 1.6;
}

.forgot-password-form {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.45);
}

.info-panel {
  position: relative;
  overflow: hidden;
  padding: 14px 16px;
  border: 1px solid rgba(216, 146, 27, 0.25);
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(216, 146, 27, 0.16) 0%, rgba(43, 28, 7, 0.26) 100%);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.info-panel::before {
  content: "";
  position: absolute;
  top: 12px;
  left: 0;
  width: 3px;
  height: calc(100% - 24px);
  border-radius: 999px;
  background: #d8921b;
}

.info-panel__title {
  padding-left: 12px;
  color: #f5f5f5;
  font-size: 14px;
  font-weight: 700;
}

.info-panel__desc {
  margin-top: 6px;
  padding-left: 12px;
  color: #d0d0d0;
  font-size: 12px;
  line-height: 1.6;
}

.submit-btn {
  margin-top: 24px;
}

.switch-entry {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: 14px;
  color: #8bffbe;
  font-weight: 700;
  text-align: center;
}

.switch-entry__muted {
  color: #6b6b6b;
  font-weight: 500;
}
</style>

<style scoped>
.form-input {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);

  :deep(.input-box) {
    margin-top: 0;
    background: transparent;
  }

  :deep(input),
  :deep(textarea) {
    color: #f5f5f5;
  }

  :deep(input::placeholder),
  :deep(textarea::placeholder) {
    color: #6b6b6b;
  }
}

.send-code {
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(124, 255, 178, 0.2);
  color: #8bffbe;
  background: rgba(124, 255, 178, 0.08);
}

.send-code--disabled {
  color: #9ca3af;
  border-color: rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
}
</style>
