<template>
  <div class="wallet">
    <div class="h-265px w-full top-info">
      <div class="w-full h-56px mb-4px"></div>
      <div class="info-box px-24px flex flex-col gap-4px h-102px">
        <div class="t1 text-#B59CFA text-16px">{{ t("Balance") }}</div>
        <div class="t1 text-#fff text-34px line-height-140%">
          MX$ {{ addCommasToNumber(userInfo.user_balance) }}
        </div>
      </div>
      <div class="btn-box w-full flex gap-10px px-24px mt-33px">
        <div
          class="rounded-12px border-#fff border-1px border-solid h-36px flex-1 flex items-center gap-12px justify-center text-#fff text-16px"
          @click="handleClickBtn(1)"
        >
          <svg
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M8.5 1.8335C5.09424 1.8335 2.33333 4.59441 2.33333 8.00016C2.33333 11.4059 5.09424 14.1668 8.5 14.1668C11.9058 14.1668 14.6667 11.4059 14.6667 8.00016C14.6667 4.59441 11.9058 1.8335 8.5 1.8335ZM1.33333 8.00016C1.33333 4.04212 4.54196 0.833496 8.5 0.833496C12.458 0.833496 15.6667 4.04212 15.6667 8.00016C15.6667 11.9582 12.458 15.1668 8.5 15.1668C4.54196 15.1668 1.33333 11.9582 1.33333 8.00016ZM6.14645 6.97994L8.14645 4.97994C8.34171 4.78468 8.65829 4.78468 8.85355 4.97994L10.8536 6.97994C11.0488 7.1752 11.0488 7.49179 10.8536 7.68705C10.6583 7.88231 10.3417 7.88231 10.1464 7.68705L9 6.5406V10.6668C9 10.943 8.77614 11.1668 8.5 11.1668C8.22386 11.1668 8 10.943 8 10.6668V6.5406L6.85355 7.68705C6.65829 7.88231 6.34171 7.88231 6.14645 7.68705C5.95118 7.49179 5.95118 7.1752 6.14645 6.97994Z"
              fill="white"
            />
          </svg>
          <!-- 提现 -->
          {{ t("Withdraw") }}
        </div>
        <div
          class="rounded-12px border-#fff border-1px border-solid h-36px flex-1 flex items-center gap-12px justify-center text-#fff text-16px"
          @click="handleClickBtn(2)"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_226_2318)">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8 1.8335C4.59424 1.8335 1.83333 4.59441 1.83333 8.00016C1.83333 11.4059 4.59424 14.1668 8 14.1668C11.4058 14.1668 14.1667 11.4059 14.1667 8.00016C14.1667 4.59441 11.4058 1.8335 8 1.8335ZM0.833328 8.00016C0.833328 4.04212 4.04195 0.833496 8 0.833496C11.958 0.833496 15.1667 4.04212 15.1667 8.00016C15.1667 11.9582 11.958 15.1668 8 15.1668C4.04195 15.1668 0.833328 11.9582 0.833328 8.00016ZM8 4.8335C8.27614 4.8335 8.5 5.05735 8.5 5.3335V9.45972L9.64644 8.31328C9.8417 8.11801 10.1583 8.11801 10.3535 8.31328C10.5488 8.50854 10.5488 8.82512 10.3535 9.02038L8.35355 11.0204C8.15829 11.2156 7.8417 11.2156 7.64644 11.0204L5.64644 9.02038C5.45118 8.82512 5.45118 8.50854 5.64644 8.31328C5.8417 8.11801 6.15829 8.11801 6.35355 8.31328L7.5 9.45972V5.3335C7.5 5.05735 7.72385 4.8335 8 4.8335Z"
                fill="white"
              />
            </g>
            <defs>
              <clipPath id="clip0_226_2318">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <!-- 充值 -->
          {{ t("Deposit") }}
        </div>
      </div>
    </div>
    <div class="list w-full px-14px">
      <div class="list-title flex items-center h-40px justify-between">
        <div class="text-#0F172A text-16px font-700">
          {{ t("Transactions") }}
        </div>
        <div class="text-#6B39F4 text-16px" @click="reload">
          {{ t("Reload") }}
        </div>
      </div>
      <div class="list-content">
        <div
          class="list-items mb-24"
          v-for="(item, index) in list"
          :key="index"
        >
          <div class="item-time text-#64748B text-14px font-600">
            {{ item.date }}
          </div>
          <div
            class="item mt-12 w-full rounded-12px border-1px border-solid border-#E2E8F0 min-h-78px flex items-center justify-between px-16px"
            v-for="(el, k) in item.transactions"
            :key="k"
            :item="el"
          >
            <div
              class="left h-46px flex items-center gap-16px w-220px flex-shrink-0"
            >
              <div
                class="img rounded-full w-40px h-40px overflow-hidden flex items-center justify-center bg-#F8F5FF"
              >
                <!-- in-Svg -->
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  :class="el.type"
                  v-if="el.type == 'income'"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M21.25 12C21.25 17.1086 17.1086 21.25 12 21.25C6.89137 21.25 2.75 17.1086 2.75 12C2.75 6.89137 6.89137 2.75 12 2.75C12.4142 2.75 12.75 2.41421 12.75 2C12.75 1.58579 12.4142 1.25 12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 11.5858 22.4142 11.25 22 11.25C21.5858 11.25 21.25 11.5858 21.25 12Z"
                    fill="#06cda5"
                  />
                  <path
                    d="M21.5303 3.53033C21.8232 3.23744 21.8232 2.76256 21.5303 2.46967C21.2374 2.17678 20.7626 2.17678 20.4697 2.46967L12.75 10.1893V6.65625C12.75 6.24204 12.4142 5.90625 12 5.90625C11.5858 5.90625 11.25 6.24204 11.25 6.65625V12C11.25 12.4142 11.5858 12.75 12 12.75H17.3438C17.758 12.75 18.0938 12.4142 18.0938 12C18.0938 11.5858 17.758 11.25 17.3438 11.25H13.8107L21.5303 3.53033Z"
                    fill="#06cda5"
                  />
                </svg>

                <!-- out-Svg -->
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  :class="el.type"
                  v-if="el.type == 'expend'"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.25 11C20.25 16.1086 16.1086 20.25 11 20.25C5.89137 20.25 1.75 16.1086 1.75 11C1.75 5.89137 5.89137 1.75 11 1.75C11.4142 1.75 11.75 1.41421 11.75 1C11.75 0.585787 11.4142 0.25 11 0.25C5.06294 0.25 0.25 5.06294 0.25 11C0.25 16.9371 5.06294 21.75 11 21.75C16.9371 21.75 21.75 16.9371 21.75 11C21.75 10.5858 21.4142 10.25 21 10.25C20.5858 10.25 20.25 10.5858 20.25 11Z"
                    fill="#f43368"
                    :class="el.type"
                  />
                  <path
                    d="M11.4697 9.46967C11.1768 9.76256 11.1768 10.2374 11.4697 10.5303C11.7626 10.8232 12.2374 10.8232 12.5303 10.5303L20.25 2.81066V6.34375C20.25 6.75796 20.5858 7.09375 21 7.09375C21.4142 7.09375 21.75 6.75796 21.75 6.34375V1C21.75 0.585787 21.4142 0.25 21 0.25H15.6562C15.242 0.25 14.9062 0.585787 14.9062 1C14.9062 1.41421 15.242 1.75 15.6562 1.75H19.1893L11.4697 9.46967Z"
                    fill="#f43368"
                    :class="el.type"
                  />
                </svg>
              </div>
              <div class="info h-46px flex flex-col justify-between">
                <div class="name text-#0F172A text-14px font-bold">
                  {{ el.log_type }}
                </div>
                <div class="time text-#64748B text-12px">{{ el.time }}</div>
              </div>
            </div>

            <div
              class="right h-46px text-right flex flex-col justify-between gap-4px w-full text-right"
            >
              <div class="unit">{{ el.type == "income" ? "" : "-" }} MX$</div>
              {{ el.amount }}
            </div>
          </div>
        </div>
      </div>
      <empty v-if="list.length == 0" :noTips="true" />
      <LoadMore :status="listStatus" @load-more="loadMore"></LoadMore>
    </div>
  </div>
</template>
<script setup lang="ts">
import { addCommasToNumber } from "@/utils/tool";
import { ref, reactive } from "vue";
import item from "@/components/item.vue";
import { walletLogs } from "@/api/user";
const { proxy } = getCurrentInstance()!;
import { useUserStore } from "@/stores";
const { t } = useI18n();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const listStatus = ref(1);
const list = ref([]);
const listSkeleton = ref();
const router = useRouter();
const page = reactive({
  page: 1,
  size: 10,
});
const handleClickBtn = (type: number) => {
  if (type == 2) {
    router.push("/wallet/exchange/channel-out");
  } else {
    router.push("/wallet/exchange/withdraw-bank");
  }
};

const getWalletLogs = async () => {
  listStatus.value = 1;

  const { data, code } = await walletLogs({
    ...page,
  });
  if (code == 200) {
    if (!data.list) {
      listStatus.value = 3;
      listSkeleton.value = false;
      return;
    }

    if (page.pageIndex == 1) {
      list.value = data.list || [];
    } else {
      let result = data.list;
      list.value = list.value.concat(result);
    }

    // 根据新的分页格式判断是否还有更多数据
    if (!data.pagination.has_more) {
      listStatus.value = 3;
      listSkeleton.value = false;
      return;
    }

    listSkeleton.value = false;
    listStatus.value = 2;
  }
};
const reload = () => {
  page.page = 1;
  list.value = [];
  getWalletLogs();
};
const loadMore = () => {
  page.page++;
  getWalletLogs();
};
onMounted(async () => {
  await userStore.info();

  getWalletLogs();
});
</script>
<style lang="less" scoped>
.top-info {
  background: url("@/assets/portfolio-bg.jpg") no-repeat;
  background-size: cover;
  background-position: center;
}

.expend {
  path {
    stroke: var(--down) !important;
  }
}

.income {
  path {
    stroke: var(--up) !important;
  }
}
</style>
<route lang="json5">
{
  name: 'wallet',
  meta: {
    title: 'wallet',
    i18n: 'menus.wallet'
  },
}
</route>