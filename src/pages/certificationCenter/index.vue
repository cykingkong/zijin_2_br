<template>
  <div class="certificationCenter pt-12">
    <!-- 认证中心 -->
    <div class="user-box px-12 pb-12">
      <div
        class="user-center-top px-8 w-full flex flex-items-center flex-justify-between"
      >
        <div class="text-white font-size-18">
          {{ t("CertificationCenter") }}
        </div>
      </div>
      <div class="flex mt-12">
        <div class="gn p-12 flex flex-items-center gap-4 rounded-40">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAOCSURBVHgB7ZlfbhMxEMY/b8IjKI9IlGp7g3IDOAHtCdqeoMkJSE+wKRyA3oBygvYGcANWtLyvxCtdM5MQCTVjr72x3aX4J7WV6oz/jMff2BMgk8lkMpnM/4pCD16e62/0p8SwaH622GtmqvExKuDJy0ofY3iLZybPgCk88XYAWbzDQNEFTieVnvjYeDlgwLu/xjsK/CJgwLu/xjcKxq4fNO6+xmWr8VmyKRTeksweuNjQTrymX0de/cs2yyggJZzDAecsYFL+ESlvPVP1tjYl7dpdAf78/d2rb07VntS/xcY5IzgdAcvuXxgX72lD/2t0i3Ohq/JPX/CwcdYCNw0wnP2RxllIGzqPC/rTuPZls3HVgk4HpNj9NQ8RBd0RkGj316SOAqsDUu7+mtRRYI+AxLu/JmUUGNPg0tsFPgpNDVldGswmtNMHnjYymnK8FEmrfhofG9Xi7PtMzSUTswOG+eLri/FeIB6Bf+DO74tRC0QHaNIVPDJa4Fr6v+iA25m6pnMzwyOBNYDXJLbZDHcqvVCkoobmmkLlGr1mJIpV7/4U9acNR9YmgKupdLDzXl+plbpu0LZ49WOmvsIT0piLjVcc3RNupuoEnryo9H5R4IvUpsmht1P1xmbfeRMc3+EQBk2ggT89r3SJB4LH5jkYmuuxRqdDOx3Atyx6vrIXpdxbjmkCvmWoEPCYTwpcQQ79mufscvN0eg1yR3TVPJTa6AztPx2hQmJoTL6klVIbzfXEZfGMc0nMmhk0jnc/6GTlsh0eS75xWhVfwqsmSGq6MDw62Ovz3XN9hMiQo09pkXOprUvxJbzL4uTdqVZyuqJUtGBVRiS4b3L0QmpjxfddPOP/vQCsmWESKzOEUHyJXg5InRlCKb5ELwcsR02YGUIpvkRvBzApMkNIxZfYygFMzMwQWvEltnYAEyMzxFB8iSAOYEJmhliKLxHMAaEyQ0zFlwjmACZEZoip+IZ5hWe30lMqR4uLpQLLXP/CnlQP0CPUsUVvo19EorOatLnLfHTEIxJr8cu+ERFbNckVl6rONgTVgPvYqkmOBFV8iagRwJSU0u5WNTvft0FwxZeIGgGMLTPYiKH4EtEdwPh+zxDiju88FhLSkRmWxFR8cTwkxpYZYiu+RJIj8DeWzBBd8SWSRwAjZIYkii+RPAKY+5khleIPDn4z0M8cmUwmk8lkMg/Ab/q/GCPKnh+uAAAAAElFTkSuQmCC"
            alt=""
            class="w-20 h-20"
          />
          <div class="t font-size-14">{{ t("CheckCurrentFeatures") }}</div>
        </div>
      </div>
    </div>
    <div class="tab-box flex px-12 gap-12">
      <div
        class="tab-item px-18 h-40px rounded-40 flex flex-items-center flex-justify-center gap-12 font-size-14"
        v-for="(item, index) in tabList"
        :key="index"
        :class="{ active: tabAcitve === index, t1: index == 0 }"
        @click="changeTab(index)"
      >
        <img src="@/assets/image/icon-success.png" alt="" class="w-20 h-20" />
        {{ item }}
      </div>
    </div>
    <div
      class="tab-pan px-20 pt-24 pb-12 flex flex-col gap-12 line-height-28"
      v-if="tabAcitve == 0"
    >
      <div class="title color-gray-400 font-size-18">{{ t("Require") }}</div>
      <div class="line flex gap-4 flex-items-center font-size-16">
        <van-icon name="user-o" />
        {{ t("Occupation") }}
      </div>
      <div class="line flex gap-4 flex-items-center font-size-16">
        <van-icon name="credit-pay" />
        {{ t("IDCard") }}
      </div>
      <div class="title color-gray-400">
        {{ t("Features and Limitations") }}
      </div>
      <div class="t flex flex-items-center gap-4 font-size-16">
        <van-icon name="underway-o" /> {{ t("Review time: 3 days") }}
      </div>
      <van-button
        type="primary"
        block
        @click="toKyc"
        v-if="userInfo.kycStatus == 0"
        >{{ t("Certification") }}</van-button
      >
    </div>

    <div
      class="fixed fixed-status"
      :class="{
        status0: userInfo.kycStatus == 0,
        status1: userInfo.kycStatus == 1,
        status2: userInfo.kycStatus == 2,
      }"
    >
      {{ kycEnum[userInfo.kycStatus] }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";
import { useUserStore } from "@/stores";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const kycEnum = {
  "0": t("Unverified"), // 未认证
  "1": t("Verifying"), // 验证中
  "2": t("Verified"), // 已验证
};
const tabList = [t("GeneralCertification")];
const tabAcitve = ref(0);
const changeTab = (index: number) => {
  tabAcitve.value = index;
};
const router = useRouter();
const toKyc = () => {
  router.push({ path: "/profile/authentication" });
};
</script>
<route lang="json5">
    {
      name: 'certificationCenter',
      path: '/certificationCenter', // 添加静态路径段明确层级
      meta: {
        title: '认证中心',
      }
    }
  </route>
<style lang="less" scoped>
.gn {
}

.tab-item {
  background-color: #1a2136;
}

.active {
  background: var(--btn-bg);
}

.fixed-status {
  width: 80px;
  border-radius: 40px 0 0 40px;
  height: 40px;
  right: 0%;
  top: 25%;
  text-align: center;
  font-size: 14px;
  padding-left: 6px;
  line-height: 40px;
}

.status0 {
  background: #ff4e4e;
}

.status1 {
  background: #ffa800;
}

.status2 {
  background: #00c98c;
}
</style>
