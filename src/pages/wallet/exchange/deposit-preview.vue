<template>
  <div class="deposit-preview bg-#0F172A min-h-screen">
    <!-- 头部导航 -->
    <VanNavBar
      :title="t('Deposit preview')"
      :fixed="true"
      clickable
      :left-arrow="true"
      @click-left="onBack"
      z-index="999"
    />

    <!-- 主要内容 -->
    <div class="content px-12 pt-80px pb-24px">
      <!-- 主卡片 -->
      <div class="main-card bg-white rounded-16px p-24px mb-24px">
        <!-- 顶部图标和金额 -->
        <div class="top-section text-center mb-32px">
          <div
            class="icon-wrapper w-80px h-80px rounded-full mx-auto mb-16px flex items-center justify-center"
          >
            <img
              :src="depositData.logo"
              alt=""
              class="w-full h-full"
              v-if="depositData.logo"
            />
          </div>
          <div class="deposit-type text-14px color-#6B7280 mb-8px">
            Deposit ({{ depositData.unit }})
          </div>
          <div class="amount text-32px font-700 color-#0F172A">
            + MX${{ depositData.amount }}
          </div>
        </div>

        <!-- 详细信息 -->
        <div class="details-section">
          <!-- 钱包地址 -->
          <div
            class="detail-row flex justify-between items-start py-16px border-b border-#E5E7EB"
          >
            <div class="label text-14px color-#0F172A">
              {{ t("Wallet address") }}
            </div>
            <div
              class="value text-14px color-#0F172A text-right max-w-200px break-all"
            >
              {{ depositData.address }}
            </div>
          </div>

          <!-- USDT数量 -->
          <div
            class="detail-row flex justify-between items-center py-16px border-b border-#E5E7EB"
          >
            <div class="label text-14px color-#0F172A">
              {{ depositData.unit }} {{ t("Quantity") }}
            </div>
            <div class="value text-14px color-#0F172A">
              {{ depositData.rate }} {{ depositData.unit }}
            </div>
          </div>

          <!-- 充值到账 -->
          <div class="detail-row flex justify-between items-center py-16px">
            <div class="label text-14px color-#0F172A">
              {{ t("Deposit Arrived") }}
            </div>
            <div class="value text-14px color-#0F172A">
              20 {{ t("times") }}{{ t("Network Confirmation") }}
            </div>
          </div>
        </div>
      </div>

      <!-- 注意事项 -->
      <div class="note-section bg-white rounded-16px p-24px mb-24px">
        <div class="note-title text-16px font-700 color-#DC2626 mb-16px">
          {{ t("Notice") }}
        </div>
        <div class="note-content">
          <div class="note-item flex items-start gap-8px mb-12px">
            <div
              class="dot w-6px h-6px rounded-full bg-#DC2626 mt-8px flex-shrink-0"
            ></div>
            <div class="text text-14px color-#0F172A leading-20px">
              {{ t("Do not deposit any non-") }}{{ depositData.unit
              }}{{
                t(
                  " deposits, otherwise assets will not arrive and cannot be recovered."
                )
              }}
            </div>
          </div>
          <div class="note-item flex items-start gap-8px mb-12px">
            <div
              class="dot w-6px h-6px rounded-full bg-#DC2626 mt-8px flex-shrink-0"
            ></div>
            <div class="text text-14px color-#0F172A leading-20px">
              {{
                t(
                  "Please provide your correct wallet address to ensure successful deposit."
                )
              }}
            </div>
          </div>
          <div class="note-item flex items-start gap-8px">
            <div
              class="dot w-6px h-6px rounded-full bg-#DC2626 mt-8px flex-shrink-0"
            ></div>
            <div class="text text-14px color-#0F172A leading-20px">
              {{
                t(
                  "This asset currently does not support smart contract deposits! Do not use smart contract deposits, otherwise assets will not arrive and cannot be recovered."
                )
              }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <BottomButton
      bg-color="#0F172A"
      :button-text="`${t('Copy wallet address for payment')}`"
      @click="handleCopyAddress"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import BottomButton from "../component/bottom-button.vue";

const { proxy } = getCurrentInstance()!;
const router = useRouter();
const { t } = useI18n();
// 充值数据
const depositData = ref({
  amount: "280.00",
  unit: "MX$",
  rate: "233.33",
  logo: null,
  address: "TKVHsXQLiPHjtPQsUNCCw7YAA6shu1ym6B",
  name: "USDT-TRC20",
});

// 更新info的函数
const updateInfo = () => {
  const dataInfo = localStorage.getItem("cryptoInfo");
  if (dataInfo) {
    try {
      // 如果dataInfo是JSON字符串，则解析为对象
      depositData.value = JSON.parse(dataInfo);
    } catch (error) {
      // 如果不是JSON格式，直接赋值字符串
      depositData.value = dataInfo;
    }
  } else {
    depositData.value = null;
  }
};
// 返回上一页
const onBack = () => {
  router.back();
};

// 复制钱包地址
const handleCopyAddress = async () => {
  try {
    await navigator.clipboard.writeText(depositData.value.address);
    // 可以添加复制成功的提示
    console.log("钱包地址已复制到剪贴板");
  } catch (err) {
    console.error("复制失败:", err);
  }
};
onMounted(() => {
  updateInfo();
});
</script>

<style lang="less" scoped>
.deposit-preview {
  .content {
    padding-bottom: calc(env(safe-area-inset-bottom) + 80px);
  }

  .main-card {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .note-section {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .icon-wrapper {
    // box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
  }

  .detail-row {
    border-bottom: 1px solid #e5e7eb;

    &:last-child {
      border-bottom: none;
    }
  }
}

// 为这个页面单独设置导航栏样式
:deep(.van-nav-bar) {
  --van-nav-bar-background: #0f172a !important;
  --van-nav-bar-title-text-color: #fff !important;
  --van-nav-bar-text-color: #fff !important;
  --van-nav-bar-icon-color: #fff !important;
  --van-border-color: transparent !important;
}
</style>