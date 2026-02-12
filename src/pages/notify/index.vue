<template>
  <div class="notify-content px-12 w-full pt-12">
    <div class="list mb-16 text-left">
      <div class="list-content min-h-400 relative">
        <div
          class="skeleton-list bg-[#fff] z-99 w-full h-full absolute top-0 left-0"
          v-if="notifySkeleton"
        >
          <div
            class="list-skeleton bg-coolgray skeleton-animation w-full h-80 rounded-[12px] mb-[12px]"
            v-for="i in 5"
            :key="i"
          ></div>
        </div>

        <div
          class="notify-item rounded-[12px] bg-[#F8F9FD] p-12 mb-12 text-[14px] text-[#0F172A]"
          v-for="(item, index) in notifyList"
          :key="index"
        >
          <div class="title text-[16px] font-medium flex justify-between gap-[40px]">
            <div class="li-title w-[80%]">
              {{ item?.title || item?.content || item?.message || "" }}
            </div>

            <div class="time flex-shrink-0">{{ item.time }}</div>
          </div>
          <div class="desc text-[#6B7280] mt-12">
            {{ item?.content || item?.message || "" }}
          </div>
        </div>

        <empty
          v-if="!notifySkeleton && notifyList.length === 0"
          :no-tips="true"
        />
        <LoadMore
          v-if="!notifySkeleton"
          :status="listStatus"
          @load-more="loadMore"
        />
      </div>
    </div>
  </div>

  <!-- 纯提示文案，保留原来的 i18n 文本 -->
  <!-- <div class="w-full text-center mt-8 text-#94A3B8">{{ t("No Notify") }}</div> -->
</template>
<script setup lang="ts">
import { notify_list } from "@/api/user";
const page = reactive({
  page: 1,
  size: 10,
});
const notifyList = ref<any[]>([]);
const listStatus = ref(1); // 1-加载中 2-成功 3-已无更多
const notifySkeleton = ref(false);

const getNotifyList = async () => {
  if (page.page == 1) {
    notifySkeleton.value = true;
  }
  const { code, data } = await notify_list({
    ...page,
  });
  if (code == 200) {
    if (notifySkeleton.value) {
      setTimeout(() => {
        notifySkeleton.value = false;
      }, 3000);
    }
    if (!data?.list) {
      listStatus.value = 3;
      return;
    }
    if (page.page == 1) {
      notifyList.value = data.list || [];
    } else {
      const result = data.list || [];
      notifyList.value = notifyList.value.concat(result);
    }

    if (!data?.pagination?.has_more) {
      listStatus.value = 3;
      return;
    }
    listStatus.value = 2;
  }
};
const { t } = useI18n();
onMounted(() => {
  getNotifyList();
});

const loadMore = () => {
  page.page++;
  getNotifyList();
};
</script>

<style lang="less" scoped>
.li-title {
  word-break: break-all;
}
.skeleton-animation {
  animation: pulseskeleton 1s ease-in infinite;
}

@keyframes pulseskeleton {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.7;
  }
}
</style>
<route lang="json5">
    {
      name: 'Notify',
      meta: {
        title: 'Notify',
        i18n: 'Notificar'
      },
    }
</route>
