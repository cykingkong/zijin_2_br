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
import { sendCode, register, kyc } from "@/api/user";
import { clearToken, setToken } from "@/utils/auth";
import inputCom from "@/components/inputCom.vue";
import slidePop from "@/components/slidePop.vue";
import CodeInput from "@/components/CodeInput.vue";

import icon1 from "@/assets/image/icon/icon1.png";
import nationalityList from "@/components/nationality-list/nationalityList.vue";
import { uploadFile } from "@/api/tool";
const countdown = ref(0);
const router = useRouter();
const step = ref(1);
const { t } = useI18n();
const agree = ref(false);
const timer = ref<NodeJS.Timeout>();
const userStore = useUserStore();
const areaInfo = ref({
  code: "br",
  dialCode: 55,
  key: "br",
  name: "",
});
const inviteCodeOnlyRead = ref(false);
const typeArr = [
  {
    label: `${t("login.email")}`,

    value: "email",
  },
  {
    label: `${t("input.Phone")}`,

    value: "phone",
  },

];
const uploadTypeList = ref([
  {
    label: `${t("身份证验证")}`,
    value: "idCardFront",
  },
  {
    label: `${t("护照验证")}`,
    value: "idCardBack",
  }
])
const uploadType = ref("idCardFront");
const kycForm = reactive({
  name: "",
  nationality: "",
  idCard: "",
  idCardFront: "",
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

const list1 = ref([]);
const list2 = ref([]);
const list3 = ref([]);
const slidePopRef = ref();
const areaPopRef = ref();

// 验证码相关
const verificationCode = ref('');
const codeError = ref(false);
const codeErrorMessage = ref('');
const countdownActive = ref(false);
const handleClickAgree = () => {
  agree.value = !agree.value;

}
const handleClickRegister = async () => {
  if (agree.value == false) {
    showToast(t("input.PleaseEnter"));
    return;
  }
  // if (form.inviteCode == "") {
  //   showToast(t("input.PleaseEnter"));
  //   return;
  // }
  try {
    let area = areaInfo.value?.dialCode;

    let params = {
      phone: area + form.phone,
      email: form.email,
      type: form.type,
      password: form.password,
      code: form.code,
      inviteCode: form.inviteCode,
    };
    step.value = 2;
    return
    const { data, code } = await register(params);
    if (code == 200) {
      step.value = 2;
      setToken(data.token);
      showSuccessToast("");
      await userStore.info();
    }
  } catch (e) { }
};
const handleClickSubmit = async () => {
  try {
    let params = {
      name: kycForm.name,
      nationality: areaInfo.value.dialCode,
      idCard: kycForm.idCard,
      idCardFront: kycForm.idCardFront,
      idCardBack: kycForm.idCardBack,
      // idCardHand: kycForm.idCardHand,
    };
    const { data, code } = await kyc(params);
    if (code == 200) {
      showSuccessToast("");
      router.push("/");
      return;
    }
  } catch (e) { }
};
const getCode = async () => {
  if (countdown.value > 0) return;
  if (!form.phone && form.type == "phone") {
    showToast(t("input.PleaseEnter"));
    return;
  }
  if (!form.email && form.type == "email") {
    showToast(t("input.PleaseEnter"));
    return;
  }
  try {
    let area = areaInfo.value?.dialCode;
    let params = {
      phone: area + form.phone,
      email: form.email,
      type: form.type,
    };
    const { data, code } = await sendCode(params);
    if (code == 200) {
      // showToast('验证码已发送，请注意查收')
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
  formData.append("file", file.file);
  // 发起上传请求
  try {
    const { data, code } = await uploadFile(formData);
    if (code == 200) {
      if (type == 1) {
        kycForm.idCardFront = data.url;
        list1.value = [{ url: data.url }];
      } else if (type == 2) {
        kycForm.idCardBack = data.url;
        list2.value = [{ url: data.url }];
      } else if (type == 3) {
        kycForm.idCardHand = data.url;
        list3.value = [{ url: data.url }];
      }


      showSuccessToast(t("Upload successful"));
      console.log(kycForm);
    } else {
      showFailToast("");
      file.status = 'failed';
      file.message = '';
    }

  } catch (error) {
    file.status = 'failed';
    file.message = '';
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
  console.log('验证码输入完成:', code);
  // 可以在这里自动验证或触发其他操作
};

const handleCodeChange = (code: string) => {
  verificationCode.value = code;
  codeError.value = false; // 清除错误状态
};

const resendCode = async () => {
  if (countdownActive.value) return;

  try {
    // 这里调用发送验证码的API
    await getCode();
    countdownActive.value = true;
    startCountdown();
  } catch (error) {
    showFailToast('发送失败，请重试');
  }
};

const verifyCode = async () => {
  if (verificationCode.value.length !== 6) {
    showToast('请输入完整的验证码');
    return;
  }

  try {
    // 这里调用验证验证码的API
    // const response = await verifyCodeAPI(verificationCode.value);

    // 模拟验证成功
    showSuccessToast('验证成功');
    step.value = 3; // 进入下一步
  } catch (error) {
    codeError.value = true;
    codeErrorMessage.value = '验证码错误，请重新输入';
    showFailToast('验证码错误');
  }
};
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
// const popOnOk = (val: any) => {
//   areaInfo.value = val
// }
</script>

<template>
  <div class="m-x-a px-24 pb-24">
    <nationalityList ref="controlChildRef" :title="t('pick')" @getName="getName"></nationalityList>
    <div class="close h-56px w-full flex items-center">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" @click="onBack">
        <path d="M6 6L18 18M18 6L6 18L18 6Z" stroke="#0F172A" stroke-width="2" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </div>

    <block v-if="step == 1">
      <div class="top-title">
        <div class="t1 font-size-24px font-700 color-#0F172A">Create your account</div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-16px">Let’s get started with a free Financy account.</div>
      </div>
      <div class="title font-size-14 font-bold mt-26 mb-33 flex gap-24 items-center w-full">
        <div class="flex flex-1 flex-shrink-0 justify-center text-center color-#64748B"
          :class="{ active: form.type == item.value }" v-for="(item, index) in typeArr" :key="index"
          @click="form.type = item.value">
          {{ item.label }}
        </div>
      </div>
      <div class="phone-input flex items-center gap-12px" v-if="form.type == 'phone'">
        <div class="picker flex-shrink-0 h-56px bg-#F8F9FD rounded-12px flex items-center justify-center px-16"
          @click="hanleClickAreaPick">
          <div class="iti-flag mr-10 rounded-full" :class="areaInfo?.code" style="transform: scale(1.5)"></div>
          <div class="num">+{{ areaInfo?.dialCode }}</div>
        </div>
        <inputCom :label="t('input.Phone')" :placeholder="t('input.PleaseEnter')" v-model:value="form.phone" :tips="''"
          class="flex-1 w-full">
        </inputCom>
      </div>

      <inputCom :label="t('register.email')" :placeholder="t('register.email')" v-model:value="form.email" :tips="''"
        v-if="form.type == 'email'">
      </inputCom>
      <inputCom :label="t('login.password')" :placeholder="t('login.password')" v-model:value="form.password" :tips="''"
        :inputType="'password'">
      </inputCom>
      <inputCom :label="t('input.ConfirmPassword')" :placeholder="t('input.ConfirmPassword')"
        v-model:value="form.passwordConfirmation" :tips="''" :inputType="'password'">
      </inputCom>
      <!-- <inputCom :label="t('register.code')" :placeholder="t('input.PleaseEnter')" v-model:value="form.code" :tips="''">
        <template #sendCode>
          <div class="absolute right-0 font-size-12 sendCode" :class="countdown > 0 ? 'text-gray-400' : 'text-white'"
            @click="getCode">
            {{ countdown > 0 ? `${countdown}s` : t("input.SendCode") }}
          </div>
        </template>
</inputCom> -->
      <inputCom :label="t('menus.InvitationCode')" :placeholder="t('menus.InvitationCode')"
        :only-read="inviteCodeOnlyRead" v-model:value="form.inviteCode">
      </inputCom>

      <div class="flex-col gap-12 flex">
        <van-button type="primary" block color="#6B39F4" @click="handleClickRegister">{{
          t("menus.register")
          }}</van-button>
        <!-- <van-button type="primary" block @click="handleClickRegister">登陆</van-button> -->
      </div>
      <div class="protocol wfull flex gap-8 font-size-12 mb-12 mt-8">
        <div class="flex justify-between items-start mt-16px mb-24px gap-8px">
          <div class="left flex font-size-14px font-500 flex-shrink-0 ">
            <div class="radio w-16px h-16px rounded-4px border-1px " @click.stop="handleClickAgree"
              :class="agree ? 'agreeRadio' : ''"></div>

          </div>
          <div class="right">
            I certify that I’m 18 years of age or older, and I agree to the User Agreement and Privacy Policy.
          </div>
        </div>
      </div>
      <div class="flex items-center mt-36px justify-center">
        Don’t have an account? <span class="ml-4px color-#6b39f4">
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
        <div class="t1 font-size-24px font-700 color-#0F172A">Authentication Code</div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-16px">Enter 6-digit code we just texted to your phone
          number,
          +1 8976889043</div>
      </div>

      <div class="verification-section mt-32px">
        <CodeInput v-model="verificationCode" :length="5" :auto-focus="true" :has-error="codeError"
          :error-message="codeErrorMessage" @complete="handleCodeComplete" @change="handleCodeChange" />


        <div class="btn-box mt-81px flex flex-col gap-16px">
          <van-button type="primary" color="#6B39F4" block :disabled="verificationCode.length !== 5" @click="step = 3">
            下一步
          </van-button>
          <van-button type="primary" color="#F8F5FF" block class="resend-btn" @click="verifyCode">
            重新发送验证码
          </van-button>
        </div>

      </div>
    </block>
    <block v-if="step == 3">
      <div class="top-title">
        <div class="t1 font-size-24px font-700 color-#0F172A">Select and upload</div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-16px">We need this to confirm you reside in United States
          and
          verify who you are. Data is processed securely.</div>
      </div>
      <div class="upload-type radio-group flex flex-col gap-16px  mt-60px">
        <div class="flex w-full rounded-12px bg-#F8F9FD items-center justify-between px-16px py-12px"
          v-for="(item, index) in uploadTypeList" :key="index" @click="uploadType = item.value"
          :class="uploadType == item.value ? 'bg-#F8F5FF!' : ''">
          <div class="left flex gap-12px items-center">
            <div class="icon w-40px h-40px "></div>
            {{ item.label }}
          </div>
          <div class="upload-radio border-solid border-1px border-#D1D5DB rounded-full w-16px h-16px relative"
            :class="uploadType == item.value ? 'upload-radio-active' : ''"></div>
        </div>
      </div>
      <div class="box mt-235px">
        <van-button type="primary" class="" color="#6B39F4" block @click="step = 4">
          下一步
        </van-button>
      </div>

    </block>
    <block v-if="step == 4">
      <div class="mt-112px">
        <div class="image-box w-120px h-120px bg-#F8F9FD rounded-full m-x-a mb-40px"></div>
        <div class="top-title text-center">
          <div class="t1 font-size-24px font-700 color-#0F172A">Verify Your Identity</div>
          <div class="t2 color-#64748B mt-8 font-400 font-size-16px">To help protect you from fraud and identity theft,
            and
            to comly with federal regulations, wee need some info.</div>
        </div>
        <div class="box mt-235px">
          <van-button type="primary" class="" color="#6B39F4" block @click="step = 5">
            下一步
          </van-button>
        </div>
      </div>
    </block>
    <block v-if="step == 5">
      <div class="top-title">
        <div class="t1 font-size-20px font-400 color-#0F172A">Complete Your Personal Profile</div>
        <div class="t2 color-#64748B mt-8 font-400 font-size-14px">Complete your profile to access full features and
          secure
          your account.</div>
      </div>


      <inputCom :label="t('input.IDCard')" :placeholder="t('input.IDCard')" v-model:value="kycForm.idCard"
        :type="'text'">
      </inputCom>
      <inputCom :label="t('input.True Name')" :placeholder="t('input.PleaseEnter')" v-model:value="kycForm.name"
        :type="'text'">
      </inputCom>
      <inputCom :label="t('input.True Name')" :placeholder="t('出生日期')" v-model:value="kycForm.name" :type="'text'">
      </inputCom>
      <div class="upload-label font-size-14px font-400 mb-10px mt-38px">
        Photo ID Card
      </div>
      <van-uploader accept="image/*" preview-image multiple :max-count="1" v-model="list2"
        :after-read="(file) => handleAfterRead(file, 1)" class="w-full">
        <div
          class="upload-box w-327px rounded-12px h-168px   border-1px flex items-center justify-center flex-col text-center">
          <div class="icon w-24px h-24px"></div>
          <div class="t w-263px mt-24px mb-8px">Choose a file</div>
          <div class="tips font-size-12px font-400 color-#676F74 w-263px">Ensure your ID is in PNG, JPG with a maximum
            file size of 5MB.</div>
        </div>
      </van-uploader>
      <div class="box mt-54px">
        <van-button type="primary" class="" color="#6B39F4" block @click="step = 6">
          下一步
        </van-button>
      </div>
    </block>
    <block v-if="step == 6">
      <div class="mid-image w-120px h-120px mx-auto"></div>
      <div class="text-center font-size-24px font-600 color-#1A2029 mt-20px">感谢您提交身份认证</div>
      <div class="text-center font-size-14px font-400 color-#676F74 mt-12px w-290px mx-a">我们现在就可以审核，稍等片刻，我们会尽快核实。</div>
      <div class="box mt-54px">
        <van-button type="primary" class="" color="#6B39F4" block @click="step = 6">
          前往登录
        </van-button>
      </div>
    </block>
    <block v-if="step == 41">
      <div class="px-12 pt-12 flex-col flex gap-12">
        <vue-flag code="fr" size="small" />
        <inputCom :label="t('input.Nationality')" :placeholder="t('input.PleaseEnter')"
          v-model:value="kycForm.nationality" :type="'picker'">
          <div class="picker pr-8 mr-6 h-full flex items-center gap-8" @click="hanleClickAreaPick">
            <img :src="icon1" alt="" class="w16 h16" />
            <div class="num">{{ areaInfo?.name }}</div>
          </div>
        </inputCom>
        <inputCom :label="t('input.True Name')" :placeholder="t('input.PleaseEnter')" v-model:value="kycForm.name"
          :type="'text'">
        </inputCom>
        <inputCom :label="t('input.IDCard')" :placeholder="t('input.PleaseEnter')" v-model:value="kycForm.idCard"
          :type="'text'">
        </inputCom>
        <inputCom :label="t('input.Upload')" v-model:value="kycForm.idCard" :type="'imageShow'">
          <div class="flex flex-justify-around w-full text-align-center font-size-12">
            <div class="w80">
              <van-uploader accept="image/*" preview-image multiple :max-count="1" v-model="list1"
                :after-read="(file) => handleAfterRead(file, 1)" />
              {{ t("input.Front") }}
            </div>
            <div class="w80">
              <van-uploader accept="image/*" preview-image multiple :max-count="1" v-model="list2"
                :after-read="(file) => handleAfterRead(file, 2)" />
              {{ t("input.Back") }}
            </div>
            <!-- <div class=" w80 ">
              <van-uploader preview-image multiple :max-count="1" v-model="list3"
                :after-read="(file) => handleAfterRead(file, 3)" />
              手持
            </div> -->
          </div>
        </inputCom>
        <van-button type="primary" block @click="handleClickSubmit">{{
          t("submit")
          }}</van-button>
      </div>
    </block>
    <slidePop ref="slidePopRef" />
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
  color: #0F172A;

  &::after {
    content: "";
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 2px;
    background: #0F172A;
  }
}

.radio {
  border: 1px solid #CBD5E1;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio.agreeRadio {
  background-color: #6B39F4;
  border-color: #6B39F4;
}

.radio.agreeRadio::after {
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

.sendCode {
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #868c9a;
}

.btn-box .van-button[color="#F8F5FF"] {
  color: #6B39F4 !important;
}


.resend-btn {
  color: #6B39F4 !important;
}

.resend-btn .van-button__content {
  color: #6B39F4 !important;
}

.upload-radio-active {
  border-color: #6B39F4 !important;
  position: relative;
}

.upload-radio-active::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: #6B39F4;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.upload-box {
  border: 1px #1C2024 dashed;
}
</style>
