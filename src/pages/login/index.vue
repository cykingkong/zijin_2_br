<script setup lang="ts">
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores";
import { useLoadingStore } from "@/stores/modules/loading";
import br from '@/assets/br.png'
import usa from '@/assets/usa.png'
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import CloseButton from "@/components/CloseButton.vue";
import { languageColumns, locale } from "@/utils/i18n";
import { sendCode, register } from "@/api/user";
import local from "@/utils/local";

const lang = ref(local.getlocal('lang') || 'en')

const pageType = ref(0) // 0 login 1 register 2 changePwd
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { proxy } = getCurrentInstance();
const loadingStore = useLoadingStore();
let countryList = ref<any>([
  {
    code: "br",
    dialCode: 55,
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
let active = ref(0)
const loading = ref(false);
const remember = ref(false);
const areaInfo = ref({
  code: "mx",
  dialCode: 52,
  key: "mx",
  name: "Mexico",
});
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
      // postData.type = parsedInfo.type || 'phone';
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
  type: "phone",
  code: "", inviteCode: '',

});
/* 验证码开始 */
const countdown = ref(0)
const timer = ref()
const getCode = async () => {
  if (countdown.value > 0) return
  if (!postData.account) {
    showToast(t('PleaseEnterPhoneNumber'))
    return
  }
  try {
    let params = {
      type: postData.type,
      phone: '',
      email: ''
    }
    if (params.type == 'phone') {
      params.phone = `${areaInfo.value.dialCode}${postData.account}`
    } else {
      params.email = postData.account
    }

    await sendCode(params)
    startCountdown()
  } catch (e) {
    // 处理错误
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

const hanleClickAreaPick = () => {
  return
  // controlChildRef.value.open();

  // areaPopRef.value.popShow()
};

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
const getName = (val: any) => {
  areaInfo.value = val;
};
const handleClickType = (index: any) => {
  active.value = index

}
// 校验帐号密码必填
const validateAccountPassword = () => {
  if (!postData.account) {
    showToast(t('Please Enter Account'))
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
  // if (!postData.inviteCode) {
  //   showToast(t('Please Enter Invite Code'))
  //   return
  // }
  try {
    let area = countryList.value[active.value].dialCode;
    let params = {
      "type": postData.type,
      "phone": area + postData.account,
      "code": postData.code,
      "inviteCode": postData.inviteCode,
      "password": postData.password
    }
    await userStore.register(params);
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
  if (!postData.password) {
    showToast("PleaseEnter");
    return;
  }

  // 处理记住密码功能
  if (remember.value) {
    localStorage.setItem("remember", JSON.stringify(postData));
  } else {
    localStorage.removeItem("remember");
  }

  try {
    loading.value = true;
    let area = countryList.value[active.value]?.dialCode;
    let params = {
      account:
        postData.type == "phone"
          ? `${area}${postData.account}`
          : postData.account,
      password: postData.password,
      type: postData.type,
    };
    await userStore.login(params);
    // await userStore.info()
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
  <div class="m-x-a w-full max-h-[100vh]">
    <nationalityList ref="controlChildRef" :title="t('Pick')" @getName="getName"></nationalityList>

    <div class="top-image w-full bg-[]">
      <CloseButton>
        <template #left>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" @click="onBack"
            v-if="pageType == 1">
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#F0F0F0" />
            <path d="M21.6667 16.6667L18.3333 20L21.6667 23.3333" stroke="#1B1B1B" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <div class="e" v-else></div>
        </template>
        <template #right>
          <!-- <LangSelectDropdown v-model="lang" /> -->
        </template>
      </CloseButton>
      <div class="mid-logo h-[64px] rounded-[12px] overflow-hidden ml-[16px]">
        <img src="@/assets/Logo.png" alt="" class="w-auto h-full">
      </div>
      <div class="text-left m-x-a mt-[16px] color-white px-30">
        <div class="t font-size-[24px] font-semibold m-b-[4px] color-[#1B1B1B]">
          {{ t("Welcome") }}
        </div>
      </div>
    </div>
    <div class="login-form p-24">
      <div class="type-box flex gap-[10px] mb-[20px]">
        <div
          class="type-item text-[#424242] text-[14px] rounded-[8px] h-26 px-14 flex justify-center items-center bg-[#0000000D]"
          v-for="(item, index) in countryList" :key="index" :class="active == index ? 'item-active' : ''"
          @click="handleClickType(index)">
          {{
            t(item.name)
          }}
        </div>
      </div>
      <div class="phone-input flex items-center gap-[12px] mb-20">
        <div class="picker flex-shrink-0 h-[48px] rounded-[12px] flex items-center justify-center px-16"
          @click="hanleClickAreaPick">
          <img :src="countryList[active]?.img" alt="" class="w-24 h-24 rounded-full mr-4">
          <div class="num">+{{ countryList[active]?.dialCode }}</div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6L8 10L12 6" fill="#1B1B1B" />
          </svg>
        </div>
        <inputCom :placeholder="t('PleaseEnterPhoneNumber')" v-model:value="postData.account" :tips="''"
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
                stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z"
                stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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
                stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path
                d="M22 12C19.333 16.667 16 19 12 19C8 19 4.667 16.667 2 12C4.667 7.333 8 5 12 5C16 5 19.333 7.333 22 12Z"
                stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
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

      <div class="flex justify-between items-center mt-[16px] mb-[24px] gap-16">
        <div class="left flex font-size-[14px] font-medium flex-shrink-0 gap-[12px] flex-shrink-0">
          <!-- <div class="radio w-[16px] h-[16px] rounded-[4px] border" :class="remember ? 'radio-active' : ''"
            @click="remember = !remember"></div>
          {{ t("Remember me") }} -->
        </div>
        <div class="right color-[#1b1b1b] font-size-[14px] font-bold cursor-pointer flex-shrink-0"
          @click="toForgotPassword()">
          {{ t("Forgot Password") }}
        </div>
      </div>
      <van-button type="primary" color="#1B1B1B" class="login-btn h-[48px]!" block
        @click="pageType == 0 ? login() : signUp()">{{
          pageType == 0 ? t("Login") : t("Sign Up")
        }}</van-button>
      <div class="or">{{ '©2026 Signet Jewelers. Este site é utilizado sob autorização, todos os direitos reservados.'
        }}
      </div>
      <div :style="{ color: '#1B1B1B' }"
        class=" font-regular w-full  items-center flex justify-center text-center  color-[#1b1b1b]! font-bold"
        block @click="changePageType()">
        <span class="text-[#0000004D] mr-4"> {{ pageType == 0 ? t("Don’t have an account?") : '' }} </span> {{
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
.login-btn {
  margin-top: 24px;
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

.or {
  margin: 20px 0;
  font-size: 12px;
  color: #94a3b8;
  position: relative;
  width: 100%;
  text-align: center;

}

.sendCode {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #868c9a;
  color: #fff;
  background: #424242;
}

.item-active {
  background: #424242;
  color: #fff
}
</style>