<template>
  <div class="securityVerificationContent p-12">
    <!-- 安全认证 -->
    <div class="font-size-24 mb-24">{{ t("Security certification") }}</div>
    <inputCom
      :label="t('Fund Password')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.password"
      class="mb-24"
    >
    </inputCom>
    <van-button type="primary" block @click="handelClickBtn">{{
      t("submit")
    }}</van-button>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { withdraw } from "@/api/recharge";
import { useStore } from "@/stores/modules/index";
import { useLoadingStore } from "@/stores/modules/loading";
import { useUserStore } from "@/stores";
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const store = useStore();
const loadingStore = useLoadingStore();
const { proxy } = getCurrentInstance()!;
const params = computed(() => store.getWithdrawParams);
const router = useRouter();
const { t } = useI18n();
const form = reactive({
  password: "",
});
const handleClickSubmitOriginal = async () => {
  console.log(userInfo.value.kycStatus);
  if (userInfo.value.kycStatus != 2) {
    let url =
      userInfo.value.kycStatus == 0
        ? "/profile/authentication"
        : "/certificationCenter";

    router.push({ path: url });
    return;
  }
  let submitData = {
    ...params.value,
    password: form.password,
  };
  const { data, code } = await withdraw(submitData);
  if (code === 200) {
    showToast(t("Recharge submitted successfully"));
    store.setWithdrawParams({});
    router.push("/deal/exchange/withdraw-usdt");
  }
};
onUnmounted(() => {
  store.setWithdrawParams({});
});
onMounted(() => {});
const handelClickBtn = proxy!.$throttle(handleClickSubmitOriginal, 1000, {
  onStart: () => loadingStore.show(),
  onEnd: () => loadingStore.hide(),
});
</script>
<route lang="json5">
{
  meta: {
    i18n: 'Security certification',
  },
}
</route>
<style lang="less" scoped></style>
