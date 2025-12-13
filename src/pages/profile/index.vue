<script setup lang="ts">
import router from "@/router";
import { useI18n } from "vue-i18n";
import { indexInfo, } from "@/api/market";

import { locale } from "@/utils/i18n";
import { useUserStore } from "@/stores";
import { loanIndex } from "@/api/ipo";
import cell1 from "@/assets/cell/cell1.png";
import cell2 from "@/assets/cell/cell2.png";
import cell3 from "@/assets/cell/cell3.png";
import cell4 from "@/assets/cell/cell4.png";
import cell5 from "@/assets/cell/cell5.png";
import cell6 from "@/assets/cell/cell6.png";
import cell7 from "@/assets/cell/cell7.png";
import cell8 from "@/assets/cell/cell8.png";
import { addCommasToNumber } from "@/utils/tool";



const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const indexInfoData = ref({
  level_name: '',
})
const { t } = useI18n();


//  首字母转大写
const toUpperCase = (str: string) => {
  try {
    return str.toUpperCase();
  } catch {
    return str;
  }
};
const cellList = [
  {
    label: t("Other"),
    cell: [
      {
        text: t("Change Password"),
        tips: "",
        iconType: "img",
        icon: cell1,
        url: "/profile/changePassword",
        type: "changePassword",
      },
      {
        text: t("Income Details"),
        tips: "",
        iconType: "img",
        icon: cell2,
        url: "/wallet/walletLogs",
        type: "incomeDetails",
      },
      {
        text: t("Coupon List"),
        tips: "",
        iconType: "img",
        icon: cell3,
        url: "/profile/userCouponList",
        type: "couponList",
      },
      {
        text: t("Bank Account"),
        tips: "",
        iconType: "img",
        icon: cell4,
        url: "/profile/bankAccount",
        type: "bankAccount",
      },
      {
        text: t("About Us"),
        tips: "",
        iconType: "img",
        icon: cell5,
        url: "",
        type: "aboutUs",
      },
      {
        text: t("App Download"),
        tips: "",
        iconType: "img",
        icon: cell6,
        url: "",
        type: "appDownload",
      },
      {
        text: t("Languange"),
        tips: toUpperCase(locale.value),
        iconType: "img",
        icon: cell7,
        url: "/profile/languange",
      }, {
        text: t("Logout"),
        iconType: "img",
        icon: cell8,
        url: "/profile/languange",
        color: '#FF4345',
        type: "logout",
      },
    ],
  },


];
const formatName = (str) => {
  // 将姓名开头的62 去掉，然后只显示前三字符和后三字符，中间用***替换
  if (typeof str !== 'string') {
    return '';
  }

  // 去掉开头的62
  let processedStr = str;
  if (str.startsWith('62')) {
    processedStr = str.substring(2);
  }

  // 如果处理后的字符串长度小于等于6，直接返回
  if (processedStr.length <= 6) {
    return processedStr;
  }

  // 截取前3个字符和后3个字符，中间用***替换
  const firstThree = processedStr.substring(0, 3);
  const lastThree = processedStr.substring(processedStr.length - 3);

  return `${firstThree}***${lastThree}`;

};
const handleHerf = (type) => {
  if (type == 2) {
    router.push("/wallet/exchange/channel-out");
  } else {
    router.push("/wallet/exchange/withdraw-bank");
  }
}
const handleClickCell = async (item: any) => {
  if (item && item.url) {
    if (item.type == 'logout') {
      handleLogout()
      return
    }
    if (item.type == "Identify" && [1, 2].includes(userInfo.value.kyc_status)) {
      return;
    }
    if (item.type == "phone" && userInfo.value.phone) {
      return;
    }

    if (item.type == "creditLoan") {
      const { data, code } = await loanIndex({})
      if (code == 200) {
        // 如果data 为空对象
        if (JSON.stringify(data) == "{}") {
          router.push('/creditLoan/creditPage');
        } else {
          router.push('/creditLoan');
        }
      }
      return;
    }
    router.push(item.url);
  }
};
// const handleClickGrid = (index: any) => {
//   router.push(gridList[index].url);
// };
const handleLogout = () => {
  // clearToken()
  userStore.logout();
  router.push({ path: "/login" });
};
onMounted(async () => {
  await userStore.getInfo();
  await userStore.getWalletInfo();

  indexInfo().then((res) => {
    indexInfoData.value = res.data
  })
});
</script>

<template>
  <div class="myself-index pt-16">
    <!-- <VanNavBar title="" :fixed="true" clickable placeholder :left-arrow="false" @click-right="toKfUrl">
      <template #right>
        <van-icon name="service-o" class="icon" />
      </template>
</VanNavBar> -->
    <div class="top-info flex items-center justify-between px-16">
      <div class="user-info flex items-center gap-[12px]">
        <div class="avatar rounded-full bg-[#f0f0f0] w-[40px] h-[40px] flex items-center justify-center">
          <img src="@/assets/image/avatar.png" alt="" class="w-full h-full object-cover rounded-full">
        </div>
        <div class="info">
          <div class="phone text-[16px] text-[#000] font-bold">{{ indexInfoData.level_name + userInfo.level }} </div>
          <div class="phone text-[14px] text-[#64748B] mt-[4px]">+62 {{ formatName(userInfo.username) }}</div>
        </div>
      </div>
      <!-- <div class="edit-info rounded-[8px] flex items-center gap-8">
        <svg width="16" height="16" class="w-16 h-16" viewBox="0 0 16 16" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.0025 7.99994V10.6677C14.0025 12.5094 12.5095 14.0024 10.6678 14.0024H5.33222C3.4905 14.0024 1.9975 12.5094 1.9975 10.6677V5.33216C1.9975 3.49044 3.4905 1.99744 5.33222 1.99744H8"
            stroke="#1B1B1B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M11.5878 2.41112C11.8532 2.14592 12.2131 1.9971 12.5883 1.99744C12.9635 1.99777 13.3231 2.14724 13.588 2.41291V2.41291C13.8534 2.6782 14.0024 3.03808 14.0024 3.41331C14.0024 3.78855 13.8532 4.14838 13.5878 4.41361C13.5874 4.41319 10.8026 7.19786 9.83956 8.16081C9.62975 8.3706 9.35575 8.50411 9.06123 8.54004L8.07562 8.66177C7.87121 8.68701 7.6667 8.61559 7.52245 8.46857C7.3782 8.32156 7.31066 8.11574 7.33978 7.91184L7.48559 6.89074C7.52531 6.60629 7.65662 6.34251 7.85965 6.13935C8.5336 5.4651 10.1806 3.81806 11.5878 2.41112Z"
            stroke="#1B1B1B" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ t('Edit Info') }}
      </div> -->
    </div>
    <div class="px-[16px] mt-[9px]">
      <div class="money-grid p-16 gap-8 flex flex-col">
        <div class="top-grid flex">
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.balance) || 0 }}</div>
            <div class="label">{{ t('Wallet Balance') }}</div>
          </div>
          <div class="grid-item flex-1">
            <div class="money text-nowrap">₹ {{ addCommasToNumber(userInfo.itemBalance) }}</div>
            <div class="label">{{ t('Withdrawable Amount') }}</div>
          </div>
        </div>
        <div class="grid-three flex">
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.rechargePrice) || 0 }}</div>
            <div class="label">{{ t('Total Top up') }}</div>
          </div>
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.withdrawPrice) || 0 }}</div>
            <div class="label">{{ t('Total Withdrawal') }}</div>
          </div>
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.productPrice) || 0 }}</div>
            <div class="label">{{ t('Product Total Value') }}</div>
          </div>
        </div>
        <div class="grid-three flex">
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.todayProfit) || 0 }}</div>
            <div class="label">{{ t(`Today's Earnings`) }}</div>
          </div>
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.itemProfit) || 0 }}</div>
            <div class="label">{{ t('Teams Earnings') }}</div>
          </div>
          <div class="grid-item flex-1">
            <div class="money">₹ {{ addCommasToNumber(userInfo.allProfit) || 0 }}</div>
            <div class="label">{{ t('Total Earnings') }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-[16px] mt-[15px]">
      <div class="flex gap-16">
        <div type="primary" color="#F6F6F6" :style="{ color: '#1B1B1B' }"
          class="withdraw-btn flex-1 items-center flex justify-center text-center bg-[#fff] rounded-[12px] h-[48px]! color-[#1b1b1b]!"
          block @click="handleHerf(1)">
          {{
            t("Withdraw")
          }}
        </div>
        <div class="flex-1">
          <van-button type="primary" block color="#1b1b1b" class="mt-[24px]  h-[48px]!  flex-1"
            @click="handleHerf(2)">{{
              t("Deposit")
            }}</van-button>
        </div>
      </div>
    </div>
    <div class="setting-list p-[24px]">
      <div class="setting-box" v-for="(item, index) in cellList" :key="index">
        <div class="setting-label mb-[16px] text-[#0F172A] font-bold lett">
          {{ item.label }}
        </div>
        <div
          class="cell-item px-[12px] w-full rounded-[12px] border border-[#E2E8F0] border-solid h-[72px] flex items-center justify-between mb-[16px]"
          v-for="(cell, k) in item.cell" :key="k" @click="handleClickCell(cell)">
          <div class="left flex items-center h-40 gap-[12px]">
            <img :src="cell.icon" class="w-20 h-20 flex-shrink-0 block imgIcon" alt="" v-if="cell.iconType == 'img'" />
            <div class="info h-full flex flex-col justify-center gap-8">
              <div class="t" :class="cell.type == 'logout' ? 'text-[#FF4345]' : ''">{{ cell.text }}</div>
              <div class="t2 text-[#64748B] text-[10px]" v-if="cell.tips">
                {{ cell.tips }}
              </div>
            </div>
          </div>
          <div class="r flex items-center gap-6">
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" v-if="
              cell.type && cell.type == 'Identify' && userInfo.kyc_status == 2
            ">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M0.377516 3.08241C0 3.62028 0 5.21907 0 8.41666V9.99136C0 15.6294 4.23896 18.3655 6.89856 19.5273C7.62001 19.8424 7.98074 20 9 20C10.0193 20 10.38 19.8424 11.1014 19.5273C13.761 18.3655 18 15.6294 18 9.99136V8.41666C18 5.21907 18 3.62028 17.6225 3.08241C17.245 2.54454 15.7417 2.02996 12.7351 1.00079L12.1623 0.804717C10.595 0.268239 9.81139 0 9 0C8.18861 0 7.40498 0.268239 5.83772 0.804717L5.26491 1.00079C2.25832 2.02996 0.755031 2.54454 0.377516 3.08241ZM12.0595 8.49951C12.3353 8.19053 12.3085 7.71642 11.9995 7.44055C11.6905 7.16467 11.2164 7.19151 10.9405 7.50049L7.92857 10.8739L7.05945 9.90049C6.78358 9.59151 6.30947 9.56467 6.00049 9.84055C5.69151 10.1164 5.66467 10.5905 5.94055 10.8995L7.36912 12.4995C7.51141 12.6589 7.71492 12.75 7.92857 12.75C8.14222 12.75 8.34573 12.6589 8.48802 12.4995L12.0595 8.49951Z"
                fill="#06cda5" />
            </svg>
            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg"
              v-if="cell.type && cell.type == 'phone' && userInfo.phone">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M0.377516 3.08241C0 3.62028 0 5.21907 0 8.41666V9.99136C0 15.6294 4.23896 18.3655 6.89856 19.5273C7.62001 19.8424 7.98074 20 9 20C10.0193 20 10.38 19.8424 11.1014 19.5273C13.761 18.3655 18 15.6294 18 9.99136V8.41666C18 5.21907 18 3.62028 17.6225 3.08241C17.245 2.54454 15.7417 2.02996 12.7351 1.00079L12.1623 0.804717C10.595 0.268239 9.81139 0 9 0C8.18861 0 7.40498 0.268239 5.83772 0.804717L5.26491 1.00079C2.25832 2.02996 0.755031 2.54454 0.377516 3.08241ZM12.0595 8.49951C12.3353 8.19053 12.3085 7.71642 11.9995 7.44055C11.6905 7.16467 11.2164 7.19151 10.9405 7.50049L7.92857 10.8739L7.05945 9.90049C6.78358 9.59151 6.30947 9.56467 6.00049 9.84055C5.69151 10.1164 5.66467 10.5905 5.94055 10.8995L7.36912 12.4995C7.51141 12.6589 7.71492 12.75 7.92857 12.75C8.14222 12.75 8.34573 12.6589 8.48802 12.4995L12.0595 8.49951Z"
                fill="#06cda5" />
            </svg>
            <div class="dot w-8 h-8 rounded-full bg-[#F14437]" v-if="userInfo.notify_start && cell.type == 'notify'">
            </div>
            <svg class="w-20 h-20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.33331 13.3334L11.6666 10.0001L8.33331 6.66675" stroke="#888888" stroke-width="1.5"
                stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          </div>
        </div>
      </div>

      <!-- <van-button type="primary" block color="#6B39F4" class="mt-[24px] h-[56px]" @click="handleLogout">{{ t("Logout")
        }}</van-button> -->
    </div>


  </div>
</template>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: 'profile',
    i18n: 'profile'
  },
}
</route>

<style lang="less" scoped>
.icon {
  color: var(--van-text);
  ;
}

.edit-info {
  border: 1px solid #F0F0F0;
  padding: 8px 10px;
}


.setting-label {
  letter-spacing: 0.4px;
}

.myself-index {
  padding-bottom: calc(80px + env(safe-area-inset-bottom));
}

.content {
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 600;
    color: var(--van-gary-1);
  }
}

.c {
  white-space: wrap;
  word-break: break-word;
}

.money {
  font-family: Noto Sans JP;
  font-weight: 400;
  font-style: Regular;
  font-size: 18px;
  white-space: nowrap;
  leading-trim: NONE;
  line-height: 150%;
  letter-spacing: 0px;
  text-align: center;
  vertical-align: middle;

}

.label {
  font-family: Noto Sans JP;
  font-weight: 400;
  font-style: Regular;
  font-size: 12px;
  leading-trim: NONE;
  line-height: 150%;
  letter-spacing: 0px;
  text-align: center;
  vertical-align: middle;
  margin-top: 6px;
  height: 50px;
}

.money-grid {
  border: 1px solid #E5E7EB;
  border-radius: 16px;
}

.withdraw-btn {
  border: 1px solid #F0F0F0;
  color: #000;
  background-color: #fff;
}
</style>
