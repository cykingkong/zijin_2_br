<script setup lang="ts">
import type { PickerColumn } from "vant";
import router from "@/router";
import { useI18n } from "vue-i18n";
import { languageColumns, locale } from "@/utils/i18n";
import { useUserStore } from "@/stores";
import defaultAvatar from "@/assets/images/default-avatar.svg";
import { clearToken, isLogin } from "@/utils/auth";
import { getKfUrl } from "@/api/user";
import {loanIndex} from "@/api/ipo";
import cell1 from "@/assets/cell/cell1.svg";
import cell2 from "@/assets/cell/cell2.svg";
import cell3 from "@/assets/cell/cell3.svg";
import cell4 from "@/assets/cell/cell4.svg";
import cell5 from "@/assets/cell/cell5.svg";
import cell6 from "@/assets/cell/cell6.svg";
import cell7 from "@/assets/cell/cell7.svg";
import right from "@/assets/icon/right.svg";

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
    label: t("Account Details"),
    cell: [
      {
        text: t("Identify Verification"),
        tips: "",
        iconType: "img",
        icon: cell1,
        url: "/register?step=3",
        type: "Identify",
      },
      {
        text: t("Bank Account"),
        tips: t("Manage your bank account"),
        icon: cell2,
        iconType: "img",
        url: "/profile/bankAccount",
      },
      {
        text: t("Bind Phone"),
        tips: t("Manage your phone number"),
        iconType: "svg",
        type: "phone",
        url: "profile/bindVerify/bindVerify",
      },
      {
        text: t("Stock List"),
        tips: t("Manage your stock list"),
        iconType: "svg",
        type: "stock",
        url: "/quotes/stockOrderList",
      },
      // {
      //   text: t("Credit Loan"),
      //   tips: t("Manage your credit loan"),
      //   iconType: "svg",
      //   type: "creditLoan",
      //   url: "/creditLoan",
      // },
    ],
  },
  {
    label: t("Settings"),
    cell: [
      {
        text: t("Push Notifications"),
        tips: t("Notification preferences"),
        url: "/notify",
        iconType: "img",
        type: "notify",
        icon: cell3,
      },
      {
        text: t("AboutUs"),
        tips: t("AboutUs"),
        type: "aboutUs",
        iconType: "svg",
        url: "/aboutUs",
        icon: cell3,
      },
      {
        text: t("Languange"),
        tips: toUpperCase(locale.value),
        iconType: "img",
        icon: cell4,
        url: "/profile/languange",
      },
    ],
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
];

const handleClickCell = async (item: any) => {
  if (item && item.url) {
    if (item.type == "Identify" && [1, 2].includes(userInfo.value.kyc_status)) {
      return;
    }
    if (item.type == "phone" && userInfo.value.phone) {
      return;
    }
    if(item.type == "creditLoan"){
      const {data,code } = await loanIndex({})
      if(code == 200){
        // 如果data 为空对象
        if(JSON.stringify(data) == "{}"){
          router.push('/creditLoan/creditPage');
        }else {
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
      <div
        class="w-full h-56px mb-4px flex items-center justify-between px-24px"
      >
        <div></div>
        <svg
          @click="handleLogout"
          t="1757512018074"
          class="icon w-20 h-20"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5907"

        >
          <path
            d="M533.333333 64a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H170.666667v725.333334h362.666666a21.333333 21.333333 0 0 1 21.333334 21.333333v42.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H170.666667a85.333333 85.333333 0 0 1-85.226667-81.066667L85.333333 874.666667V149.333333a85.333333 85.333333 0 0 1 81.066667-85.226666L170.666667 64h362.666666z m194.581334 219.584l183.168 183.168a64 64 0 0 1 2.88 87.424l-2.88 3.072-183.168 183.168a21.333333 21.333333 0 0 1-30.165334 0l-30.165333-30.165333a21.333333 21.333333 0 0 1 0-30.165334L792.96 554.666667H362.666667a21.333333 21.333333 0 0 1-21.333334-21.333334v-42.666666a21.333333 21.333333 0 0 1 21.333334-21.333334h430.293333l-125.376-125.418666a21.333333 21.333333 0 0 1 0-30.165334l30.165333-30.165333a21.333333 21.333333 0 0 1 30.165334 0z"
            fill="#FFF"
            p-id="5908"
          ></path>
        </svg>
      </div>
      <div class="info flex flex-col items-center justify-center">
        <div
          class="mid w-88 h-88 rounded-full overflow-hidden flex items-center justify-center p-12 bg-#fff"
        >
          <img
            src="@/assets/image/icon.svg"
            alt=""
            class="w-full h-full block"
          />
        </div>
        <div class="id text-20px text-#fff mt-16px">
          UID:{{ userInfo.user_id }}
        </div>
            <div class="credit_score_content mt-8px text-#FFA500 text-18px">
          CRS : {{ userInfo.credit_score }}
        </div>
        <div class="name text-14px text-#B59CFA mt-8px">
          {{ userInfo.account }}
        </div>
      </div>
    </div>
    <div class="setting-list p-24px">
      <div class="setting-box" v-for="(item, index) in cellList" :key="index">
        <div class="setting-label mb-16px text-#0F172A font-700 lett">
          {{ item.label }}
        </div>
        <div
          class="cell-item px-12px w-full rounded-12px border-1px border-#E2E8F0 border-solid h-72px flex items-center justify-between mb-16px"
          v-for="(cell, k) in item.cell"
          :key="k"
          @click="handleClickCell(cell)"
        >
          <div class="left flex items-center h-40 gap-12px">
            <img
              :src="cell.icon"
              class="w-40 h-40 flex-shrink-0 block"
              alt=""
              v-if="cell.iconType == 'img'"
            />

            <div
              class="svg flex items-center justify-center w-40 h-40 bg-#F8F9FD rounded-full"
              v-if="cell.iconType == 'svg'"
            >
              <svg
               class="w-24 h-24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                v-if="cell.type == 'aboutUs'"
              >
                <path
                  d="M19.7276 12.8181C19.6271 12.4163 19.2199 12.172 18.8181 12.2724L14.8181 13.2724C14.4163 13.3729 14.1719 13.7801 14.2724 14.1819C14.3729 14.5838 14.7801 14.8281 15.1819 14.7276L19.1819 13.7276C19.5837 13.6272 19.8281 13.22 19.7276 12.8181Z"
                  fill="#94A3B8"
                />
                <path
                  d="M19.75 5.50004C19.75 5.08582 19.4142 4.75004 19 4.75004C18.5858 4.75004 18.25 5.08582 18.25 5.50004V8.93863L17.5007 8.58269L17.4919 8.57825C17.4429 8.55319 17.2363 8.4476 17 8.4476C16.7637 8.4476 16.5571 8.55319 16.5081 8.57825L16.4993 8.58269L15.75 8.93863V6.95006C15.75 6.53584 15.4142 6.20006 15 6.20006C14.5858 6.20006 14.25 6.53584 14.25 6.95006L14.25 9.53724C14.2498 9.64846 14.2496 9.80702 14.2709 9.94314C14.2969 10.1096 14.3824 10.4308 14.7151 10.6261C15.0355 10.8143 15.3488 10.7444 15.4978 10.6981C15.6276 10.6577 15.77 10.5899 15.8762 10.5393L17 10.0055L18.1238 10.5393C18.23 10.5899 18.3724 10.6577 18.5022 10.6981C18.6512 10.7444 18.9645 10.8143 19.2849 10.6261C19.6176 10.4308 19.7031 10.1096 19.7291 9.94314C19.7504 9.80702 19.7502 9.64846 19.75 9.53724L19.75 5.50004Z"
                  fill="#94A3B8"
                />
                <path
                  d="M4.27239 8.81813C4.37285 8.41629 4.78006 8.17197 5.1819 8.27243L9.1819 9.27243C9.58375 9.37289 9.82807 9.78009 9.72761 10.1819C9.62715 10.5838 9.21994 10.8281 8.8181 10.7276L4.8181 9.72764C4.41625 9.62718 4.17193 9.21998 4.27239 8.81813Z"
                  fill="#94A3B8"
                />
                <path
                  d="M5.1819 12.2724C4.78006 12.172 4.37285 12.4163 4.27239 12.8181C4.17193 13.22 4.41625 13.6272 4.8181 13.7276L8.8181 14.7276C9.21994 14.8281 9.62715 14.5838 9.72761 14.1819C9.82807 13.7801 9.58375 13.3729 9.1819 13.2724L5.1819 12.2724Z"
                  fill="#94A3B8"
                />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M22.75 4.93323C22.75 3.46992 21.5847 2.21498 20.0559 2.26824C18.9175 2.30789 17.4296 2.4263 16.2849 2.76899C15.2899 3.06687 14.1706 3.64872 13.2982 4.15366C12.4801 4.62712 11.4617 4.65074 10.6328 4.21248C9.63736 3.68609 8.32766 3.06215 7.19136 2.7623C6.23055 2.50876 5.01517 2.38698 4.02841 2.32634C2.47017 2.23057 1.25 3.49868 1.25 4.99784V16.1436C1.25 17.6798 2.49378 18.8792 3.96804 18.9714C4.9268 19.0314 6.00566 19.1467 6.80864 19.3586C7.8012 19.6205 9.0286 20.2029 10.0196 20.7311C11.2529 21.3885 12.7471 21.3885 13.9804 20.7311C14.9714 20.2029 16.1988 19.6205 17.1914 19.3586C17.9943 19.1467 19.0732 19.0314 20.032 18.9714C21.5062 18.8792 22.75 17.6798 22.75 16.1436V4.93323ZM20.1081 3.76733C20.7229 3.74591 21.25 4.25164 21.25 4.93323V16.1436C21.25 16.8294 20.6817 17.4278 19.9383 17.4743C18.9582 17.5356 17.7591 17.6574 16.8086 17.9082C15.6383 18.2171 14.2827 18.8701 13.2748 19.4074C13.1065 19.4971 12.9305 19.5678 12.75 19.6194V5.94207C13.2023 5.85153 13.6421 5.68771 14.0495 5.45191C14.9 4.95972 15.8949 4.45152 16.7151 4.20597C17.6643 3.92182 18.9892 3.8063 20.1081 3.76733ZM11.25 5.97501C10.795 5.90426 10.349 5.75918 9.93167 5.53851C8.95486 5.022 7.77076 4.46654 6.80864 4.21266C5.99643 3.99833 4.90238 3.88288 3.93639 3.82351C3.30243 3.78455 2.75 4.30065 2.75 4.99784V16.1436C2.75 16.8294 3.31831 17.4278 4.06168 17.4743C5.04176 17.5356 6.24092 17.6574 7.19136 17.9082C8.3617 18.2171 9.71727 18.8701 10.7252 19.4074C10.8935 19.4971 11.0695 19.5678 11.25 19.6194V5.97501Z"
                  fill="#94A3B8"
                />
              </svg>
              <svg
               class="w-24 h-24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                v-if="cell.type == 'phone'"
              >
                <path
                  d="M16 3H8C6.89543 3 6 3.89543 6 5V19C6 20.1046 6.89543 21 8 21H16C17.1046 21 18 20.1046 18 19V5C18 3.89543 17.1046 3 16 3Z"
                  stroke="#94A3B8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M12 17V17.01M11 4H13H11Z"
                  stroke="#94A3B8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <svg
              class="w-24 h-24"
                viewBox="0 0 25 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                v-if="cell.type == 'stock'"
              >
                <path
                  d="M3.10001 12H8.10001L12.1 20V4L16.1 12H21.1"
                  stroke="#94A3B8"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div class="info h-full flex flex-col justify-center gap-8">
              <div class="t">{{ cell.text }}</div>
              <div class="t2 text-#64748B text-10px" v-if="cell.tips">
                {{ cell.tips }}
              </div>
            </div>
          </div>
          <div class="r flex items-center gap-6">
            <svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-if="
                cell.type && cell.type == 'Identify' && userInfo.kyc_status == 2
              "
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.377516 3.08241C0 3.62028 0 5.21907 0 8.41666V9.99136C0 15.6294 4.23896 18.3655 6.89856 19.5273C7.62001 19.8424 7.98074 20 9 20C10.0193 20 10.38 19.8424 11.1014 19.5273C13.761 18.3655 18 15.6294 18 9.99136V8.41666C18 5.21907 18 3.62028 17.6225 3.08241C17.245 2.54454 15.7417 2.02996 12.7351 1.00079L12.1623 0.804717C10.595 0.268239 9.81139 0 9 0C8.18861 0 7.40498 0.268239 5.83772 0.804717L5.26491 1.00079C2.25832 2.02996 0.755031 2.54454 0.377516 3.08241ZM12.0595 8.49951C12.3353 8.19053 12.3085 7.71642 11.9995 7.44055C11.6905 7.16467 11.2164 7.19151 10.9405 7.50049L7.92857 10.8739L7.05945 9.90049C6.78358 9.59151 6.30947 9.56467 6.00049 9.84055C5.69151 10.1164 5.66467 10.5905 5.94055 10.8995L7.36912 12.4995C7.51141 12.6589 7.71492 12.75 7.92857 12.75C8.14222 12.75 8.34573 12.6589 8.48802 12.4995L12.0595 8.49951Z"
                fill="#06cda5"
              />
            </svg>
            <svg
              width="18"
              height="20"
              viewBox="0 0 18 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              v-if="cell.type && cell.type == 'phone' && userInfo.phone"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.377516 3.08241C0 3.62028 0 5.21907 0 8.41666V9.99136C0 15.6294 4.23896 18.3655 6.89856 19.5273C7.62001 19.8424 7.98074 20 9 20C10.0193 20 10.38 19.8424 11.1014 19.5273C13.761 18.3655 18 15.6294 18 9.99136V8.41666C18 5.21907 18 3.62028 17.6225 3.08241C17.245 2.54454 15.7417 2.02996 12.7351 1.00079L12.1623 0.804717C10.595 0.268239 9.81139 0 9 0C8.18861 0 7.40498 0.268239 5.83772 0.804717L5.26491 1.00079C2.25832 2.02996 0.755031 2.54454 0.377516 3.08241ZM12.0595 8.49951C12.3353 8.19053 12.3085 7.71642 11.9995 7.44055C11.6905 7.16467 11.2164 7.19151 10.9405 7.50049L7.92857 10.8739L7.05945 9.90049C6.78358 9.59151 6.30947 9.56467 6.00049 9.84055C5.69151 10.1164 5.66467 10.5905 5.94055 10.8995L7.36912 12.4995C7.51141 12.6589 7.71492 12.75 7.92857 12.75C8.14222 12.75 8.34573 12.6589 8.48802 12.4995L12.0595 8.49951Z"
                fill="#06cda5"
              />
            </svg>
            <div
              class="dot w-8 h-8 rounded-full bg-#F14437"
              v-if="userInfo.notify_start && cell.type == 'notify'"
            ></div>
            <img :src="right" alt="" class="block w-20 h-20" />
          </div>
        </div>
      </div>

      <van-button
        type="primary"
        block
        color="#6B39F4"
        class="mt-24px h-56px"
        @click="handleLogout"
        >{{ t("Logout") }}</van-button
      >
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
;
}

.top-info {
  background: url("../../assets/portfolio-bg.jpg") no-repeat;
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
