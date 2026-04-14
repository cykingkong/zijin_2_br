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
import inviteFriends from '@/assets/tabbar/inviteFriends.png'
import bankAccount from '@/assets/profile/bank-account.svg'
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
  {
    label: t('Recharge Account'),
    value: formatRupiah(userInfo.value?.balance || 0),
  },
  {
    label: t('Withdraw Account'),
    value: formatRupiah(userInfo.value?.team_balance || 0),
  },
])

const menuList = computed(() => [
  {
    text: t('Bank Account'),
    img: bankAccount,
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

const kycStatus = computed(() => Number(userInfo.value?.kyc_status ?? 0))
const canEnterKyc = computed(() => kycStatus.value === 0)
const kycStatusText = computed(() => {
  if (kycStatus.value === 2)
    return t('Verified')
  if (kycStatus.value === 1)
    return t('Under review')
  return t('Unverified')
})
const kycStatusToneClass = computed(() => {
  if (kycStatus.value === 2)
    return 'kyc-status-verified'
  if (kycStatus.value === 1)
    return 'kyc-status-reviewing'
  return 'kyc-status-unverified'
})

function handleClickKycStatus() {
  if (canEnterKyc.value)
    router.push('/kyc')
}

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

      <button
        type="button"
        class="kyc-status-card"
        :class="[kycStatusToneClass, { 'kyc-status-card--clickable': canEnterKyc }]"
        @click="handleClickKycStatus"
      >
        <div class="kyc-status-copy">
          <div class="kyc-status-title">
            {{ t('KYC Status') }}
          </div>
          <div class="kyc-status-desc">
            {{ kycStatusText }}
          </div>
        </div>
        <div class="kyc-status-action">
          <span class="kyc-status-pill">{{ kycStatusText }}</span>
          <svg v-if="canEnterKyc" class="kyc-status-arrow" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 4.16675L13.3333 10.0001L7.5 15.8334" stroke="currentColor" stroke-width="1.67"
              stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </button>

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
    radial-gradient(circle at top, rgba(124, 255, 178, 0.16), transparent 30%),
    linear-gradient(180deg, #050505 0%, #000 100%);
  padding: 20px 16px 110px;
  color: #f5f5f5;
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
  border: 1px solid rgba(124, 255, 178, 0.35);
  border-radius: 999px;
  background: rgba(124, 255, 178, 0.08);
  padding: 7px 12px;
  font-size: 11px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8bffbe;
}

.page-title {
  margin: 12px 0 0;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.04em;
  color: #f5f5f5;
}

.hero-card,
.menu-card,
.kyc-status-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.96) 0%, rgba(8, 8, 8, 0.96) 100%);
  box-shadow:
    inset 0 1px 2px rgba(255, 255, 255, 0.04),
    inset 0 -8px 20px rgba(0, 0, 0, 0.45),
    0 8px 24px rgba(0, 0, 0, 0.45);
}

.kyc-status-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  width: 100%;
  padding: 18px;
  text-align: left;
}

.kyc-status-card--clickable {
  cursor: pointer;
}

.kyc-status-copy {
  min-width: 0;
}

.kyc-status-title {
  font-size: 14px;
  font-weight: 700;
  color: #f5f5f5;
}

.kyc-status-desc {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.5;
  color: #a3a3a3;
}

.kyc-status-action {
  display: flex;
  align-items: center;
  gap: 10px;
}

.kyc-status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.kyc-status-arrow {
  width: 18px;
  height: 18px;
  color: #8bffbe;
}

.kyc-status-unverified .kyc-status-pill {
  background: rgba(216, 146, 27, 0.16);
  color: #d8921b;
  box-shadow: inset 0 0 0 1px rgba(216, 146, 27, 0.18);
}

.kyc-status-reviewing .kyc-status-pill {
  background: rgba(124, 255, 178, 0.08);
  color: #8bffbe;
  box-shadow: inset 0 0 0 1px rgba(124, 255, 178, 0.18);
}

.kyc-status-verified .kyc-status-pill {
  background: rgba(124, 255, 178, 0.12);
  color: #8bffbe;
  box-shadow: inset 0 0 0 1px rgba(124, 255, 178, 0.22), 0 0 14px rgba(124, 255, 178, 0.12);
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
  background: radial-gradient(circle, rgba(124, 255, 178, 0.18) 0%, rgba(124, 255, 178, 0) 72%);
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
  width: 58px;
  height: 58px;
  overflow: hidden;
  border: 1px solid rgba(124, 255, 178, 0.18);
  border-radius: 18px;
  background: #111;
  box-shadow:
    inset 0 0 0 1px rgba(124, 255, 178, 0.12),
    0 0 18px rgba(124, 255, 178, 0.14);
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
  background: rgba(216, 146, 27, 0.16);
  color: #d8921b;
  box-shadow: inset 0 0 0 1px rgba(216, 146, 27, 0.18);
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
  color: #f5f5f5;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.stat-card {
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.03);
  padding: 16px;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.15;
  color: #8bffbe;
}

.stat-label {
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: #a3a3a3;
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
  border: none;
  background: linear-gradient(90deg, #68f7a1 0%, #8bffbe 100%);
  color: #050505;
  box-shadow: 0 0 12px rgba(124, 255, 178, 0.45), 0 0 36px rgba(124, 255, 178, 0.18);
}

.action-button-light {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #111;
  color: #f5f5f5;
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
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
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
  background: rgba(124, 255, 178, 0.08);
  box-shadow:
    inset 0 0 0 1px rgba(124, 255, 178, 0.18),
    0 0 14px rgba(124, 255, 178, 0.12);
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
  color: #f5f5f5;
}

.logs-section {
  min-width: 0;
}

.upload-panel {
  width: min(80vw, 320px);
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 28px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.98) 0%, rgba(8, 8, 8, 0.98) 100%);
  color: #f5f5f5;
}

.upload-title {
  margin-bottom: 14px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: #f5f5f5;
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
  border: 1px dashed rgba(124, 255, 178, 0.28);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.03);
  color: #8bffbe;
}

.upload-dropzone-text {
  margin-top: 8px;
  font-size: 12px;
  color: #a3a3a3;
}

.upload-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

:deep(.upload-panel .van-button) {
  border-radius: 14px;
  height: 42px;
}

:deep(.upload-panel .van-button--plain) {
  border-color: rgba(255, 255, 255, 0.1);
  background: #111;
  color: #f5f5f5;
}

:deep(.upload-panel .van-popup) {
  background: transparent;
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
