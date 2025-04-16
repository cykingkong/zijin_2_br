<script setup lang="ts">
import router from '@/router'
import { useUserStore } from '@/stores'
import defaultAvatar from '@/assets/images/default-avatar.svg'
import UserInfo from './components/user-info.vue'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)
const isLogin = computed(() => !!userInfo.value.uid)

function login() {
  if (isLogin.value)
    return

  router.push({ name: 'login', query: { redirect: 'profile' } })
}
</script>

<template>
  <div>
    <VanNavBar

    :title="''"
    :fixed="true"
    clickable placeholder
    :left-arrow="false"

  >
  <template #right>
    <van-icon name="service-o" class="icon"/>
  </template>
  </VanNavBar>  
  <section>
      <UserInfo></UserInfo>
  </section>
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
.icon{
  color:var(--van-text)
}
</style>