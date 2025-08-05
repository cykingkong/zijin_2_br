<template>
  <div class="exchange-in-content p-12">
    <div class="t font-size-16">
      {{ t("Please select the payment currency") }}
    </div>
    <div class="flex w-full gap-12 my-12">
      <div
        class="channel-item rounded-10 flex-1 text-align-center py-12"
        v-for="(item, index) in tabList"
        :key="index"
        :class="{ active: index == active }"
        @click="handleClickTab(index)"
      >
        <!-- <img :src="item.icon" alt="" class="block w-55px h-55px mx-auto" /> -->
        <div class="font-size-18">{{ item.method.name }}</div>
      </div>
    </div>
    <div class="w-full h-1 bg-[#212C4E] mb-12"></div>
    <!-- <inputCom
      :label="t('RechargeQuantity')"
      :placeholder="t('input.PleaseEnter')"
      v-model:value="form.num"
      :tips="''"
    >
    </inputCom> -->
    <div class="tab-box flex gap-12">
      <div
        class="tab-item p-12 font-size-16 rounded-10px"
        v-for="(item, index) in btnList"
        @click="handleClickAupay(index)"
        :class="{ 'active-item': index == activeBtn }"
        :key="index"
      >
        {{ item.name }}
      </div>
    </div>
    <div
      v-if="showQrCode && qrValue"
      class="qrcode-container mt-20 text-center mx-auto"
    >
      <canvas ref="qrCodeRef" class="mx-auto" width="200" height="200"></canvas>
    </div>
    <div class="w-120 mt-12 mx-auto">
      <van-button type="primary" block @click="safeQrcode">{{
        t("Save QR code")
      }}</van-button>
    </div>
    <div class="font-size-14 mt-12 text-align-center">
      {{ qrValue }}
    </div>

    <div class="w-120 mt-12 mx-auto">
      <van-button
        type="primary"
        class="h-30!"
        plain
        block
        @click="copyQrValue"
        >{{ t("Copy address") }}</van-button
      >
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { Toast, showToast } from "vant";
import { aupay_notify, mgm_notify, qeawapay_notify } from "@/api/payment";
import { coinRechargeConfig } from "@/api/recharge";
import QRCode from "qrcode";
import btcIcon from "@/assets/btc_icon.png";
import trxIcon from "@/assets/trx_icon.png";
import ethIcon from "@/assets/eth_icon.png";
const tabList = ref([]);
const { t } = useI18n();
let form = reactive({ num: "" });
const btnList = computed(() => {
  if (tabList.value.length == 0) {
    return [];
  }
  return tabList.value[active.value]?.network || [];
});

const active = ref(0);
const router = useRouter();
const toUrl = (url) => {
  router.push({ path: url });
};
const showQrCode = ref(true); // 默认显示二维码
const qrValue = ref("");
const activeBtn = ref(0);
const getTabList = async () => {
  const { data, code } = await coinRechargeConfig();
  if (code == 200) {
    tabList.value = data || [];
    showQrCode.value = true;

    qrValue.value =
      tabList.value[active.value]?.network[activeBtn.value].address;
    setTimeout(() => {
      generateQrCode();
    }, 400);
  }
};
// 页面加载时初始化第一个二维码
onMounted(() => {});
const handleClickTab = (index) => {
  active.value = index;
  qrValue.value = btnList.value[activeBtn.value].address;
};
const handleClickAupay = (index) => {
  activeBtn.value = index;
  showQrCode.value = true;
  qrValue.value = btnList.value[activeBtn.value].address;
};
const qrCodeRef = ref<HTMLCanvasElement>();
const generateQrCode = () => {
  if (qrCodeRef.value && qrValue.value) {
    QRCode.toCanvas(
      qrCodeRef.value,
      qrValue.value,
      {
        width: 200,
        errorCorrectionLevel: "H",
      },
      (error) => {
        if (error) console.error("生成二维码失败:", error);
      }
    );
  }
};

onMounted(() => {
  generateQrCode();
  getTabList();
});

watch([activeBtn, active], generateQrCode);
// 保存二维码图片
const safeQrcode = async () => {
  if (!qrCodeRef.value) {
    // showToast("请先生成二维码");
    return;
  }

  try {
    // 将canvas转换为数据URL
    const image = qrCodeRef.value.toDataURL("image/png");

    // 创建临时链接进行下载
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = image;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(t("QR code saved"));
  } catch (error) {
    // showToast("保存失败，请重试");
    console.error("保存二维码失败:", error);
  }
};

// 复制二维码文本内容
const copyQrValue = async () => {
  try {
    // 将二维码文本内容复制到剪贴板
    const textArea = document.createElement("textarea");
    textArea.value = qrValue.value;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    // await navigator.clipboard.writeText();
    showToast(t("The address has been copied to the clipboard."));
  } catch (err) {
    console.log(err);
    showToast(t("Copy failed"));
  }
};

const handleClickQeawapay = () => {
  qeawapay_notify({}).then((res) => {
    if (res.code == 200) {
      // toUrl('/deal/exchange/usdt-in-qeawapay')
    }
  });
};
</script>
<route lang="json5">
{
  meta: {
    i18n: 'USDT Recharge',
  },
}
</route>
<style lang="less" scoped>
:deep(.van-cell) {
  // --van-cell-background: #131a2e;
}

.channel-item {
  border: 1px solid #1678ff;
}

.tab-item {
  border: 1px solid;
  border-color: #fff;
}

.active {
  background: #116677b0;
}

.active-item {
  border-color: #1678ff;
  background: #116677b0;
}

.qrcode-container {
  padding: 12px;
  background: #fff;
  border-radius: 8px;
  display: block;
  width: 224px;
}
</style>
