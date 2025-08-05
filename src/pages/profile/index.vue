<script setup lang="ts">
import type { PickerColumn } from "vant";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { languageColumns, locale } from "@/utils/i18n";
import { useUserStore } from "@/stores";
import defaultAvatar from "@/assets/images/default-avatar.svg";
import { clearToken, isLogin } from "@/utils/auth";
import { getKfUrl } from "@/api/user";

import UserInfo from "../../components/user-info.vue";
import cell1 from '@/assets/cell/cell1.svg';
import cell2 from '@/assets/cell/cell2.svg';
import cell3 from '@/assets/cell/cell3.svg';
import cell4 from '@/assets/cell/cell4.svg';
import cell5 from '@/assets/cell/cell5.svg';
import cell6 from '@/assets/cell/cell6.svg';
import cell7 from '@/assets/cell/cell7.svg';
import right from '@/assets/icon/right.svg'

const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
// watch(() => isLogin(), (val) => {
//   if (!val) {
//     router.push({ path: '/login' })
//   }
// }, {
//   immediate: true
// })
const { t } = useI18n();
const showLanguagePicker = ref(false);
const languageValues = ref<Array<string>>([locale.value]);
const language = computed(
  () => languageColumns.find((l) => l.value === locale.value).text
);

const languageColumnsForPicker = computed(() => {
  const mode = import.meta.env.MODE;
  if (mode === "development") {
    return languageColumns;
  } else {
    return languageColumns.filter((item) => item.value !== "zh-CN");
  }
});

const kfUrl = ref("");
const toKfUrl = async () => {
  const { data, code } = await getKfUrl({
    userId: userInfo.value.userId ? userInfo.value.userId : null,
  });
  if (code == 200) {
    kfUrl.value = data.kfUrl || "";
    // 需要延迟一下，不然safari 会拦截
    setTimeout(() => {
      window.location.href = data.kfUrl;
    }, 40);
  }
};

const cellList = [
  {
    label: 'Account Details',
    cell: [
      {
        text: 'Identify Verification',
        tips: 'Your verification status',
        icon: cell1,
      },
      {
        text: 'Bank Account',
        tips: 'Manage your bank account',
        icon: cell2,
        url: '/profile/bankAccount'
      },

    ]
  },
  {
    label: 'Settings',
    cell: [
      {
        text: 'Push Notifications',
        tips: 'Notification preferences',
        icon: cell3,
      },
      {
        text: 'Languange',
        tips: 'English (USA)',
        icon: cell4,
      },
    ]
  },
  {
    label: 'Others',
    cell: [
      {
        text: 'Help Center',
        tips: 'Get supports',
        icon: cell5,
      },
      {
        text: 'Terms & Conditions',
        tips: 'Our terms & conditions',
        icon: cell6,
      },
      {
        text: 'Privacy Policy',
        tips: 'Our privacy policy',
        icon: cell7,
      },
    ]
  },

]
const handleClickCell = (item: any) => {

  if (item && item.url) {
    router.push(item.url)
  }

};
const handleClickGrid = (index: any) => {
  router.push(gridList[index].url);
};
function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string;
  showLanguagePicker.value = false;
}
const handleLogout = () => {
  // clearToken()
  userStore.logout();
  router.push({ path: "/login" });
};
onMounted(async () => {
  await userStore.getInfo();
});
</script>

<template>
  <div class="myself-index">
    <!-- <VanNavBar title="" :fixed="true" clickable placeholder :left-arrow="false" @click-right="toKfUrl">
      <template #right>
        <van-icon name="service-o" class="icon" />
      </template>
</VanNavBar> -->
    <div class="h-265px w-full top-info">
      <div class="w-full h-56px mb-4px flex items-center justify-between px-24px">
        <div></div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M13.26 3.60022L5.05 12.2902C4.74 12.6202 4.44 13.2702 4.38 13.7202L4.01 16.9602C3.88 18.1302 4.72 18.9302 5.88 18.7302L9.1 18.1802C9.55 18.1002 10.18 17.7702 10.49 17.4302L18.7 8.74022C20.12 7.24022 20.76 5.53022 18.55 3.44022C16.35 1.37022 14.68 2.10022 13.26 3.60022Z"
            stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M11.89 5.0498C12.32 7.8098 14.56 9.9198 17.34 10.1998" stroke="white" stroke-width="1.5"
            stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3 22H21" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </div>
      <div class="info flex flex-col items-center justify-center">
        <div class="mid w-88 h-88 rounded-full overflow-hidden bg-#fff"></div>
        <div class="id text-20px text-#fff mt-16px">UID:{{ userInfo.userId }}</div>
        <div class="name text-14px text-#B59CFA mt-16px ">{{ userInfo.username }}</div>
      </div>
    </div>
    <div class="setting-list p-24px">
      <div class="setting-box" v-for="(item, index) in cellList" :key="index">
        <div class="setting-label mb-16px text-#0F172A font-700 lett">{{ item.label }}</div>
        <div
          class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between mb-16px"
          v-for="(cell, k) in item.cell" :key="k" @click="handleClickCell(cell)">
          <div class="left flex items-center h-40 gap-12px">
            <img :src="cell.icon" class="w-40 h-40 flex-shrink-0 block" alt="">
            <div class="info h-full flex flex-col justify-between">
              <div class="t">{{ cell.text }}</div>
              <div class="t2 text-#64748B text-10px">{{ cell.tips }}</div>
            </div>
          </div>
          <div class="r flex items-center">
            <img :src="right" alt="" class="block w-20 h-20">

          </div>
        </div>
      </div>
    </div>
    <!-- <section class="myself flex flex-col">
      <UserInfo :userInfo="userInfo" />
      <van-cell-group :title="t('profile.Quick Access')" />
      <van-grid :border="false" center>
        <van-grid-item v-for="(i, k) in gridList" direction="horizontal" :key="k" @click="handleClickGrid(k)">
          <div class="items-center flex-1">
            <img :src="i.icon" class="w-48 h-48 flex-shrink-0 block mx-auto" />
            <div class="text-12 mt-8 text-align-center max-w-103px c">
              {{ t(i.i18n) }}
            </div>
          </div>
        </van-grid-item>
      </van-grid>

      <van-cell-group :title="t('profile.common')">
        <van-cell is-link :title="t(item.i18n)" @click="handleClickCell(k)" v-for="(item, k) in cellList" :key="k">
          <template #icon>
            <img :src="item.icon" class="w20 h20 mr-8 mt-2" />
          </template>
        </van-cell>
      </van-cell-group>

      <div class="btn-box mt-24 w-full">
        <van-button square type="primary" class="mt-12 w-full" @click="handleLogout">
          {{ t("profile.logout") }}
        </van-button>
        <div class="pt-24 text-align-center text-gray-400 text-12">v1.0.12</div>
      </div>
    </section> -->
    <!-- <section class="unLogin px-12" >
      <div class="flex flex-col items-center">
        <span class="text-12 mt-8">您还未登录</span>
      </div>
      <div class="btn-box mt-24 w-full">
        <van-button square type="primary" class="mt-12 w-full" @click="router.push('/login')">
          去登录
        </van-button>
      </div>
    </section> -->

  </div>
</template>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: '个人中心',
    i18n: 'menus.profile'
  },
}
</route>

<style lang="less" scoped>
.icon {
  color: var(--van-text);
}

.top-info {
  background: url('../../assets/portfolio-bg.jpg') no-repeat;
  background-size: cover;

  background-position: center;
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
</style>
