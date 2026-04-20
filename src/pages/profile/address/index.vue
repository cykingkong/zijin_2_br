<template>
  <div class="address-page p-24 pb-120">
    <div v-if="addressInfo" class="rounded-[16px] border border-[#E2E8F0] border-solid bg-white p-[16px]">
      <div class="flex items-start justify-between gap-[12px]">
        <div class="flex-1">
          <div class="text-[16px] font-bold text-[#1B1B1B] mb-[8px]">{{ addressInfo.fullName }}</div>
          <div class="text-[13px] text-[#64748B] mb-[6px]">{{ addressInfo.contactPhone }}</div>
          <div class="text-[13px] text-[#64748B] mb-[6px]">{{ t('CPFLabel') }}: {{ addressInfo.cpf }}</div>
          <div class="text-[13px] text-[#1B1B1B] leading-[20px]">
            {{ formatAddress(addressInfo) }}
          </div>
        </div>
        <svg class="w-20 h-20 flex-shrink-0" @click="handleEdit" viewBox="0 0 20 20" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15 10.8333V15.8333C15 16.7542 14.2542 17.5 13.3333 17.5H4.16667C3.24583 17.5 2.5 16.7542 2.5 15.8333V6.66667C2.5 5.74583 3.24583 5 4.16667 5H7.5"
            stroke="#1b1b1b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M6.66675 12.5L9.29175 12.1759C9.47591 12.1534 9.64758 12.0692 9.77925 11.9384L16.1384 5.5792C16.8426 4.87504 16.8426 3.73337 16.1384 3.02837V3.02837C15.4342 2.3242 14.2926 2.3242 13.5876 3.02837L7.28758 9.32837C7.16008 9.45587 7.07758 9.62087 7.05175 9.80004L6.66675 12.5Z"
            stroke="#1b1b1b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <div class="mt-[12px] text-[12px] text-[#94A3B8]">{{ t('CEPLabel') }}: {{ addressInfo.cep }}</div>
      <div class="mt-[16px]">
        <van-button plain block color="#1B1B1B" @click="handleCopy">
          {{ t('Copy') }}
        </van-button>
      </div>
    </div>

    <empty v-else :noTips="false" :tipsText="t('No more')"></empty>

    <bottom-button
      color="#1B1B1B"
      :button-text="addressInfo ? t('Edit Address') : t('Add Address')"
      @click="handleEdit"
    ></bottom-button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showSuccessToast } from 'vant'
import { getUserAddressInfo } from '@/api/user'
import local from '@/utils/local'

const router = useRouter()
const { t } = useI18n()
const addressInfo = ref<any>(null)

const getAddressInfo = async () => {
  const { data, code } = await getUserAddressInfo()
  if (code === 200 || code === 0) {
    const current = Array.isArray(data) ? data[0] : data
    addressInfo.value = current || null
  }
}

const formatAddress = (item: any) => {
  return [item.state, item.city, item.district, item.street, item.streetNumber].filter(Boolean).join(', ')
}

const getCopyText = (item: any) => {
  return [
    `${t('CPFLabel')}: ${item.cpf || ''}`,
    `${t('ContactPhoneLabel')}: ${item.contactPhone || ''}`,
    `${t('FullNameLabel')}:${item.fullName || ''}`,
    `${t('StateLabel')}: ${item.state || ''}`,
    `${t('CityLabel')}: ${item.city || ''}`,
    `${t('DistrictLabel')}: ${item.district || ''}`,
    `${t('StreetLabel')}:${item.street || ''}`,
    `${t('StreetNumberLabel')}: ${item.streetNumber || ''}`,
    `${t('CEPLabel')}:${item.cep || ''}`,
  ].join('\n')
}

const handleCopy = async () => {
  if (!addressInfo.value) {
    return
  }
  await navigator.clipboard.writeText(getCopyText(addressInfo.value))
  showSuccessToast(t('AddressCopied'))
}

const handleEdit = () => {
  if (addressInfo.value) {
    local.setlocal('userAddressInfo', addressInfo.value)
  }
  else {
    local.removelocal('userAddressInfo')
  }
  router.push(`/profile/address/edit?edit=${addressInfo.value ? 1 : 0}`)
}

onMounted(() => {
  getAddressInfo()
})
</script>


<style lang="less" scoped>
.bottom-btn {
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding-bottom: calc(env(safe-area-inset-bottom) + 8px);
  padding-top: 8px;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
}
</style>

<route lang="json5">
{
  name: 'Address',
  meta: {
    title: 'Address',
    i18n: 'Address'
  },
}
</route>
