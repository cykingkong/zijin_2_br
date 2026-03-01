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
    localStorage.setItem("language", "br");
    locale.value = "br";
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
      <div class="mid-logo h-[64px] rounded-[12px] overflow-hidden ml-[16px] mt-76">
        <img src="@/assets/Logo.png" alt="" class="w-auto h-full">
      </div>
      <div class="text-left m-x-a mt-[16px] color-white px-30">
        <div class="t font-size-[24px] font-semibold m-b-[4px] color-[#1B1B1B]">
          {{ t("Welcome") }}
        </div>
      </div>
    </div>
    <div class="login-form p-24">
      <div class="phone-input flex items-center gap-[12px] mb-20">
        <inputCom :placeholder="t('PleaseEnterDeviceCode')" v-model:value="postData.account" :tips="''"
          class="flex-1 w-full">
        </inputCom>
      </div>





      <van-button type="primary" color="#1B1B1B" class="login-btn h-[48px]!" block @click=" login()">{{
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