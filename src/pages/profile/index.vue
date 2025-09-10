<script setup lang="ts">
import type { PickerColumn } from "vant";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { languageColumns, locale } from "@/utils/i18n";
import { useUserStore } from "@/stores";
import defaultAvatar from "@/assets/images/default-avatar.svg";
import { clearToken, isLogin } from "@/utils/auth";
import { getKfUrl } from "@/api/user";


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
        iconType: 'img',
        icon: cell1,
        url: '/register?step=4'
      },
      {
        text: 'Bank Account',
        tips: 'Manage your bank account',
        icon: cell2,
        iconType: 'img',
        url: '/profile/bankAccount'
      },
      {
        text: 'Bind Phone',
        tips: 'Manage your phone number',
        iconType: 'svg',

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
        iconType: 'img',
        icon: cell3,
      },
      {
        text: 'Languange',
        tips: 'English (USA)',
        iconType: 'img',
        icon: cell4,
        url: '/profile/languange'

      },
    ]
  },
  // {
  //   label: 'Others',
  //   cell: [
  //     {
  //       text: 'Help Center',
  //       tips: 'Get supports',
  //       iconType: 'img',
  //       icon: cell5,
  //       url: '/helpCenter'

  //     },
  //     {
  //       text: 'Terms & Conditions',
  //       tips: 'Our terms & conditions',
  //       iconType: 'img',
  //       icon: cell6,
  //     },
  //     {
  //       text: 'Privacy Policy',
  //       tips: 'Our privacy policy',
  //       iconType: 'img',
  //       icon: cell7,
  //     },
  //   ]
  // },

]
const handleClickCell = (item: any) => {

  if (item && item.url) {
    if (item.text == 'Identify Verification' && userInfo.value.kyc_status == 2) {
      return
    }
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
        <svg @click="handleLogout" t="1757512018074" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="5907" width="20" height="20">
          <path
            d="M533.333333 64a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H170.666667v725.333334h362.666666a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H170.666667a85.333333 85.333333 0 0 1-85.226667-81.066667L85.333333 874.666667V149.333333a85.333333 85.333333 0 0 1 81.066667-85.226666L170.666667 64h362.666666z m194.581334 219.584l183.168 183.168a64 64 0 0 1 2.88 87.424l-2.88 3.072-183.168 183.168a21.333333 21.333333 0 0 1-30.165334 0l-30.165333-30.165333a21.333333 21.333333 0 0 1 0-30.165334L792.96 554.666667H362.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h430.293333l-125.376-125.418666a21.333333 21.333333 0 0 1 0-30.165334l30.165333-30.165333a21.333333 21.333333 0 0 1 30.165334 0z"
            fill="#FFF" p-id="5908"></path>
        </svg>
      </div>
      <div class="info flex flex-col items-center justify-center">
        <div class="mid w-88 h-88 rounded-full overflow-hidden flex items-center justify-center p-12 bg-#fff">
          <img src="@/assets/image/icon.svg" alt="" class="w-full h-full block">
        </div>
        <div class="id text-20px text-#fff mt-16px">UID:{{ userInfo.user_id }}</div>
        <div class="name text-14px text-#B59CFA mt-16px ">{{ userInfo.account }}</div>
      </div>
    </div>
    <div class="setting-list p-24px">
      <div class="setting-box" v-for="(item, index) in cellList" :key="index">
        <div class="setting-label mb-16px text-#0F172A font-700 lett">{{ item.label }}</div>
        <div
          class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between mb-16px"
          v-for="(cell, k) in item.cell" :key="k" @click="handleClickCell(cell)">
          <div class="left flex items-center h-40 gap-12px">
            <img :src="cell.icon" class="w-40 h-40 flex-shrink-0 block" alt="" v-if="cell.iconType == 'img'">
            <div class="svg flex items-center justify-center w-40 h-40 bg-#F8F9FD rounded-full"
              v-if="cell.iconType == 'svg'">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3Z"
                  stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 17V17.01M11 4H13H11Z" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>

            </div>

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

      <van-button type="primary" block color="#6B39F4" class="mt-24px h-56px" @click="handleLogout">{{
        '退出登录'
        }}</van-button>
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
