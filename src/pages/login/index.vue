<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
import { useLoadingStore } from "@/stores/modules/loading";
import inputCom from "@/components/inputCom.vue";
import CloseButton from "@/components/CloseButton.vue";
import { locale } from "@/utils/i18n";
import { sendCode } from "@/api/user";
import local from "@/utils/local";

const lang = ref(local.getlocal('lang') || 'en')

const pageType = ref(0) // 0 login 1 register 2 changePwd
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const loadingStore = useLoadingStore();
const loading = ref(false);
const remember = ref(false);
function onBack() {
  if (pageType.value == 1) {
    pageType.value = 0
    return
  }
  if (window.history.state.back) history.back();
  else router.replace("/");
}
onMounted(async () => {
  if (route.query.token) {
    let t = route.query.token
    await userStore.loginByToken({ token: t })
    localStorage.setItem("language", "br");
    locale.value = "br";
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: "home",
      query: {
        ...othersQuery,
      },
    });
    return
  }
  // 页面加载时检查是否有保存的登录信息
  const savedLoginInfo = localStorage.getItem("remember");
  if (savedLoginInfo) {
    try {
      const parsedInfo = JSON.parse(savedLoginInfo);
      remember.value = true;
      postData.account = parsedInfo.account || "";
      postData.password = parsedInfo.password || "";
    } catch (error) {
      console.error("解析保存的登录信息失败:", error);
      localStorage.removeItem("remember");
    }
  }
  if (route.query.loginType) {
    pageType.value = Number(route.query.loginType)
  }
  if (route.query.inviteCode) {
    postData.inviteCode = route.query.inviteCode as string
  }

});


const inputType = ref("password");
const changeInputType = () => {
  inputType.value = inputType.value == "password" ? "text" : "password";
};

const postData = reactive({
  account: "",
  password: "",
  passwordConfirmation: '',
  type: "email",
  code: "", inviteCode: '',

});
/* 验证码开始 */
const countdown = ref(0)
const timer = ref()
const getCode = async () => {
  if (countdown.value > 0) return
  if (!postData.account) {
    showToast(t('PleaseEnterEmail'))
    return
  }
  if (!validateEmail(postData.account)) {
    showToast(t('PleaseEnterEmail'))
    return
  }
  try {
    await sendCode({
      type: 'email',

      account: postData.account
    })
    startCountdown()
  } catch (e) {
    console.log(e)
  }
}
const startCountdown = () => {
  countdown.value = 60
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
      timer.value = undefined
    }
  }, 1000)
}
/* 验证码结束 */

const toForgotPassword = () => {
  try {
    router.push("/forgot-password?noLogin=1");
  } catch (e) {
    console.log(e);
  }
};
const changePageType = () => {
  pageType.value = pageType.value == 0 ? 1 : 0;
};
const validateEmail = (account: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account)

// 校验帐号密码必填
const validateAccountPassword = () => {
  if (!postData.account) {
    showToast(t('PleaseEnterEmail'))
    return false
  }
  if (!validateEmail(postData.account)) {
    showToast(t('PleaseEnterEmail'))
    return false
  }
  if (!postData.password) {
    showToast(t('Please Enter Password'))
    return false
  }
  return true
}
async function signUp() {
  if (!validateAccountPassword()) return
  if (!postData.code) {
    showToast(t('Please Enter Code'))
    return
  }
  try {
    let params = {
      "type": 'email',
      "account": postData.account,
      "code": postData.code,
      "invite_code": postData.inviteCode,
      "password": postData.password
    }
    await userStore.register(params);
    // pageType.value = 0
    localStorage.setItem("language", "br");
    locale.value = "br";
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: "home",
      query: {
        ...othersQuery,
      },
    });
  } catch (e) {
    console.log(e)
  }
}
async function login() {
  if (!validateAccountPassword()) {
    return;
  }

  if (remember.value) {
    localStorage.setItem("remember", JSON.stringify(postData));
  } else {
    localStorage.removeItem("remember");
  }

  try {
    loading.value = true;
    let params = {
      account: postData.account,
      password: postData.password,
      // type: 'email',
    };
    await userStore.login(params);
    localStorage.setItem("language", "br");
    locale.value = "br";
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: "home",
      query: {
        ...othersQuery,
      },
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-page m-x-a w-full min-h-screen px-[20px] pt-[24px] pb-[40px]">

    <div class="login-hero">
      <CloseButton>
        <template #left>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" @click="onBack"
            v-if="pageType == 1">
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="#111111" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="rgba(255,255,255,0.06)" />
            <path d="M21.6667 16.6667L18.3333 20L21.6667 23.3333" stroke="#F5F5F5" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="e" v-else></div>
        </template>
        <template #right>
          <!-- <LangSelectDropdown v-model="lang" /> -->
        </template>
      </CloseButton>
      <div class="mid-logo h-[64px] rounded-[16px] overflow-hidden ml-[16px] mt-[20px]">
        <img src="@/assets/Logo.png" alt="" class="w-auto h-full">
      </div>
      <div class="text-left m-x-a mt-[20px] px-[16px]">
        <div class="hero-tag">{{ pageType == 0 ? t("Secure Access") : t("Create Account") }}</div>
        <div class="t text-[32px] font-bold leading-[1.15] mt-[14px] text-[#F5F5F5]">
          {{ t("Welcome") }}
        </div>
        <div class="hero-subtitle mt-[10px]">
          {{ pageType == 0 ? t("Log in to continue securely.") : t("Register to start securely.") }}
        </div>
      </div>
    </div>
    <div class="login-form mt-[24px] p-[20px]">
      <div class="phone-input mb-20">
        <inputCom :placeholder="t('PleaseEnterEmail')" v-model:value="postData.account" :tips="''"
          class="flex-1 w-full">
        </inputCom>
      </div>

      <div class="phone-input mb-20">
        <inputCom v-model:value="postData.password" :placeholder="t('Password')" :onlyRead="false"
          :inputType="inputType">
          <template #sendCode>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              @click="changeInputType" v-if="inputType == 'text'">
              <path d="M3 3L21 21" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M10.584 10.587C10.2087 10.962 9.99775 11.4708 9.99756 12.0013C9.99737 12.5318 10.2079 13.0407 10.583 13.416C10.958 13.7913 11.4667 14.0022 11.9973 14.0024C12.5278 14.0026 13.0367 13.792 13.412 13.417"
                stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M9.363 5.365C10.2204 5.11972 11.1082 4.99684 12 5C16 5 19.333 7.333 22 12C21.222 13.361 20.388 14.524 19.497 15.488M17.357 17.349C15.726 18.449 13.942 19 12 19C8 19 4.667 16.667 2 12C3.369 9.605 4.913 7.825 6.632 6.659"
                stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              v-if="inputType == 'password'" @click="changeInputType">
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
      <!-- Confirm password -->
      <!-- <div class="label mb-8 mt-12" :class="['flex items-center gap-4']" v-if="pageType == 1">
        {{ t('Confirm password') }}
      </div> -->
      <!-- <div class="phone-input mb-20" v-if="pageType == 1">
        <inputCom v-model:value="postData.passwordConfirmation" :placeholder="t('Password')" :onlyRead="false"
          :inputType="inputType">
          <template #sendCode>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              @click="changeInputType" v-if="inputType == 'text'">
              <path d="M3 3L21 21" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M10.584 10.587C10.2087 10.962 9.99775 11.4708 9.99756 12.0013C9.99737 12.5318 10.2079 13.0407 10.583 13.416C10.958 13.7913 11.4667 14.0022 11.9973 14.0024C12.5278 14.0026 13.0367 13.792 13.412 13.417"
                stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M9.363 5.365C10.2204 5.11972 11.1082 4.99684 12 5C16 5 19.333 7.333 22 12C21.222 13.361 20.388 14.524 19.497 15.488M17.357 17.349C15.726 18.449 13.942 19 12 19C8 19 4.667 16.667 2 12C3.369 9.605 4.913 7.825 6.632 6.659"
                stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              v-if="inputType == 'password'" @click="changeInputType">
              <path
                d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
                stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z"
                stroke="#F5F5F5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </inputCom>
      </div> -->
      <!-- <div class="label mb-8 mt-12" :class="['flex items-center gap-4']" v-if="pageType == 1">
        {{ t('Invitation code') }}
      </div>
      -->
      <!-- Invitation code -->

      <div class="phone-input mb-20" v-if="pageType == 1">
        <inputCom v-model:value="postData.inviteCode" :placeholder="t('Invitation code')" :onlyRead="false"
          :inputType="'text'">
        </inputCom>
      </div>
      <!-- Code -->

      <div class="phone-input" v-if="pageType == 1">
        <inputCom v-model:value="postData.code" :placeholder="t('Code')" :onlyRead="false" :inputType="'text'">
          <template #sendCode>
            <div class="absolute right-0 font-size-12 h-18 flex justify-center items-center sendCode"
              :class="countdown > 0 ? 'text-gray-400' : 'text-[#000]'" @click="getCode">
              {{ countdown > 0 ? `${countdown}s` : t("Get") }}
            </div>
          </template>
        </inputCom>
      </div>

    <!--   <div class="flex justify-between items-center mt-[16px] mb-[24px] gap-16">
        <div class="left flex font-size-[14px] font-medium flex-shrink-0 gap-[12px] flex-shrink-0">
          <div class="radio w-[16px] h-[16px] rounded-[4px] border" :class="remember ? 'radio-active' : ''"
            @click="remember = !remember"></div>
          {{ t("Remember me") }}
        </div>
        <div class="right color-[#1b1b1b] font-size-[14px] font-bold cursor-pointer flex-shrink-0"
          @click="toForgotPassword()">
          {{ t("Forgot Password") }}
        </div>
      </div> -->
      <van-button type="primary" color="#1B1B1B" class="login-btn h-[52px]! rounded-full!" block
        @click="pageType == 0 ? login() : signUp()">{{
          pageType == 0 ? t("Login") : t("Sign Up")
        }}</van-button>
      <div class="switch-entry"
        @click="changePageType()">
        <span class="switch-entry__muted"> {{ pageType == 0 ? t("Don’t have an account?") : '' }} </span> {{
          pageType == 0 ? t("Sign Up") : t("Log in")
        }}
      </div>
      <!--  <div class="tips my-24px">Or sign in with</div>
       <div class="flex gap-16px ">
        <div
          class="plain-btn w-full flex-1 border-1px border-solid h-56px border-#E2E8F0 rounded-12px color-#0F172A flex items-center justify-center gap-8px">
          <img :src="Apple" alt="" class="w-24px h-24px"> {{
            t("Apple")
          }}
        </div>
        <div
          class="plain-btn w-full flex-1 border-1px border-solid h-56px border-#E2E8F0 rounded-12px color-#0F172A flex items-center justify-center gap-8px">

          <img :src="Google" alt="" class="w-24px h-24px">
          {{
            t("Google")
          }}
        </div>
      </div> -->
      <!-- <div class="mt-[36px] justify-center text-center">
        {{ t("Don't have an account?")
        }}<span @click="changePageType()" class="ml-[4px] color-[#6b39f4]">
          {{ $t("Sign Up") }}
        </span>
      </div> -->
    </div>
  </div>
</template>

<route lang="json5">
{
  name: 'login',
  meta: {
    i18n: 'login'
  },
}
</route>
<style lang="less" scoped>
.login-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top, rgba(124, 255, 178, 0.16), transparent 32%),
    linear-gradient(180deg, #050505 0%, #000000 100%);
  color: #f5f5f5;
}

.login-hero {
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

.login-form {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.45);
}

.login-btn {
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

.signUpBtn {
  :deep(.van-button--primary) {
    color: #1B1B1B;
  }
}
</style>
<style scoped>
@import "@/components/nationality-list/intl.css";

.radio {
  border: 1px solid #cbd5e1;
}

.tips {
  position: relative;
  text-align: center;
  margin-top: 24px;
  color: #94a3b8;
  font-size: 14px;
  padding: 0 56px;
}

.tips::before,
.tips::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 44px;
  height: 1px;
  background-color: #cbd5e1;
  transform: translateY(-50%);
}

.tips::before {
  left: 0;
}

.tips::after {
  right: 0;
}

.radio.radio-active {
  background-color: #6b39f4;
  border-color: #6b39f4;
}

.radio.radio-active::after {
  content: "";
  width: 8px;
  height: 4px;
  border: 2px solid #ffffff;
  border-top: none;
  border-right: none;
  transform: rotate(-45deg);
  position: absolute;
  top: 4px;
  left: 3px;
}

.radio {
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio:hover {
  border-color: #6b39f4;
}

.phone-input {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);

  :deep(.input-box) {
    margin-top: 0px;
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

  :deep(.tips) {
    margin-bottom: 0px;
    color: #a3a3a3;
  }
}

.or {
  margin: 20px 0;
  font-size: 12px;
  color: #94a3b8;
  position: relative;
  width: 100%;
  text-align: center;

}

.sendCode {
  padding: 10px 12px;
  border-radius: 999px;
  border: 1px solid rgba(124, 255, 178, 0.2);
  color: #8bffbe;
  background: rgba(124, 255, 178, 0.08);
}

.item-active {
  background: #424242;
  color: #fff
}
</style>