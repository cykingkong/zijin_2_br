<template>
  <div class="profile-page min-h-screen bg-[#bcdce1] pb-[100px] ">

    <!-- 1. Header Title -->
    <div class="pt-[10px] pb-[10px] text-center">
      <h1 class="text-[18px] font-bold text-[#1A1A1A]">{{ t("Wallet") }}</h1>
    </div>

    <!-- 2. User Info Card -->
    <div class="px-[16px] mb-[16px]">
      <div class="flex items-center gap-[12px]">
        <!-- Avatar Upload Trigger -->
        <div class="relative" @click="handleClickUploadAvatar">
          <!-- Hexagon Shape Simulation or Circle as fallback -->
          <div class="w-[36px] h-[36px] rounded-full overflow-hidden  shadow-sm  flex items-center justify-center">
            <img :src="fakeData.user_level > 0 ? imgEnum[fakeData.user_level] : imgEnum[userInfo.vip]"
              class="w-full h-full object-cover" />
          </div>
          <!-- Level Badge -->

        </div>

        <div class="flex flex-col justify-center">
          <div class="flex items-center gap-2">
            <div
              class="-top-[4px] -right-[4px] bg-[#FECF90] text-[#A26D47] text-[10px] px-[4px] py-[1px] rounded-[4px] border border-white">
              {{ 'LV '+userInfo.vip || 'LV1' }}
            
            </div>
            <div class="ml-[14px] tag relative text-[10px] color-[#fff] rounded-[15px] h-[15px] pl-[13px] pr-[6px]" :class="lvBorderStartColors[userInfo.vip ]">
                <img src="@/assets/lv/shield.png" alt="" class="w-[17px] h-[19px] absolute left-[-4px] top-[-4px]">
                {{ userInfo.vip_name }}
              </div>
          </div>
          <!-- Missing Field: ID -->
          <div class="text-[#161616] text-[14px] font-bold">ID: {{userInfo.uuid }}</div>
        </div>
      </div>
    </div>

    <!-- 3. My Product Card -->
    <div class="px-[16px] mb-[16px] ">
      <div class="bg-white rounded-[16px] p-[16px]  shadow-sm text-center flex-wrap">
        <div class="flex w-full">
          <div class="flex-1">
            <div class="value font-bold mb-4 font-20 color-[#A26D47]">{{ userInfo.today_income || 0 }}</div>
            <div class="label font-bold mb-4 font-12 color-[#161616]">{{ t('Today Income') }}</div>
          </div>
          <div class="flex-1">
            <div class="value font-bold mb-4 font-20 color-[#A26D47]">{{ userInfo.total_income }}</div>
            <div class="label font-bold mb-4 font-12 color-[#161616]">{{ t('Total Income') }}</div>
          </div>
        </div>
        <button @click="handleHerf(1)"
          class="flex-1 mt-16 bg-[#1A1A1A] w-full text-white h-[44px] rounded-[12px] font-bold text-[15px]">{{
            t("Withdraw")
          }}</button>

      </div>
    </div>
    <!-- 3. Bottom Grid Menu (Replacs old Cell List) -->
    <div class="px-[16px] mb-16">
      <div class="bg-white rounded-[16px] p-[16px] shadow-sm grid grid-cols-3 gap-y-[24px]">
        <div v-for="(item, index) in menuList" :key="index" class="flex flex-col items-center"
          @click="handleClickMenu(item)">
          <!-- Icon Box -->
          <div class="w-[40px] h-[40px] mb-[8px] flex items-center justify-center">
            <img :src="item.img" alt="" class="w-40 h-40 block">
          </div>
          <!-- Text -->
          <span class="text-[#333] text-[12px] font-medium text-center" :class="{ 'text-red-500': item.isLogout }">{{
            item.text
            }}</span>
        </div>
      </div>
    </div>
    <!-- 4. walletLog -->
    <div class="px-[16px] mb-[16px]">
      <walletLogs />
    </div>




    <!-- Upload Popup (Kept from original) -->
    <van-popup v-model:show="uploadPopShow" destroy-on-close round :position="'center'" :safe-area-inset-bottom="true">
      <div class="p-12 w-[80vw]">
        <div class="upload-label mb-12 flex items-center justify-center font-bold">
          {{ t('Upload Avatar') }}
        </div>
        <van-uploader accept="image/*" :max-count="1" v-model="pictureList"
          :after-read="(file) => handleAfterRead(file, 1)" class="w-full flex justify-center">
          <div
            class="w-[120px] h-[120px] border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400">
            <van-icon name="photograph" size="24" />
            <span class="text-[12px] mt-2">{{ t("Choose a file") }}</span>
          </div>
        </van-uploader>
        <div class="mt-4 flex gap-4">
          <van-button block plain size="small" @click="uploadPopShow = false">{{ t("Cancel") }}</van-button>
          <van-button block type="primary" color="#1A1A1A" size="small" :disabled="canUpdateAvatar"
            @click="updateUserAvatar">{{ t("Confirm") }}</van-button>
        </div>
      </div>
    </van-popup>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores';
import { userUpdate, getUserFakeInfo, } from '@/api/user';

import { showFailToast, showSuccessToast } from 'vant';
import walletLogs from '../wallet/walletLogs.vue';
import { addCommasToNumber } from '@/utils/tool';
import defaultAvatar from "@/assets/image/avatar.png";
import inviteFriends from '@/assets/tabbar/inviteFriends.png'
import logout from '@/assets/tabbar/logout.png'
import pay from '@/assets/tabbar/pay.jpg'
// 复用之前的图片资源引入逻辑
import lv1 from '@/assets/lv/lv1.png';
import lv2 from '@/assets/lv/lv2.png';
import lv3 from '@/assets/lv/lv3.png';
import lv4 from '@/assets/lv/lv4.png';
import lv5 from '@/assets/lv/lv5.png';
import lv6 from '@/assets/lv/lv6.png';
import lv7 from '@/assets/lv/lv7.png';
import lv8 from '@/assets/lv/lv8.png';
// Import Icons (Placeholders based on screenshot)
// 实际开发请替换为对应的 cell1.png 等资源
import iconExchange from "@/assets/profile/1.svg"; // 兑换奖励
import iconBank from "@/assets/profile/2.svg";     // 银行卡
import iconFunds from "@/assets/profile/3.svg";    // 资金明细
import iconPass from "@/assets/profile/4.svg";     // 密码
import iconQuit from "@/assets/profile/5.svg";     // 辞职说明
import iconLogout from "@/assets/profile/6.svg";   // 登出

const router = useRouter();
const { t } = useI18n();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const fakeData = ref<any>({
  team_level1_count: 0,
  team_level2_count: 0,
  team_level3_count: 0,
})
const lvBorderStartColors = {                                                                                                                                                                 
    1: 'bg-#8BADC7',                                                                                                                                                                               
    2: 'bg-#9B7CB8',                                                                                                                                                                               
    3: 'bg-#4A8B7C',                                                                                                                                                                               
    4: 'bg-#D88A8A',
    5: 'bg-#E67A6A',
    6: 'bg-#D4A853',
    7: 'bg-#E8C06F',
    8: 'bg-#D4A853'
  }
const imgEnum = {
  1: lv1,
  2: lv2,
  3: lv3,
  4: lv4,
  5: lv5,
  6: lv6,
  7: lv7,
  8: lv8,
}

// --- 状态变量 ---
const uploadPopShow = ref(false);
const canUpdateAvatar = ref(true);
const userAvatar = ref('');
const pictureList = ref<any[]>([])

// --- 数据处理 ---


const formatName = (str: string) => {
  if (!str) return '';
  // 模拟截图: 389****4253
  if (str.length > 7) {
    return str.substring(0, 3) + '****' + str.substring(str.length - 4);
  }
  return str;
};

// 模拟获取团队各等级人数 (Missing Field)
const getLevelCount = (level: number) => {
  // 实际应从 API 获取
  return 30;
};

// --- 菜单配置 (Grid Menu) ---
const menuList = [

  { text: t('Bank Account'), icon: iconBank, url: '/profile/bankAccount/addBank', type: 'link' ,img:pay},

  { text: t('inviteFriends'), icon: iconQuit, url: '/inviteFriends', type: 'link' ,img:inviteFriends}, // 暂定 About Us
  { text: t('Logout'), icon: iconLogout, type: 'logout', isLogout: false,img:logout }
];
const myteamList = ref([
  {
    img: lv1,
    name: 'LV1',
    fakeKey: 'team_level1_count',
    num: userInfo.value?.topData?.find((item: any) => item.generation === 1)?.vaildUserCount || 0
  },
  {
    img: lv2,
    name: 'LV2',
    fakeKey: 'team_level2_count',

    num: userInfo.value?.topData?.find((item: any) => item.generation === 2)?.vaildUserCount || 0

  },
  {
    img: lv3,
    fakeKey: 'team_level3_count',
    name: 'LV3',
    num: userInfo.value?.topData?.find((item: any) => item.generation === 3)?.vaildUserCount || 0
  },
])
// --- 事件处理 ---
const handleHerf = (type: number) => {
  // 1: Withdraw, 2: Deposit
  if (type === 2) {
    router.push("/wallet/exchange/cashierCenter");
  } else {
    router.push("/wallet/exchange/cashierCenter-withdraw");
  }
};
const toReceive = () => {
  router.push("/receive");
}
const handleClickMenu = (item: any) => {
  if (item.type === 'logout') {
    handleLogout();
  } else if (item.url) {
    router.push(item.url);
  }
};

const handleLogout = () => {
  userStore.logout();
  router.push({ path: "/login" });
};

// --- 头像上传逻辑 (保持原有逻辑) ---
const handleClickUploadAvatar = () => {
  uploadPopShow.value = true;
  canUpdateAvatar.value = true;
};

const handleAfterRead = async (file: any, type: any) => {

};

const updateUserAvatar = async () => {
  if (!userAvatar.value) return;
  const res = await userUpdate({ avatar: userAvatar.value });
  if (res.code === 200) {
    showSuccessToast(t("Update successful"));
    userStore.info(); // 刷新用户信息
    uploadPopShow.value = false;
  }
};

onMounted(async () => {



  await userStore.info();
  // await userStore.fetchTeamInfoData();
  console.log(userInfo.value, 'userInfo')
});
</script>

<style scoped></style>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: 'My Profile',
    i18n: 'Wallet'
  },
}
</route>
