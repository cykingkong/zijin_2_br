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

const lang = ref(local.getlocal('lang') || 'id')

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
      replace: true,
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
      params.phone = `55${postData.account}`
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
    localStorage.setItem("language", "id");
    locale.value = "id";
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push('/');
  } catch (e) {
    console.log(e)
  }
}
async function login() {
  if (!postData.account) {
    showToast("PleaseEnter");
    return;
  }



  try {
    loading.value = true;
    let area = countryList.value[active.value]?.dialCode;
    let params = {
      uuid: postData.account,
    };
    await userStore.login(params);
    // await userStore.info()
    localStorage.setItem("language", "id");
    locale.value = "id";
    const { redirect, ...othersQuery } = router.currentRoute.value.query;
    router.push({
      name: "home",
      query: {
        ...othersQuery,
      },
      replace: true,

    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="login-container">
    <!-- 原 top-image w-full bg-[] 转换为 .top-section -->
    <div class="top-section">
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
          <LangSelectDropdown v-model="lang" />
        </template>
      </CloseButton>
      <!-- 原 mid-logo h-[64px] rounded-[12px] overflow-hidden ml-[16px] mt-76 转换为 .logo-wrapper -->
      <div class="logo-wrapper">
        <img src="@/assets/Logo.png" alt="" class="logo-img">
      </div>
      <!-- 原 text-left m-x-a mt-[16px] color-white px-30 转换为 .welcome-text -->
      <div class="welcome-text">
        <!-- 原 t font-size-[24px] font-semibold m-b-[4px] color-[#1B1B1B] 转换为 .welcome-title -->
        <div class="welcome-title">
          {{ t("Welcome") }}
        </div>
      </div>
    </div>

    <!-- 原 login-form p-24 (已在style中保留并增强) -->
    <div class="login-form">
      <!-- 原 phone-input flex items-center gap-[12px] mb-20 (已在style中合并增强) -->
      <div class="phone-input">
        <inputCom :placeholder="t('PleaseEnterDeviceCode')" v-model:value="postData.account" :tips="''"
          class="input-full">
        </inputCom>
      </div>

      <!-- 原 login-btn h-[48px]! (已在style中增强) -->
      <van-button type="primary" color="#1B1B1B" class="login-btn" block @click=" login()">{{
        t("Log in")
        }}</van-button>


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
/* 新增转换后的 UnoCSS 样式 */

.login-container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  max-height: 100vh;
}

.top-section {
  width: 100%;
}

.logo-wrapper {
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  margin-left: 16px;
  margin-top: 76px;
  display: flex;
  /* 为了img居中或撑开 */

  .logo-img {
    width: auto;
    height: 100%;
  }
}

.welcome-text {
  text-align: left;
  margin-left: auto;
  margin-right: auto;
  margin-top: 16px;
  color: #ffffff;
  /* 保留原 color-white */
  padding: 0 30px;
  /* 原 px-30 */
}

.welcome-title {
  font-size: 24px;
  /* 原 font-size-[24px] */
  font-weight: 600;
  /* 原 font-semibold */
  margin-bottom: 4px;
  /* 原 m-b-[4px] */
  color: #1B1B1B;
  /* 原 color-[#1B1B1B] */
}

.login-form {
  padding: 24px;
  /* 原 p-24 */
}

.phone-input {
  display: flex;
  /* 原 flex */
  align-items: center;
  /* 原 items-center */
  gap: 12px;
  /* 原 gap-[12px] */
  margin-bottom: 20px;
  /* 原 mb-20 */

  /* 合并原有的 .phone-input 样式 */
  border: 1px solid #F0F0F0;
  border-radius: 12px;
  padding: 0 10px;
  /* 补充一点内边距防止输入框贴边 */

  :deep(.input-box) {
    margin-top: 0px;
  }

  :deep(.tips) {
    margin-bottom: 0px;
  }
}

.input-full {
  flex: 1;
  /* 原 flex-1 */
  width: 100%;
  /* 原 w-full */
}

.login-btn {
  height: 48px !important;
  /* 原 h-[48px]! */
  margin-top: 24px;
  /* 原有样式保留 */
}

/* --- 以下为原有保留样式 --- */

.signUpBtn {
  :deep(.van-button--primary) {
    color: #1B1B1B;
  }
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

.radio {
  border: 1px solid #cbd5e1;
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

<style scoped></style>