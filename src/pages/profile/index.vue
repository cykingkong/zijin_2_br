<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { useI18n } from 'vue-i18n'

import { userUpdate } from '@/api/user'
import { upload } from '@/api/tool'
import { useUserStore } from '@/stores'
import { formatRupiah } from '@/utils/tool'

import defaultAvatar from '@/assets/image/avatar.png'
import logout from '@/assets/tabbar/logout.png'
import pay from '@/assets/tabbar/pay.jpg'
import inviteFriends from '@/assets/tabbar/inviteFriends.png'
import lv1 from '@/assets/lv/lv1.png'
import lv2 from '@/assets/lv/lv2.png'
import lv3 from '@/assets/lv/lv3.png'
import lv4 from '@/assets/lv/lv4.png'
import lv5 from '@/assets/lv/lv5.png'
import lv6 from '@/assets/lv/lv6.png'
import lv7 from '@/assets/lv/lv7.png'
import lv8 from '@/assets/lv/lv8.png'

import walletLogs from '../wallet/walletLogs.vue'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()

const uploadPopShow = ref(false)
const canUpdateAvatar = ref(true)
const userAvatar = ref('')
const pictureList = ref<any[]>([])

const userInfo = computed(() => userStore.userInfo || {})
const userLevel = computed(() => Number(userInfo.value?.vip) || 1)

const imgEnum = {
  1: lv1,
  2: lv2,
  3: lv3,
  4: lv4,
  5: lv5,
  6: lv6,
  7: lv7,
  8: lv8,
} as const

const levelToneClassMap = {
  1: 'level-tone-1',
  2: 'level-tone-2',
  3: 'level-tone-3',
  4: 'level-tone-4',
  5: 'level-tone-5',
  6: 'level-tone-6',
  7: 'level-tone-7',
  8: 'level-tone-8',
} as const

const currentAvatar = computed(() =>
  userInfo.value?.avatar || imgEnum[userLevel.value as keyof typeof imgEnum] || defaultAvatar,
)

const levelToneClass = computed(() =>
  levelToneClassMap[userLevel.value as keyof typeof levelToneClassMap] || 'level-tone-1',
)

const walletStats = computed(() => [
  {
    label: t('Today Income'),
    value: formatRupiah(userInfo.value?.today_income || 0),
  },
  {
    label: t('Total Income'),
    value: formatRupiah(userInfo.value?.total_income || 0),
  },
])

const menuList = computed(() => [
  {
    text: t('Bank Account'),
    img: pay,
    type: 'link',
    url: '/profile/bankAccount/addBank',
  },
  {
    text: t('inviteFriends'),
    img: inviteFriends,
    type: 'link',
    url: '/inviteFriends',
  },
  {
    text: t('Logout'),
    img: logout,
    type: 'logout',
    url: '',
  },
])

function handleHerf(type: number) {
  if (type === 2)
    router.push('/wallet/exchange/cashierCenter')
  else
    router.push('/wallet/exchange/cashierCenter-withdraw')
}

function handleClickMenu(item: { type: string, url?: string }) {
  if (item.type === 'logout') {
    handleLogout()
    return
  }

  if (item.url)
    router.push(item.url)
}

function handleLogout() {
  userStore.logout()
  router.push({ path: '/login' })
}

function handleClickUploadAvatar() {
  uploadPopShow.value = true
  userAvatar.value = ''
  canUpdateAvatar.value = true
  pictureList.value = []
}

async function handleAfterRead(file: any) {
  const item = Array.isArray(file) ? file[0] : file
  item.status = 'uploading'
  item.message = t('Loading')

  try {
    const formData = new FormData()
    formData.append('image', item.file)
    const { data, code } = await upload(formData)

    if (code === 200) {
      item.status = 'done'
      userAvatar.value = data.url
      canUpdateAvatar.value = false
    }
  }
  catch {
    item.status = 'failed'
    item.message = t('Upload failed')
  }
}

async function updateUserAvatar() {
  if (!userAvatar.value)
    return

  const res = await userUpdate({ image_url: userAvatar.value })
  if (res.code === 200) {
    showSuccessToast(t('Update successful'))
    await userStore.info()
    uploadPopShow.value = false
  }
}

onMounted(async () => {
  await userStore.info()
})
</script>

<template>
  <div class="profile-page">
    <div class="profile-shell">
      <header class="page-header">
        <div class="header-badge">
          {{ t('Wallet') }}
        </div>
        <h1 class="page-title">
          {{ t('Wallet') }}
        </h1>
      </header>

      <section class="hero-card">
        <div class="hero-top">
          <button type="button" class="avatar-button" @click="handleClickUploadAvatar">
            <img :src="currentAvatar" class="avatar-image" alt="avatar">
          </button>

          <div class="hero-copy">
            <div class="hero-meta">
              <span class="level-chip">
                {{ `LV ${userInfo.vip || 1}` }}
              </span>
              <span class="level-pill" :class="levelToneClass">
                {{ userInfo.vip_name || `VIP ${userInfo.vip || 1}` }}
              </span>
            </div>
            <div class="hero-id">
              {{ `ID: ${userInfo.uuid || '--'}` }}
            </div>
          </div>
        </div>

        <div class="stats-grid">
          <div v-for="item in walletStats" :key="item.label" class="stat-card">
            <div class="stat-value">
              {{ item.value }}
            </div>
            <div class="stat-label">
              {{ item.label }}
            </div>
          </div>
        </div>

        <div class="action-grid">
          <button type="button" class="action-button action-button-dark" @click="handleHerf(2)">
            {{ t('Deposit') }}
          </button>
          <button type="button" class="action-button action-button-light" @click="handleHerf(1)">
            {{ t('Withdraw') }}
          </button>
        </div>
      </section>

      <section class="menu-card">
        <button
          v-for="(item, index) in menuList"
          :key="index"
          type="button"
          class="menu-item"
          @click="handleClickMenu(item)"
        >
          <div class="menu-icon-wrap">
            <img :src="item.img" alt="" class="menu-icon">
          </div>
          <span class="menu-text">{{ item.text }}</span>
        </button>
      </section>

      <section class="logs-section">
        <walletLogs />
      </section>

      <van-popup
        v-model:show="uploadPopShow"
        destroy-on-close
        round
        position="center"
        :safe-area-inset-bottom="true"
      >
        <div class="upload-panel">
          <div class="upload-title">
            {{ t('Upload Avatar') }}
          </div>
          <van-uploader
            v-model="pictureList"
            accept="image/*"
            :max-count="1"
            :after-read="handleAfterRead"
            class="upload-uploader"
          >
            <div class="upload-dropzone">
              <van-icon name="photograph" size="24" />
              <span class="upload-dropzone-text">{{ t('Choose a file') }}</span>
            </div>
          </van-uploader>
          <div class="upload-actions">
            <van-button plain block @click="uploadPopShow = false">
              {{ t('Cancel') }}
            </van-button>
            <van-button block color="#1b1b1b" :disabled="canUpdateAvatar" @click="updateUserAvatar">
              {{ t('Confirm') }}
            </van-button>
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<style scoped lang="less">
.profile-page {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(125, 211, 252, 0.22), transparent 28%),
    radial-gradient(circle at top right, rgba(167, 243, 208, 0.18), transparent 24%),
    linear-gradient(180deg, #f8fbff 0%, #edf3f8 100%);
  padding: 14px 16px 100px;
}

.profile-shell {
  display: grid;
  gap: 16px;
}

.page-header {
  padding: 6px 4px 0;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #475569;
  backdrop-filter: blur(12px);
}

.page-title {
  margin: 12px 0 0;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.hero-card,
.menu-card {
  border: 1px solid rgba(148, 163, 184, 0.16);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.86) 100%);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(18px);
}

.hero-card {
  position: relative;
  overflow: hidden;
  padding: 20px;
}

.hero-card::after {
  position: absolute;
  top: -48px;
  right: -32px;
  width: 144px;
  height: 144px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(15, 23, 42, 0.08) 0%, rgba(15, 23, 42, 0) 72%);
  content: '';
  pointer-events: none;
}

.hero-top {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar-button {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  overflow: hidden;
  border: 0;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-copy {
  min-width: 0;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.level-chip,
.level-pill {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 5px 9px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
}

.level-chip {
  background: #f4f1eb;
  color: #8a5a32;
}

.level-pill {
  color: #fff;
}

.level-tone-1 {
  background: #8badc7;
}

.level-tone-2 {
  background: #9b7cb8;
}

.level-tone-3 {
  background: #4a8b7c;
}

.level-tone-4 {
  background: #d88a8a;
}

.level-tone-5 {
  background: #e67a6a;
}

.level-tone-6 {
  background: #d4a853;
}

.level-tone-7 {
  background: #e8c06f;
  color: #3f2e09;
}

.level-tone-8 {
  background: #d4a853;
}

.hero-id {
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.25;
  color: #111827;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.stat-card {
  border: 1px solid rgba(226, 232, 240, 0.92);
  border-radius: 22px;
  background: rgba(248, 250, 252, 0.92);
  padding: 16px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.15;
  color: #0f172a;
}

.stat-label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: #64748b;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.action-button {
  height: 48px;
  border-radius: 16px;
  font-size: 15px;
  font-weight: 700;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.action-button:active {
  transform: translateY(1px);
}

.action-button-dark {
  border: 1px solid #1b1b1b;
  background: #1b1b1b;
  color: #fff;
  box-shadow: 0 12px 24px rgba(27, 27, 27, 0.18);
}

.action-button-light {
  border: 1px solid rgba(27, 27, 27, 0.14);
  background: #fff;
  color: #1b1b1b;
}

.menu-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  padding: 18px;
}

.menu-item {
  display: grid;
  justify-items: center;
  gap: 10px;
  border: 1px solid rgba(226, 232, 240, 0.88);
  border-radius: 20px;
  background: rgba(248, 250, 252, 0.92);
  padding: 16px 10px;
  text-align: center;
}

.menu-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
}

.menu-icon {
  width: 40px;
  height: 40px;
  display: block;
}

.menu-text {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: #334155;
}

.logs-section {
  min-width: 0;
}

.upload-panel {
  width: min(80vw, 320px);
  padding: 18px;
}

.upload-title {
  margin-bottom: 14px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.upload-uploader {
  display: flex;
  justify-content: center;
}

.upload-dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 1px dashed #cbd5e1;
  border-radius: 18px;
  background: #f8fafc;
  color: #94a3b8;
}

.upload-dropzone-text {
  margin-top: 8px;
  font-size: 12px;
}

.upload-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

@media (max-width: 360px) {
  .page-title {
    font-size: 26px;
  }

  .stats-grid,
  .action-grid,
  .menu-card {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>

<route lang="json5">
{
  name: 'profile',
  meta: {
    title: 'My Profile',
    i18n: 'Wallet'
  },
}
</route>
