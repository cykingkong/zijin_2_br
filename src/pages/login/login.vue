<script setup lang="ts">
import { useRouter } from "vue-router";
import type { RouteMap } from "vue-router";
import { useUserStore } from "@/stores";
import inputCom from "@/components/inputCom.vue";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import CloseButton from "@/components/CloseButton.vue";
import { languageColumns, locale } from "@/utils/i18n";
import Apple from '@/assets/image/Apple.svg'
import Google from '@/assets/image/Google.svg'
import loginTab from "@/components/tab.vue";
import vw from "@/utils/inline-px-to-vw";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const type = ref('')
const remember = ref(false);
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
onMounted(() => {
  if (route.query.type) {
    type.value = route.query.type;
    postData.type = route.query.type == '1' ? 'phone' : 'email';
  }

  // 页面加载时检查是否有保存的登录信息
  const savedLoginInfo = localStorage.getItem('remember');
  if (savedLoginInfo) {
    try {
      const parsedInfo = JSON.parse(savedLoginInfo);
      remember.value = true;
      postData.account = parsedInfo.account || '';
      postData.password = parsedInfo.password || '';
      // postData.type = parsedInfo.type || 'phone';
    } catch (error) {
      console.error('解析保存的登录信息失败:', error);
      localStorage.removeItem('remember');
    }
  }
})
const typeArr = [
  {
    label: `${t("input.Phone")}`,
    value: "phone",
  },
  {
    label: `${t("login.email")}`,
    value: "email",
  },
];
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});
const inputType = ref('password')
const changeInputType = () => {
  inputType.value = inputType.value == 'password' ? 'text' : 'password'
}

const postData = reactive({
  account: "",
  password: "",
  type: "phone",
  code: "",
});
const changeIndex = (val: any) => {
  postData.type = typeArr[val].value;
};
const rules = reactive({
  email: [{ required: true, message: t("login.pleaseEnterEmail") }],
  password: [{ required: true, message: t("login.pleaseEnterPassword") }],
});

const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};
const toRegister = () => {
  console.log("toRegister");
  try {
    router.push({ path: "/register" });
  } catch (e) {
    console.log(e);
  }
};
const toForgotPassword = () => {
  try {
    router.push("/forgot-password?type=" + postData.type);

  } catch (e) {
    console.log(e);
  }
};
const toForget = () => {
  try {
    router.push("/register");

  } catch (e) {
    console.log(e);
  }
};
const getName = (val: any) => {
  areaInfo.value = val;
};

async function login() {
  if (!postData.password) {
    showToast("input.PleaseEnter");
    return;
  }

  // 处理记住密码功能
  if (remember.value) {
    localStorage.setItem('remember', JSON.stringify(postData))
  } else {
    localStorage.removeItem('remember')
  }

  try {
    loading.value = true;
    let area = areaInfo.value?.dialCode;
    let params = {
      account: postData.type == "phone" ? `${area}${postData.account}` : postData.account,
      password: postData.password,
      type: postData.type,
    };
    await userStore.login(params);
    // await userStore.info()
    localStorage.setItem("language", "pt-BR");
    locale.value = "pt-BR";
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
  <div class="m-x-a w-full max-h-100vh">
    <div class="top-image w-full min-h-235px bg-#0F172A">
      <CloseButton @close="onBack" />
      <div class="mid-logo w-64px h-64px m-x-a">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19.7541 2.43584C23.6365 0.827794 27.7978 0 32 0V16C29.8988 16 27.8182 16.4138 25.877 17.218C23.9358 18.022 22.172 19.2006 20.6863 20.6863C19.2006 22.172 18.022 23.9358 17.218 25.877C16.4138 27.8182 16 29.8988 16 32H0C0 27.7978 0.827794 23.6365 2.43584 19.7541C4.04407 15.8716 6.4011 12.3441 9.37253 9.37253C12.3441 6.4011 15.8716 4.04407 19.7541 2.43584Z"
            fill="#6B39F4" />
          <path
            d="M0 32C0 36.2022 0.827794 40.3635 2.43584 44.2459C4.04407 48.1284 6.4011 51.6559 9.37253 54.6275C12.3441 57.5989 15.8716 59.9559 19.7541 61.5642C23.6365 63.1722 27.7978 64 32 64C36.2022 64 40.3635 63.1722 44.2459 61.5642C48.1284 59.9559 51.6559 57.5989 54.6275 54.6275C57.5989 51.6559 59.9559 48.1284 61.5642 44.2459C63.1722 40.3635 64 36.2022 64 32H48C48 34.1012 47.5862 36.1818 46.782 38.123C45.978 40.0642 44.7995 41.828 43.3137 43.3137C41.828 44.7995 40.0642 45.978 38.123 46.782C36.1818 47.5862 34.1012 48 32 48C29.8988 48 27.8182 47.5862 25.877 46.782C23.9358 45.978 22.172 44.7995 20.6863 43.3137C19.2006 41.828 18.022 40.0642 17.218 38.123C16.4138 36.1818 16 34.1012 16 32H0Z"
            fill="#9774F7" />
          <path
            d="M32 21.8182C26.3767 21.8182 21.8182 26.3767 21.8182 32H42.1818C42.1818 26.3767 37.6233 21.8182 32 21.8182Z"
            fill="#9774F7" />
          <path
            d="M32 42.1818C26.3767 42.1818 21.8182 37.6233 21.8182 32H42.1818C42.1818 37.6233 37.6233 42.1818 32 42.1818Z"
            fill="#6B39F4" />
        </svg>
      </div>
      <div class="text-center m-x-a mt-16px color-white">
        <div class="t font-size-24px font-600 m-b-4px">
          Welcome Back!
        </div>
        <div class="t2 font-size-14px font-400 color-#94A3B8">
          Sign in to your account
        </div>
      </div>
    </div>

    <div class="login-form p-24">
      <inputCom v-model:value="postData.account" :placeholder="type == '1' ? 'Phone' : 'Email'" :onlyRead="false"
        :type="'text'"></inputCom>
      <inputCom v-model:value="postData.password" :placeholder="'Password'" :onlyRead="false" :inputType="inputType">
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
      <div class="flex justify-between items-center mt-16px mb-24px">
        <div class="left flex font-size-14px font-500 flex-shrink-0 gap-12px">
          <div class="radio w-16px h-16px rounded-4px border-1px " :class="remember ? 'radio-active' : ''"
            @click="remember = !remember"></div>
          Remember me
        </div>
        <div class="right color-#6B39F4 font-size-14px font-700 cursor-pointer" @click="toForgotPassword()"> Forgot
          Password
        </div>
      </div>
      <van-button type="primary" r color="#6b39f4" class="login-btn" block @click="login()">{{
        t("登陆")
        }}</van-button>
      <div class="tips my-24px">Or sign in with</div>
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
      </div>
      <div class="flex items-center mt-36px justify-center">
        Don’t have an account? <span @click="toForget()" class="ml-4px color-#6b39f4">
          {{ $t("Sign Up") }}
        </span>
      </div>
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
</style>
<style scoped>
@import "@/components/nationality-list/intl.css";



.radio {
  border: 1px solid #CBD5E1;
}

.tips {
  position: relative;
  text-align: center;
  margin-top: 24px;
  color: #94A3B8;
  font-size: 14px;
  padding: 0 56px;
}

.tips::before,
.tips::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 44px;
  height: 1px;
  background-color: #CBD5E1;
  transform: translateY(-50%);
}

.tips::before {
  left: 0;
}

.tips::after {
  right: 0;
}

.radio.radio-active {
  background-color: #6B39F4;
  border-color: #6B39F4;
}

.radio.radio-active::after {
  content: '';
  width: 8px;
  height: 4px;
  border: 2px solid #FFFFFF;
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
  border-color: #6B39F4;
}
</style>