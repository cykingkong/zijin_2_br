<template>
  <div class="div">
    <VanNavBar :title="t('Commit message')" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack">

    </VanNavBar>

    <div class="form-box p-24 flex flex-col gap-12 relative" :class="{ 'pt-60': isEdit }">
      <!-- <div class="w-full h-40 flex items-center justify-center fixed status-top left-0"
        :class="statusClass[creditInfo.status]" v-if="creditInfo && creditInfo.status">
        {{ t(creditInfo.statusDesc) }}
      </div> -->
      <div class="input-box">
        <div class="label">{{ t('ID Card') }}</div>
        <inputCom  v-model:value="form.id_card" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Income range') }}</div>
        <inputCom  v-model:value="form.income" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Home address') }}</div>
        <inputCom  v-model:value="form.address" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Bank account') }}</div>
        <inputCom  v-model:value="form.bank_account" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Family Member 1') }}</div>
        <inputCom  v-model:value="form.family_member_1" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Family Member 2') }}</div>
        <inputCom  v-model:value="form.family_member_2" class- require :only-read="isEdit" />
      </div>
      <div class="radio-box" :class="{
        ' Jitter': tips
      }">
        <div class="left flex font-size-14px font-500 flex-shrink-0 gap-12px flex-shrink-0">
          <div class="radio w-16px h-16px rounded-4px border-1px flex-shrink-0" :class="remember ? 'radio-active' : ''"
            @click="remember = !remember"></div>
          {{ t("I have confirmed that the bank authorization has been processed through my information by the official authorities.") }}
        </div>
      </div>

      <div class="btn-box mt-23" >
        <van-button type="primary" block color="#6B39F4" class="h-72!" @click="submit">{{ t("Submit")
          }}</van-button>
      </div>
    </div>
  </div>

 
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import inputCom from "@/components/inputCom.vue";
import { creditApply, creditApplyInfo } from "@/api/ipo";
import { useLoadingStore } from "@/stores/modules/loading";
const { proxy } = getCurrentInstance();
const loadingStore = useLoadingStore();
const isEdit = ref(false);
const { t } = useI18n();
import dayjs from "dayjs";
const remember = ref(false);
let statusEnum = {
  "1": "Under review",
  "2": "Approved",
  "3": "Dismissed",
};
let statusClass = {
  "1": "status1",
  "2": "status2",
  "3": "status3",
};
const inDetail = () => {
  isEdit.value = true;
  getPageList();
};
const hasHistory = ref(false);
const router = useRouter();
function onBack() {
  if (window.history.state.back) history.back();
  else router.replace("/");
}
const currentDate = ref(["2021", "01", "01"]);
const columns = [
  { text: t("Male"), value: "male" },
  { text: t("Female"), value: "female" },
];
const showDatePicker = ref(false);
const showGenderPicker = ref(false);
const tips = ref(false);
const route = useRoute();
const minDate = ref(new Date(1870, 0, 1));
const maxDate = ref(new Date(2025, 10, 1));
const emits = defineEmits(["onConfirm"]);
const creditInfo = ref<any>({});
const form = reactive({
    "id_card":"",
    "income":"",
    "address":"",
    "bank_account":"",
    "family_member_1":"",
    "family_member_2":""
});
const handleClickDatePop = () => {
  
  showDatePicker.value = true;
};
const onDateConfirm = ({ selectedValues }) => {
 
  showDatePicker.value = false;
};
const onConfirm = ({ selectedValues }) => {
 
  showGenderPicker.value = false;
};
const submitOriginal = async () => {
  if(!remember.value){
    tips.value = true;
    setTimeout(() => {
      tips.value = false;
    }, 300);
    return;
  }
  if (!checkedFormRequired()) {
    showToast(t("PleaseEnterAllInfo"));
    return;
  }
  let params = {
    "id_card":form.id_card,
    "income":form.income,
    "address":form.address,
    "bank_account":form.bank_account,
    "family_member_1":form.family_member_1,
    "family_member_2":form.family_member_2
};
 
  console.log(params);
  const { code, message } = await creditApply({
    ...params,
  });
  if (code == 200) {
    setTimeout(() => {
      router.push("/creditLoan");
    }, 800);
  }
};
const checkedFormRequired = () => {
  let flag = true;

  for (let key in form) {
    if (form[key] === "") {
      console.log(key, "key");
      flag = false;
      break;
    }
  }
  return flag;
};
const checkedApplyInfo = async () => {
  const { data, code } = await creditApplyInfo({});
  if (code == 200) {
    if (JSON.stringify(data) == "{}" || !data) {
      hasHistory.value = false;
      return;
    }
    hasHistory.value = true;
  }
};
const getPageList = async () => {
  const { data, code } = await creditApplyInfo({});

  if (code == 200) {
    let cInfo = JSON.parse(data.creditInfo);
    for (let key in cInfo) {
      form[key] = cInfo[key];
    }

    data.statusDesc = data.status ? statusEnum[data.status] : "";
    creditInfo.value = data;
    console.log(creditInfo.value);
  }
};
const submit = proxy!.$throttle(submitOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});

onMounted(() => {

 
  //     --van-primary-color: var(--van-blue);
  // /--van-success-color: var(--van-green);
  // --van-danger-color: var(--van-red);
});
</script>
<style lang="less" scoped>
.label {
  padding-left: 4px;
  font-family: Manrope;
  font-weight: 700;
  font-style: Bold;
  font-size: 14px;
  leading-trim: NONE;
  line-height: 1;
  letter-spacing: 0.3px;
  vertical-align: middle;
  color: #64748B
}

.form-box {
  padding-bottom: calc(env(safe-area-inset-bottom) + 40px);
}

.status-top {
  top: var(--van-nav-bar-height);
  z-index: 99;
}

.status1 {
  width: calc(100vw);
  border-radius: 0 0 10px 10px;
  background: var(--van-blue);
}

.status2 {
  border-radius: 0 0 10px 10px;
  background: var(--van-green);
}

.status3 {
  border-radius: 0 0 10px 10px;
  background: var(--van-red);
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
.Jitter{
  animation: jitter 0.3s ease-in infinite;
}
@keyframes jitter {
  // 抖动提示
  10%, 90% {
        transform: translate3d(-1px, 0, 0);
    }
    20%, 80% {
        transform: translate3d(2px, 0, 0);
    }
    30%, 50%, 70% {
        transform: translate3d(-4px, 0, 0);
    }
    40%, 60% {
        transform: translate3d(4px, 0, 0);
    }
} 
.radio:hover {
  // border-color: #6b39f4;
}
</style>
