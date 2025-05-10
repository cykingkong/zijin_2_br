<script setup lang="ts">
import type { PickerColumn } from 'vant'
import { languageColumns, locale } from '@/utils/i18n'

const { t } = useI18n()

const menuItems = computed(() => ([
  { title: t('menus.mockGuide'), route: 'mock' },
  { title: t('menus.echartsDemo'), route: 'charts' },
  { title: t('menus.unocssExample'), route: 'unocss' },
  { title: t('menus.persistPiniaState'), route: 'counter' },
  { title: t('menus.keepAlive'), route: 'keepalive' },
  { title: t('menus.scrollCache'), route: 'scroll-cache' },
  { title: t('menus.404Demo'), route: 'unknown' },
]))

const showLanguagePicker = ref(false)
const languageValues = ref<Array<string>>([locale.value])
const language = computed(() => languageColumns.find(l => l.value === locale.value).text)

function onLanguageConfirm(event: { selectedOptions: PickerColumn }) {
  locale.value = event.selectedOptions[0].value as string
  showLanguagePicker.value = false
}

const checked = ref<boolean>(isDark.value)

watchEffect(() => {
  checked.value = isDark.value
})

function toggle(val: boolean) {
  checked.value = val
  toggleDark()
}
const router = useRouter()
onMounted(() => {
  router.push('/quotes')
})
</script>

<template>
  <div class=""></div>
</template>

<route lang="json5">
{
  name: 'home',
  meta: {
    title: '主页',
    i18n: 'menus.home'
  },
}
</route>
