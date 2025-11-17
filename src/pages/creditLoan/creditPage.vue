<template>
  <div class="div">
    <VanNavBar :title="t('Commit message')" :fixed="true" clickable placeholder :left-arrow="true" @click-left="onBack">

    </VanNavBar>

    <div class="form-box p-24 flex flex-col gap-12 relative" :class="{ 'pt-60': isEdit }">
      <div class="w-full h-40 flex items-center justify-center fixed status-top left-0"
        :class="statusClass[creditInfo.status]" v-if="creditInfo && creditInfo.status">
        {{ t(creditInfo.statusDesc) }}
      </div>
      <div class="input-box">
        <div class="label">{{ t('ID Card') }}</div>
        <inputCom :label="t('input.name')" v-model:value="form.name" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Income range') }}</div>
        <inputCom :label="t('input.name')" v-model:value="form.name" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Home address') }}</div>
        <inputCom :label="t('input.name')" v-model:value="form.name" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Bank account') }}</div>
        <inputCom :label="t('input.name')" v-model:value="form.name" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Family Member 1') }}</div>
        <inputCom :label="t('input.name')" v-model:value="form.name" class- require :only-read="isEdit" />
      </div>
      <div class="input-box">
        <div class="label">{{ t('Family Member 2') }}</div>
        <inputCom :label="t('input.name')" v-model:value="form.name" class- require :only-read="isEdit" />
      </div>
      <div class="radio-box">
        <div class="left flex font-size-14px font-500 flex-shrink-0 gap-12px flex-shrink-0">
          <div class="radio w-16px h-16px rounded-4px border-1px flex-shrink-0" :class="remember ? 'radio-active' : ''"
            @click="remember = !remember"></div>
          {{ t("I have confirmed that the bank authorization has been processed through my information by the official authorities.") }}
        </div>
      </div>

      <div class="btn-box mt-23" v-if="!isEdit || (isEdit && creditInfo.status == 3)">
        <van-button type="primary" block color="#6B39F4" class="h-72!" @click="submit">{{
          isEdit ? t("Resubmit") : t("submit")
          }}</van-button>
      </div>
    </div>
  </div>

  <van-popup v-model:show="showDatePicker" position="bottom">
    <van-date-picker v-model="currentDate" :title="t('input.PleaseSelect')" :min-date="minDate" :max-date="maxDate"
      @confirm="onDateConfirm" />
  </van-popup>
  <van-popup v-model:show="showGenderPicker" position="bottom">
    <van-picker :model-value="[form.gender]" :columns="columns" @cancel="showGenderPicker = false"
      @confirm="onConfirm" />
  </van-popup>
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
const showPicker = ref(false);
const route = useRoute();
const minDate = ref(new Date(1870, 0, 1));
const maxDate = ref(new Date(2025, 10, 1));
const emits = defineEmits(["onConfirm"]);
const creditInfo = ref<any>({});
const form = reactive({
  ipoId: "",
  assetId: "",
  name: "",
  gender: "",
  genderDesc: "",
  creditAmount: "",
  address: "",
  work: "",
  birthday: [],
  birthdayDesc: "",
  taxNumber: "", //税号
  income: "", //年收入
  phone: "", //联系电话
  idCard: "", // 身份证号码
});
const handleClickDatePop = () => {
  if (form.birthday && !form.birthday.length) {
    // 获取当天日期 并且填入form.birthday,格式同 currentDate
    currentDate.value = [
      dayjs().format("YYYY"),
      dayjs().format("MM"),
      dayjs().format("DD"),
    ];
  }
  showDatePicker.value = true;
};
const onDateConfirm = ({ selectedValues }) => {
  form.birthday = selectedValues;
  form.birthdayDesc = selectedValues.join("-");
  showDatePicker.value = false;
};
const onConfirm = ({ selectedValues }) => {
  form.gender = selectedValues[0];
  form.genderDesc = selectedValues[0] === "male" ? "Male" : "Female";
  showGenderPicker.value = false;
};
const submitOriginal = async () => {
  if (!checkedFormRequired()) {
    showToast(t("input.PleaseEnter"));
    return;
  }
  let params = {
    ipoId: form.ipoId,
    assetId: form.assetId,
    creditAmount: form.creditAmount,
    creditInfo: "", // 申请信息
  };
  // 深克隆一个form对象
  let creditInfo = JSON.parse(JSON.stringify(form));
  delete creditInfo.assetId;
  delete creditInfo.creditAmount;
  params.creditInfo = JSON.stringify(creditInfo);
  console.log(params);
  const { code, message } = await creditApply({
    ...params,
  });
  if (code == 200) {
    setTimeout(() => {
      router.push("/ipo");
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
    form.creditAmount = data.creditAmount;
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
  console.log(route.query);
  if (route.query.ipoId) {
    form.ipoId = route.query.ipoId as string;
  }
  if (route.query.assetId) {
    form.assetId = route.query.assetId as string;
    checkedApplyInfo();
  }
  if (route.query.edit == "1") {
    isEdit.value = true;
    getPageList();
  }
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

.radio:hover {
  // border-color: #6b39f4;
}
</style>
