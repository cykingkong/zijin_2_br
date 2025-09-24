<script setup lang="ts">
import { useRouter } from "vue-router";
import {
  showToast,
  type FieldRule,
  showSuccessToast,
  showFailToast,
} from "vant";
import { ref, onUnmounted } from "vue";
import { useUserStore } from "@/stores";
import { useLoadingStore } from "@/stores/modules/loading";
import { sendCode, register, kyc } from "@/api/user";
import { clearToken, setToken } from "@/utils/auth";
import inputCom from "@/components/inputCom.vue";
import slidePop from "@/components/slidePop.vue";
import CodeInput from "@/components/CodeInput.vue";
import dayjs from "dayjs";
import passport from "@/assets/image/passport-icon.svg";
import idCard from "@/assets/image/idCard-icon.svg";
const { proxy } = getCurrentInstance()!;
const loadingStore = useLoadingStore();

// import icon1 from "@/assets/image/icon/icon1.png";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { uploadFile } from "@/api/tool";
const countdown = ref(0);
const router = useRouter();
const step = ref(1);
const { t } = useI18n();
const showDatePicker = ref(false);
const currentDate = ref([
  dayjs().format("MM"),
  dayjs().format("DD"),
  dayjs().format("YYYY"),
]);
const minDate = ref(new Date(1870, 0, 1));
const maxDate = ref(new Date(2025, 10, 1));
const agree = ref(false);
const timer = ref<NodeJS.Timeout>();
const userStore = useUserStore();
const areaInfo = ref({
  code: "mx",
  dialCode: 52,
  key: "mx",
  name: "Mexico",
});
const inviteCodeOnlyRead = ref(false);
const typeArr = [
  {
    label: `${t("Email")}`,

    value: "email",
  },
  {
    label: `${t("Phone")}`,

    value: "phone",
  },
];
const uploadTypeList = ref([
  {
    label: `${t("IDCard Validation")}`,
    value: "idCardFront",
    img: idCard,
  },
  {
    label: `${t("Passport Validation")}`,
    value: "idCardBack",
    img: passport,
  },
]);
const uploadType = ref("idCardFront");
const kycForm = reactive({
  name: "",
  birth: "",
  birthdayDesc: "",
  nationality: "",
  idCard: "",
  idCardFront: "",
  card_front: "",
  idCardBack: "",
  idCardHand: "",
});
const form = reactive({
  type: "email",
  email: "",
  account: "",
  phone: "",
  password: "",
  passwordConfirmation: "",
  code: "", // 二次验证码
  inviteCode: "", // 邀请码
});

// 密码验证相关
const passwordError = ref(false);
const passwordErrorMessage = ref("");

// 密码验证函数
const validatePassword = (password) => {
  if (!password) {
    passwordError.value = false;
    passwordErrorMessage.value = "";
    return true;
  }

  if (password.length < 8) {
    passwordError.value = true;
    passwordErrorMessage.value = t("passwordMinLength");
    return false;
  }

  passwordError.value = false;
  passwordErrorMessage.value = "";
  return true;
};

// 监听密码变化
watch(
  () => form.password,
  (newPassword) => {
    validatePassword(newPassword);
  }
);

// 表单验证函数
const validateForm = () => {
  const errors = [];

  // 1. 验证手机号或邮箱
  if (form.type === "phone") {
    if (!form.phone) {
      errors.push(t("PleaseEnterPhone"));
    }
  } else {
    if (!form.email) {
      errors.push(t("PleaseEnterEmail"));
    }
  }

  // 2. 验证密码
  if (!form.password) {
    errors.push(t("PleaseEnterPassword"));
  } else if (form.password.length < 8) {
    errors.push(t("PasswordMinLength"));
  }

  // 3. 验证确认密码
  if (!form.passwordConfirmation) {
    errors.push(t("PleaseEnterConfirmPassword"));
  } else if (form.password !== form.passwordConfirmation) {
    errors.push(t("PasswordsDoNotMatch"));
  }

  // 4. 验证邀请码
  if (!form.inviteCode) {
    errors.push(t("PleaseEnterInviteCode"));
  }

  // 5. 验证是否同意条款
  if (!agree.value) {
    errors.push(t("PleaseAgreeTerms"));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const list1 = ref([]);
const list2 = ref([]);
const list3 = ref([]);
const slidePopRef = ref();
const areaPopRef = ref();

// 验证码相关
const verificationCode = ref("");
const codeError = ref(false);
const codeErrorMessage = ref("");
const countdownActive = ref(false);
const handleClickAgree = () => {
  agree.value = !agree.value;
};
const handleClickDatePop = () => {
  if (kycForm.birth && !kycForm.birth.length) {
    // 获取当天日期 并且填入form.birthday,格式同 currentDate
    currentDate.value = [
      dayjs().format("MM"),
      dayjs().format("DD"),
      dayjs().format("YYYY"),
    ];
  }
  showDatePicker.value = true;
};
const onDateConfirm = ({ selectedValues }) => {
  kycForm.birth = selectedValues;
  kycForm.birthdayDesc = `${selectedValues[0]}/${selectedValues[1]}/${selectedValues[2]}`;
  showDatePicker.value = false;
};
const handleClickRegisterOriginal = async () => {
  // if (form.inviteCode == "") {
  //   showToast(t("input.PleaseEnter"));
  //   return;
  // }
  try {
    let area = areaInfo.value?.dialCode;
    let account = form.type == "phone" ? area + form.phone : form.email;
    let params = {
      account,
      type: form.type,
      password: form.password,
      captcha: verificationCode.value,
      code: form.inviteCode,
    };

    const { data, code } = await register(params);
    if (code == 200) {
      step.value = 4;
      setToken(data.token);
      showSuccessToast(" ");
      await userStore.info();
    }
  } catch (e) {}
};
const handleClickOnback = () => {
  router.push("/");
};
const handleClickRegister = proxy!.$throttle(
  handleClickRegisterOriginal,
  1000,
  {
    onStart: () => loadingStore.show(),
    onEnd: () => loadingStore.hide(),
  }
);
const handleClickSubmit = async () => {
  try {
    let params = {
      type: "identity",
      name: kycForm.name,
      birth: kycForm.birthdayDesc,
      id_card: kycForm.idCard,
      card_front: kycForm.card_front,

      // idCardHand: kycForm.idCardHand,
    };
    const { data, code } = await kyc(params);
    if (code == 200) {
      showSuccessToast("");
      step.value++;
      return;
    }
  } catch (e) {}
};
const getCode = async () => {
  if (countdown.value > 0) return;
  if (!form.phone && form.type == "phone") {
    showToast(t("PleaseEnterPhone"));
    return;
  }
  if (!form.email && form.type == "email") {
    showToast(t("PleaseEnterEmail"));
    return;
  }
  if (agree.value == false) {
    showToast("PleaseAgreeTerms");
    return;
  }
  try {
    let area = areaInfo.value?.dialCode;
    let account = form.type == "phone" ? area + form.phone : form.email;
    let params = {
      account: account,
      type: form.type,
    };
    const { data, code } = await sendCode(params);
    if (code == 200) {
      showToast("CodeSent");
      // step.value++
    }
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

// 上传
const onOversize = (file) => {
  console.log(file);
  showToast("文件大小不能超过 5Mb");
};
const handleAfterRead = async (file: any, type: any) => {
  queryUploadFile(file, type);
};
const queryUploadFile = async (file: any, type: any) => {
  file.status = "uploading"; // 显示上传状态
  // 创建 FormData 对象
  const formData = new FormData();
  formData.append("image", file.file);
  console.log(file.file, "file.file");
  // 发起上传请求
  try {
    const { data, code } = await uploadFile(formData);
    if (code == 200) {
      if (type == 1) {
        kycForm.card_front = data.url;
        list1.value = [{ url: data.url }];
        console.log(data.url, "dataUrl", type, list1.value);
      }

      showSuccessToast(t("Upload successful"));
      console.log(kycForm);
    } else {
      showFailToast("");
      file.status = "failed";
      file.message = "";
    }
  } catch (error) {
    file.status = "failed";
    file.message = "";
    showFailToast(t("Upload failed"));
  }
};
onMounted(() => {
  console.log(router.currentRoute.value.query);
  if (
    router.currentRoute.value.query &&
    router.currentRoute.value.query.inviteCode
  ) {
    // 如果路由带有邀请码则自动填充，并且只读
    form.inviteCode = router.currentRoute.value.query.inviteCode as string;
    inviteCodeOnlyRead.value = true;
  }
  if (router.currentRoute.value.query && router.currentRoute.value.query.step) {
    step.value = Number(router.currentRoute.value.query.step);
  }
});
onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
const controlChildRef = ref();
const hanleClickAreaPick = () => {
  controlChildRef.value.open();

  // areaPopRef.value.popShow()
};

// 验证码相关方法
const handleCodeComplete = (code: string) => {
  console.log("验证码输入完成:", code);
  // 可以在这里自动验证或触发其他操作
};

const handleCodeChange = (code: string) => {
  verificationCode.value = code;
  codeError.value = false; // 清除错误状态
};

const firstStepGetCode = () => {
  // 验证表单
  const validation = validateForm();

  if (!validation.isValid) {
    // 显示第一个错误信息
    showFailToast(validation.errors[0]);
    return;
  }

  // 验证通过，发送验证码并跳转
  getCode();
  step.value = 2;
};

const resendCode = async () => {
  if (countdownActive.value) return;

  try {
    // 这里调用发送验证码的API
    await getCode();
    countdownActive.value = true;
    startCountdown();
  } catch (error) {
    showFailToast("Sending failed, please try again");
  }
};

function onBack() {
  if ([2, 4, 5].includes(step.value)) {
    step.value--;
    return;
  }
  if (window.history.state.back) history.back();
  else router.replace("/");
}
// const popOnOk = (val: any) => {
//   areaInfo.value = val
// }
</script>

<template>
  <div class="m-x-a px-24 pb-24">
    <nationalityList
      ref="controlChildRef"
      :title="t('Pick')"
      @getName="getName"
    ></nationalityList>
    <div class="close h-56px w-full flex items-center">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        @click="onBack"
      >
        <path
          d="M6 6L18 18M18 6L6 18L18 6Z"
          stroke="#0F172A"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <block v-if="step == 1">
      <div class="top-title">
        <div class="t1 font-size-24px font-700 color-#0F172A">
          {{ t("Create your account") }}
        </div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-16px">
          {{ t("Let's get started with a free Financy account.") }}
        </div>
      </div>
      <div
        class="title font-size-14 font-bold mt-26 mb-33 flex gap-24 items-center w-full"
      >
        <div
          class="flex flex-1 flex-shrink-0 justify-center text-center color-#64748B"
          :class="{ active: form.type == item.value }"
          v-for="(item, index) in typeArr"
          :key="index"
          @click="form.type = item.value"
        >
          {{ item.label }}
        </div>
      </div>
      <div
        class="phone-input flex items-center gap-12px"
        v-if="form.type == 'phone'"
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
          :placeholder="t('PleaseEnterPhoneNumber')"
          v-model:value="form.phone"
          :tips="''"
          class="flex-1 w-full"
        >
        </inputCom>
      </div>

      <inputCom
        :label="t('Email')"
        :placeholder="t('Email')"
        v-model:value="form.email"
        :tips="''"
        v-if="form.type == 'email'"
      >
      </inputCom>
      <inputCom
        :label="t('Password')"
        :placeholder="t('Password')"
        v-model:value="form.password"
        :tips="passwordErrorMessage"
        :inputType="'password'"
      >
      </inputCom>
      <inputCom
        :label="t('ConfirmPassword')"
        :placeholder="t('ConfirmPassword')"
        v-model:value="form.passwordConfirmation"
        :tips="''"
        :inputType="'password'"
      >
      </inputCom>
      <!-- <inputCom :label="t('register.code')" :placeholder="t('input.PleaseEnter')" v-model:value="form.code" :tips="''">
        <template #sendCode>
          <div class="absolute right-0 font-size-12 sendCode" :class="countdown > 0 ? 'text-gray-400' : 'text-white'"
            @click="getCode">
            {{ countdown > 0 ? `${countdown}s` : t("input.SendCode") }}
          </div>
        </template>
</inputCom> -->
      <inputCom
        :label="t('InvitationCode')"
        :placeholder="t('InvitationCode')"
        :only-read="inviteCodeOnlyRead"
        v-model:value="form.inviteCode"
      >
      </inputCom>

      <div class="protocol wfull flex gap-8 font-size-12 mb-12 mt-8">
        <div class="flex justify-between items-start mt-16px mb-24px gap-8px">
          <div class="left flex font-size-14px font-500 flex-shrink-0">
            <div
              class="radio w-16px h-16px rounded-4px border-1px"
              @click.stop="handleClickAgree"
              :class="agree ? 'agreeRadio' : ''"
            ></div>
          </div>
          <div class="right">
            {{
              t(
                "I certify that I'm 18 years of age or older, and I agree to the User Agreement and Privacy Policy."
              )
            }}
          </div>
        </div>
      </div>
      <div class="flex-col gap-12 flex">
        <van-button
          type="primary"
          block
          color="#6B39F4"
          @click="firstStepGetCode()"
          >{{ t("Register") }}</van-button
        >
        <!-- <van-button type="primary" block @click="handleClickRegister">登陆</van-button> -->
      </div>
      <div class="mt-36px justify-center text-center">
        {{ t("Don't have an account?") }}
        <span class="ml-4px color-#6b39f4">
          {{ $t("Sign Up") }}
        </span>
      </div>
      <!-- <div class="protocol wfull flex  font-size-12  mt-12">
        已有帐号？<span class="link ">登陆</span>
      </div> -->
    </block>
    <!-- 第二步 验证码 -->
    <block v-if="step == 2">
      <div class="top-title">
        <div class="t1 font-size-24px font-700 color-#0F172A">
          {{ t("Authentication Code") }}
        </div>
        <div
          class="t2 color-#64748B mt-8 font-400 font-size-16px"
          v-if="form.type == 'phone'"
        >
          {{ t("Enter 6-digit code we just texted to your phone number, +")
          }}{{ areaInfo?.dialCode }}
          {{ form.phone }}
        </div>
        <div
          class="t2 color-#64748B mt-8 font-400 font-size-16px"
          v-if="form.type == 'email'"
        >
          {{ t("Enter 6-digit code we just sent to your email, ")
          }}{{ form.email }}
        </div>
      </div>

      <div class="verification-section mt-32px">
        <CodeInput
          v-model="verificationCode"
          :length="6"
          :auto-focus="true"
          :has-error="codeError"
          :error-message="codeErrorMessage"
          @complete="handleCodeComplete"
          @change="handleCodeChange"
        />

        <div class="btn-box mt-81px flex flex-col gap-16px">
          <van-button
            type="primary"
            color="#6B39F4"
            block
            :disabled="verificationCode.length !== 6"
            @click="handleClickRegister"
          >
            {{ t("Next") }}
          </van-button>
          <van-button
            type="primary"
            color="#F8F5FF"
            block
            class="resend-btn"
            @click="getCode"
          >
            {{ countdown > 0 ? `${countdown}s` : t("Resend Code") }}
          </van-button>
        </div>
      </div>
    </block>
    <block v-if="step == 3">
      <div class="top-title">
        <div class="t1 font-size-24px font-700 color-#0F172A">
          {{ t("Select and upload") }}
        </div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-16px">
          {{
            t(
              "We need this to confirm you reside in United States and verify who you are. Data is processed securely."
            )
          }}
        </div>
      </div>
      <div class="upload-type radio-group flex flex-col gap-16px mt-60px">
        <div
          class="flex w-full rounded-12px bg-#F8F9FD items-center justify-between px-16px py-12px"
          v-for="(item, index) in uploadTypeList"
          :key="index"
          @click="uploadType = item.value"
          :class="uploadType == item.value ? 'bg-#F8F5FF!' : ''"
        >
          <div class="left flex gap-12px items-center">
            <div
              class="icon w-40px h-40px rounded-full"
              :class="uploadType == item.value ? 'bg-#6B39F4' : 'bg-#fff'"
            >
              <svg
                class="w-40px h-40px"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                v-if="index == 0"
              >
                <rect
                  rx="20"
                  :fill="uploadType == item.value ? '#6B39F4' : '#fff'"
                />
                <path
                  d="M25.0001 12.5H15.0001C13.1584 12.5 11.6667 13.9833 11.6667 15.8083V24.1917C11.6667 26.0167 13.1584 27.5 15.0001 27.5H25.0001C26.8417 27.5 28.3334 26.0167 28.3334 24.1917V15.8083C28.3334 13.9833 26.8417 12.5 25.0001 12.5ZM17.0834 15.975C18.1417 15.975 19.0084 16.8417 19.0084 17.9C19.0084 18.9583 18.1417 19.825 17.0834 19.825C16.0251 19.825 15.1584 18.9583 15.1584 17.9C15.1584 16.8417 16.0251 15.975 17.0834 15.975ZM20.3084 23.8833C20.2334 23.9667 20.1167 24.0167 20.0001 24.0167H14.1667C14.0501 24.0167 13.9334 23.9667 13.8584 23.8833C13.7834 23.8 13.7417 23.6833 13.7501 23.5667C13.8917 22.1667 15.0084 21.0583 16.4084 20.925C16.8501 20.8833 17.3084 20.8833 17.7501 20.925C19.1501 21.0583 20.2751 22.1667 20.4084 23.5667C20.4251 23.6833 20.3834 23.8 20.3084 23.8833ZM25.8334 23.9583H24.1667C23.8251 23.9583 23.5417 23.675 23.5417 23.3333C23.5417 22.9917 23.8251 22.7083 24.1667 22.7083H25.8334C26.1751 22.7083 26.4584 22.9917 26.4584 23.3333C26.4584 23.675 26.1751 23.9583 25.8334 23.9583ZM25.8334 20.625H22.5001C22.1584 20.625 21.8751 20.3417 21.8751 20C21.8751 19.6583 22.1584 19.375 22.5001 19.375H25.8334C26.1751 19.375 26.4584 19.6583 26.4584 20C26.4584 20.3417 26.1751 20.625 25.8334 20.625ZM25.8334 17.2917H21.6667C21.3251 17.2917 21.0417 17.0083 21.0417 16.6667C21.0417 16.325 21.3251 16.0417 21.6667 16.0417H25.8334C26.1751 16.0417 26.4584 16.325 26.4584 16.6667C26.4584 17.0083 26.1751 17.2917 25.8334 17.2917Z"
                  :fill="uploadType == item.value ? 'white' : '#6B39F4'"
                />
              </svg>
              <svg
                class="w-40px h-40px"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                v-if="index == 1"
              >
                <rect
                  rx="20"
                  :fill="uploadType == item.value ? '#6B39F4' : '#fff'"
                />
                <path
                  d="M23.3334 13.5417C23.3334 14.575 22.4917 15.4167 21.4584 15.4167H18.5417C18.0251 15.4167 17.5584 15.2083 17.2167 14.8667C16.8751 14.525 16.6667 14.0583 16.6667 13.5417C16.6667 12.5083 17.5084 11.6667 18.5417 11.6667H21.4584C21.9751 11.6667 22.4417 11.875 22.7834 12.2167C23.1251 12.5583 23.3334 13.025 23.3334 13.5417Z"
                  :fill="uploadType == item.value ? 'white' : '#6B39F4'"
                />
                <path
                  d="M25.6916 14.1917C25.4999 14.0333 25.2833 13.9083 25.0499 13.8167C24.8083 13.725 24.5666 13.9167 24.5166 14.1667C24.2333 15.5917 22.9749 16.6667 21.4583 16.6667H18.5416C17.7083 16.6667 16.9249 16.3417 16.3333 15.75C15.8999 15.3167 15.5999 14.7667 15.4833 14.175C15.4333 13.925 15.1833 13.725 14.9416 13.825C13.9749 14.2167 13.3333 15.1 13.3333 16.875V25C13.3333 27.5 14.8249 28.3333 16.6666 28.3333H23.3333C25.1749 28.3333 26.6666 27.5 26.6666 25V16.875C26.6666 15.5167 26.2916 14.6833 25.6916 14.1917ZM16.6666 20.2083H19.9999C20.3416 20.2083 20.6249 20.4917 20.6249 20.8333C20.6249 21.175 20.3416 21.4583 19.9999 21.4583H16.6666C16.3249 21.4583 16.0416 21.175 16.0416 20.8333C16.0416 20.4917 16.3249 20.2083 16.6666 20.2083ZM23.3333 24.7917H16.6666C16.3249 24.7917 16.0416 24.5083 16.0416 24.1667C16.0416 23.825 16.3249 23.5417 16.6666 23.5417H23.3333C23.6749 23.5417 23.9583 23.825 23.9583 24.1667C23.9583 24.5083 23.6749 24.7917 23.3333 24.7917Z"
                  :fill="uploadType == item.value ? 'white' : '#6B39F4'"
                />
              </svg>

              <!-- <img :src="item.img" alt="" class="w-full h-full" /> -->
            </div>
            {{ item.label }}
          </div>
          <div
            class="upload-radio border-solid border-1px border-#D1D5DB rounded-full w-16px h-16px relative"
            :class="uploadType == item.value ? 'upload-radio-active' : ''"
          ></div>
        </div>
      </div>
      <div class="box mt-235px">
        <van-button
          type="primary"
          class=""
          color="#6B39F4"
          block
          @click="step = 4"
        >
          {{ t("Next") }}
        </van-button>
      </div>
    </block>
    <block v-if="step == 4">
      <div class="mt-112px">
        <!-- <div class="image-box w-120px h-120px bg-#F8F9FD rounded-full m-x-a mb-40px"> -->
        <img
          src="@/assets/image/Illustration.png "
          class="w-140px h-120px block flex-shrink-0 m-x-a mb-40px"
          alt=""
        />
        <!-- </div> -->
        <div class="top-title text-center">
          <div class="t1 font-size-24px font-700 color-#0F172A">
            {{ t("Verify Your Identity") }}
          </div>
          <div class="t2 color-#64748B mt-8 font-400 font-size-16px">
            {{
              t(
                "To help protect you from fraud and identity theft, and to comly with federal regulations, wee need some info."
              )
            }}
          </div>
        </div>
        <div class="box mt-235px">
          <van-button
            type="primary"
            class=""
            color="#6B39F4"
            block
            @click="step = 5"
          >
            {{ t("Next") }}
          </van-button>
        </div>
      </div>
    </block>
    <block v-if="step == 5">
      <div class="top-title">
        <div class="t1 font-size-20px font-400 color-#0F172A">
          {{ t("Complete Your Personal Profile") }}
        </div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-14px">
          {{
            t(
              "Complete your profile to access full features and secure your account."
            )
          }}
        </div>
      </div>

      <inputCom
        :label="t('IDCard')"
        :placeholder="t('IDCard')"
        v-model:value="kycForm.idCard"
        :type="'text'"
      >
      </inputCom>
      <inputCom
        :label="t('True Name')"
        :placeholder="t('True Name')"
        v-model:value="kycForm.name"
        :type="'text'"
      >
      </inputCom>
      <!-- <inputCom :label="t('input.True Name')" :placeholder="t('出生日期')" v-model:value="kycForm.birth" :type="'text'">
      </inputCom> -->

      <inputCom
        :label="t('Birthday')"
        :placeholder="t('Birthday')"
        v-model:value="kycForm.birth"
        :inputType="'picker'"
        require
      >
        <template #picker>
          <div
            class="w-full flex items-center justify-between"
            @click="handleClickDatePop"
          >
            <div
              class="text-14px"
              :class="kycForm.birthdayDesc ? 'text-black' : 'text-gray'"
            >
              {{ kycForm.birthdayDesc ? kycForm.birthdayDesc : t("Birthday") }}
            </div>
          </div>
        </template>
        <template #sendCode>
          <van-icon
            name="arrow"
            class="rotate-90deg"
            size="20"
            color="#999999"
          />
        </template>
      </inputCom>
      <div
        class="upload-label font-size-14px font-400 mb-10px mt-38px flex items-center gap-12px"
      >
        {{ t("Photo ID Card") }}
        <div class="success-icon" v-if="kycForm.card_front">
          <svg
            t="1758716355565"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="6896"
            width="20"
            height="20"
          >
            <path
              d="M802.922882 383.309012 428.076612 758.155283 220.943065 551.154765c-22.317285-22.317285-22.317285-55.993269 0-78.310553 22.450315-22.450315 55.993269-22.450315 78.443583 0l128.689964 128.689964L724.613352 304.999482c22.450315-22.450315 55.993269-22.450315 78.30953 0C825.373197 327.316767 825.373197 360.858698 802.922882 383.309012zM512 64.322981c-246.155283 0-447.677019 201.521736-447.677019 447.677019s201.521736 447.677019 447.677019 447.677019 447.677019-201.521736 447.677019-447.677019S758.155283 64.322981 512 64.322981z"
              fill="#22C134"
              p-id="6897"
            ></path>
          </svg>
        </div>
      </div>
      <van-uploader
        accept="image/*"
        preview-image
        multiple
        :max-count="1"
        v-model="list1"
        :after-read="(file) => handleAfterRead(file, 1)"
        class="w-full"
      >
        <div
          class="upload-box w-327px rounded-12px h-168px border-1px flex items-center justify-center flex-col text-center"
        >
          <svg
            width="25"
            height="24"
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.5 9.00195C19.675 9.01406 20.8529 9.11051 21.6213 9.8789C22.5 10.7576 22.5 12.1718 22.5 15.0002V16.0002C22.5 18.8286 22.5 20.2429 21.6213 21.1215C20.7426 22.0002 19.3284 22.0002 16.5 22.0002H8.5C5.67157 22.0002 4.25736 22.0002 3.37868 21.1215C2.5 20.2429 2.5 18.8286 2.5 16.0002L2.5 15.0002C2.5 12.1718 2.5 10.7576 3.37868 9.87889C4.14706 9.11051 5.32497 9.01406 7.5 9.00195"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M12.5 15L12.5 2M12.5 2L15.5 5.5M12.5 2L9.5 5.5"
              stroke="#1C274C"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          <div class="t w-263px mt-24px mb-8px">{{ t("Choose a file") }}</div>
          <div class="tips font-size-12px font-400 color-#676F74 w-263px">
            {{
              t(
                "Ensure your ID is in PNG, JPG with a maximum file size of 5MB."
              )
            }}
          </div>
        </div>
      </van-uploader>
      <div class="box mt-54px">
        <van-button
          type="primary"
          class=""
          color="#6B39F4"
          block
          @click="handleClickSubmit"
        >
          {{ t("Next") }}
        </van-button>
      </div>
    </block>
    <block v-if="step == 6">
      <img
        src="@/assets/image/Illustration-success.png "
        class="w-140px h-120px block flex-shrink-0 m-x-a mb-40px mt-122px"
        alt=""
      />

      <div class="text-center font-size-24px font-600 color-#1A2029 mt-20px">
        {{ t("Thank you for submitting your identity verification.") }}
      </div>
      <div
        class="text-center font-size-14px font-400 color-#676F74 mt-12px w-290px mx-a"
      >
        {{
          t(
            "We can review it right now, please wait a moment, we will verify it as soon as possible."
          )
        }}
      </div>
      <div class="box mt-54px">
        <van-button
          type="primary"
          class=""
          color="#6B39F4"
          block
          @click="handleClickOnback"
        >
          {{ t("Continue") }}
        </van-button>
      </div>
    </block>

    <slidePop ref="slidePopRef" />
    <van-popup v-model:show="showDatePicker" position="bottom">
      <van-date-picker
        v-model="currentDate"
        :title="t('PleaseSelect')"
        :min-date="minDate"
        :columns-type="['month', 'day', 'year']"
        :max-date="maxDate"
        @confirm="onDateConfirm"
      />
    </van-popup>
    <!-- <areaPop ref="areaPopRef" :country_id="25" @popOnOk="popOnOk" /> -->
  </div>
</template>

<route lang="json5">
{
  name: 'register',
  meta: {
    i18n: 'menus.register',
    title:"注册"
  },
}
</route>
<style lang="less" scoped>
@import "@/components/nationality-list/intl.css";

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

.active {
  position: relative;
  color: #0f172a;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 2px;
    background: #0f172a;
  }
}

.radio {
  border: 1px solid #cbd5e1;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio.agreeRadio {
  background-color: #6b39f4;
  border-color: #6b39f4;
}

.radio.agreeRadio::after {
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

.sendCode {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #868c9a;
}

.btn-box .van-button[color="#F8F5FF"] {
  color: #6b39f4 !important;
}

.resend-btn {
  color: #6b39f4 !important;
}

.resend-btn .van-button__content {
  color: #6b39f4 !important;
}

.upload-radio-active {
  border-color: #6b39f4 !important;
  position: relative;
}

.upload-radio-active::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: #6b39f4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.upload-box {
  border: 1px #1c2024 dashed;
}
</style>
