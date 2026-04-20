<template>
  <div class="add-content p-16 flex flex-col pb-90">
    <VanNavBar title="" :fixed="true" clickable :left-arrow="true" @click-left="onBack" placeholder z-index="999">
      <template #title>
        <div class="flex flex-items-center gap-6 font-size-[18px] font-bold">
          {{ isEdit ? t('Edit Address') : t('Add Address') }}
        </div>
      </template>
    </VanNavBar>

    <div class="p-16 rounded-20 bg-[#fff] card">
      <div v-for="field in fields" :key="field.key">
        <div class="label font-bold text-[16px] color-[#64748B]">
          {{ field.label }}
        </div>
        <div class="phone-input my-[12px]">
          <inputCom
            v-model:value="form[field.key]"
            :placeholder="field.placeholder"
            :onlyRead="false"
            :inputType="field.inputType || 'text'"
            :formatter="field.formatter"
          >
          </inputCom>
        </div>
      </div>
    </div>

    <BottomButton color="#1B1B1B" :button-text="t('Submit')" @click="handleClickSubmit"></BottomButton>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import inputCom from '@/components/inputCom.vue'
import { addUserAddress, updateUserAddress } from '@/api/user'
import { showSuccessToast, showToast } from 'vant'
import local from '@/utils/local'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const isEdit = ref(false)
const form = reactive<any>({
  cpf: '',
  contactPhone: '',
  fullName: '',
  state: '',
  city: '',
  district: '',
  street: '',
  streetNumber: '',
  cep: '',
})

const digitsFormatter = (val: string) => val.replace(/[^0-9]/g, '')

const fields = [
  { key: 'fullName', label: t('Full Name'), placeholder: '' },
  { key: 'contactPhone', label: t('Contact Phone'), placeholder: '', formatter: digitsFormatter },
  { key: 'cpf', label: t('CPFLabel'), placeholder: '', formatter: digitsFormatter },
  { key: 'state', label: t('State'), placeholder: '' },
  { key: 'city', label: t('City'), placeholder: '' },
  { key: 'district', label: t('District'), placeholder: '' },
  { key: 'street', label: t('Street'), placeholder: '' },
  { key: 'streetNumber', label: t('Street Number'), placeholder: '', formatter: digitsFormatter },
  { key: 'cep', label: t('CEPLabel'), placeholder: '', formatter: digitsFormatter },
]

const fillForm = () => {
  const info = local.getlocal('userAddressInfo')
  if (!info) {
    return
  }
  Object.keys(form).forEach((key) => {
    form[key] = info[key] || ''
  })
}

const validateForm = () => {
  for (const field of fields) {
    if (!String(form[field.key] || '').trim()) {
      showToast(field.label)
      return false
    }
  }
  return true
}

const handleClickSubmit = async () => {
  if (!validateForm()) {
    return
  }

  const request = isEdit.value ? updateUserAddress : addUserAddress
  const res = await request({ ...form })
  if (res.code === 200 || res.code === 0) {
    showSuccessToast('')
    local.removelocal('userAddressInfo')
    setTimeout(() => {
      router.replace('/profile/address')
    }, 500)
  }
}

function onBack() {
  local.removelocal('userAddressInfo')
  if (window.history.state.back)
    history.back()
  else
    router.replace('/profile/address')
}

onUnmounted(() => {
  local.removelocal('userAddressInfo')
})

onMounted(() => {
  if (route.query.edit === '1') {
    isEdit.value = true
    fillForm()
  }
})
</script>

<style lang="less" scoped>
.bottom-btn {
  bottom: calc(env(safe-area-inset-bottom) + 8px);
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  padding: 8px 24px 0;
}

.phone-input {
  border: 1px solid #F0F0F0;
  border-radius: 12px;

  :deep(.input-box) {
    margin-top: 0px;
    background: transparent;

    .max-input {
      background: transparent;

      input {
        background: transparent;
      }
    }
  }
}

.card {
  border: 1px solid #0000001A
}
</style>

<route lang="json5">
{
  name: 'AddressEdit',
  meta: {
    title: 'Address',
    i18n: 'Address'
  },
}
</route>
