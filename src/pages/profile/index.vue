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
import grid1 from "@/assets/grid/grid1.png";
import grid2 from "@/assets/grid/grid2.png";
import grid3 from "@/assets/grid/grid3.png";
import grid4 from "@/assets/grid/grid4.png";
import grid5 from "@/assets/grid/grid5.png";
import icon1 from "@/assets/image/icon/icon1.png";
import icon2 from "@/assets/image/icon/icon2.png";
import icon3 from "@/assets/image/icon/icon3.png";
import icon4 from "@/assets/image/icon/icon4.png";
import icon5 from "@/assets/image/icon/icon5.png";
import icon6 from "@/assets/image/icon/icon6.png";
import icon7 from "@/assets/image/icon/icon7.png";

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

      window.location.href = data.kfUrl
    }, 40)
  }
};
const gridList = [
  {
    icon: grid1,
    text: "安全",
    i18n: "profile.safety",
    url: "/profile/safetyPage/safety",
  },
  {
    icon: grid2,
    text: "修改密码",
    i18n: "profile.changePassword",
    url: "/profile/changePassword/changePassword",
  },
  {
    icon: grid3,
    text: "账变记录",
    i18n: "profile.accountChange",
    url: "/quotes/accountChange?type=1",
  },
  // {
  //   icon: grid4,
  //   text: '邀请推广'
  // },
  {
    icon: grid5,
    text: "身份验证",
    i18n: "profile.certificationCenter",
    url: "/certificationCenter",
  },
];
const cellList = [
  {
    icon: icon1,
    text: "语言",
    i18n: "profile.language",
  },
  {
    icon: icon2,
    text: "身份认证",
    i18n: "profile.certificationCenter",
  },

  {
    icon: icon4,
    text: "划转",
    i18n: "profile.conversion",
  },
  {
    icon: icon5,
    text: "添加收款方式",
    i18n: "profile.paymentMethod",
  },
  {
    icon: icon5,
    text: "充值记录",
    i18n: "profile.rechargeRecord",
  },
  {
    icon: icon5,
    text: "提现记录",
    i18n: "profile.withdrawRecord",
  },
  {
    icon: icon5,
    text: "资产流转",
    i18n: "profile.assetsLog",
  },

  // {
  //   icon: icon7,
  //   text: "帮助中心",
  //   i18n: "profile.helpCenter",
  // },
  {
    icon: icon6,
    text: "关于我们",
    i18n: "profile.aboutUs",
  },
];
const handleClickCell = (index: any) => {
  console.log(index, "index");
  switch (index) {
    case 0:
      showLanguagePicker.value = true;
      break;
    case 1:
      router.push("/certificationCenter");
      break;
    case 2:
      router.push("/conversion"); // 划转
      break;
    case 3:
      router.push("/profile/payMentMethod/list");
      break;
    case 4:
      router.push("/deal/orderList?type=1");
      break;
    case 5:
      router.push("/deal/orderList?type=2");
      break;
    case 6:
      router.push("/quotes/accountChange?type=2");
      break;
    // case 7:
    //   router.push("/helpCenter");
    //   break;
    case 7:
      router.push("/aboutUs");

      break;
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
    <VanNavBar title="" :fixed="true" clickable placeholder :left-arrow="false" @click-right="toKfUrl">
      <template #right>
        <van-icon name="service-o" class="icon" />
      </template>
    </VanNavBar>

    <section class="myself flex flex-col">
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
        <div class="pt-24 text-align-center text-gray-400 text-12">
          v1.0.4
        </div>
      </div>
    </section>
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
    <van-popup v-model:show="showLanguagePicker" position="bottom">
      <van-picker v-model="languageValues" :columns="languageColumns" @confirm="onLanguageConfirm"
        @cancel="showLanguagePicker = false" />
    </van-popup>
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
