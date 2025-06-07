<template>
  <VanNavBar :title="hasHistory ? t('detail') : t('apply')" :fixed="true" clickable placeholder :left-arrow="true"
    @click-left="onBack">
    <template #right>
      <div class="font-size-16" @click="inDetail" v-if="hasHistory">
        {{ !isEdit ? t("edit") : "" }}
      </div>
    </template>
  </VanNavBar>

  <div class="form-box p-12 flex flex-col gap-12 relative" :class="{ 'pt-60': isEdit }">
    <div class="w-full h-40 flex items-center justify-center fixed status-top left-0"
      :class="statusClass[creditInfo.status]">
      {{ creditInfo.statusDesc }}
    </div>
    <inputCom :label="t('input.name')" :placeholder="t('input.PleaseEnter')" v-model:value="form.name" require
      :only-read="isEdit" />
    <inputCom :label="t('input.birthday')" :placeholder="t('input.PleaseEnter')" v-model:value="form.birthday"
      :inputType="'picker'" require>
      <template #picker>
        <div class="w-full flex items-center justify-between" @click="handleClickDatePop">
          <div class="text-gray">
            {{ form.birthdayDesc ? form.birthdayDesc : t("input.PleaseEnter") }}
          </div>
        </div>
      </template>
      <template #sendCode>
        <van-icon name="arrow" class="rotate-90deg" size="20" color="#999999" />
      </template>
    </inputCom>
    <inputCom :label="t('input.gender')" :placeholder="''" v-model:value="form.gender" require :inputType="'picker'">
      <template #picker>
        <div class="w-full flex items-center justify-between" @click="showGenderPicker = true">
          <div class="text-blueGray-400">
            {{ form.genderDesc ? form.genderDesc : t("input.PleaseSelect") }}
          </div>
        </div>
      </template>
      <template #sendCode>
        <van-icon name="arrow" class="rotate-90deg" size="20" color="#999999" />
      </template>
    </inputCom>
    <inputCom :label="t('input.IDCard')" :placeholder="t('input.PleaseEnter')" v-model:value="form.idCard" require />
    <inputCom :label="t('input.work')" :placeholder="t('input.PleaseEnter')" v-model:value="form.work" require />
    <inputCom :label="t('input.taxNumber')" :placeholder="t('input.PleaseEnter')" v-model:value="form.taxNumber"
      require />
    <inputCom :label="t('input.YearIncome')" :placeholder="t('input.PleaseEnter')" v-model:value="form.income"
      require />
    <inputCom :label="t('input.phone')" :placeholder="t('input.PleaseEnter')" v-model:value="form.phone" require />
    <inputCom :label="t('input.address')" :placeholder="t('input.PleaseEnter')" v-model:value="form.address" require />
    <inputCom :label="t('input.creditAmount')" :placeholder="t('input.PleaseEnter')" v-model:value="form.creditAmount"
      require />
    <div class="btn-box" v-if="!isEdit || (isEdit && creditInfo.status == 3)">
      <van-button type="primary" block @click="submit">{{
        isEdit ? t("Resubmit") : t("submit")
        }}</van-button>
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
let statusEnum = {
  "1": "审核中",
  "2": "审核通过",
  "3": "审核失败",
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
  { text: "男", value: "male" },
  { text: "女", value: "female" },
];
const showDatePicker = ref(false);
const showGenderPicker = ref(false);
const showPicker = ref(false);
const route = useRoute();
const minDate = ref(new Date(1870, 0, 1));
const maxDate = ref(new Date(2025, 10, 1));
const emits = defineEmits(["onConfirm"]);
const creditInfo = ref({});
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
  form.genderDesc = selectedValues[0] === "male" ? "男" : "女";
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
    data.statusDesc = statusEnum[data.status];
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
</style>
