import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import ptBR from 'vant/es/locale/lang/pt-BR'
import zhCN from 'vant/es/locale/lang/zh-CN'

import en from '@/locales/en-US.json'
import br from '@/locales/br.json'
import zh from '@/locales/zh-CN.json'

import { Locale } from 'vant'
import type { PickerColumn } from 'vant'

const FALLBACK_LOCALE = 'pt-BR'
const DEV_LOCALE = 'zh-CN'
const LEGACY_LOCALE_MAP: Record<string, string> = {
  br: 'pt-BR',
}

const vantLocales = {
  'en': { ...en, ...enUS }, // 英语使用 Vant 官方英语包
  'zh-CN': { ...zh, ...zhCN }, // 开发环境使用本地中文语言包
  'pt-BR': { ...br, ...ptBR }, // 巴西葡萄牙语使用自定义巴西语言包
}

export const languageColumns: PickerColumn = [
  // { text: 'English', value: 'en' },
  { text: 'Brazil', value: 'pt-BR' },
  // { text: '繁體中文', value: 'zh-TW' },
  // { text: 'हिंदी', value: 'hi' },
  // { text: 'தமிழ்', value: 'ta' },
  // { text: 'తెలుగు', value: 'te' },
]

export const i18n = setupI18n()
type I18n = typeof i18n

export const locale = computed({
  get() {
    return i18n.global.locale.value
  },
  set(language: string) {
    setLang(language, i18n)
  },
})

function setupI18n() {
  const locale = getI18nLocale()
  const i18n = createI18n({
    locale,
    legacy: false,
  })
  setLang(locale, i18n)
  return i18n
}

async function setLang(lang: string, i18n: I18n) {
  const normalizedLang = normalizeLocale(lang)
  await loadLocaleMsg(normalizedLang, i18n)

  document.querySelector('html').setAttribute('lang', normalizedLang)
  localStorage.setItem('language', normalizedLang)
  i18n.global.locale.value = normalizedLang

  // 设置 vant 组件语言包
  Locale.use(normalizedLang, vantLocales[normalizedLang])
}

// 加载本地语言包
async function loadLocaleMsg(locale: string, i18n: I18n) {
  let messages: { default: Record<string, any> }
  switch (locale) {
    case 'en':
      messages = await import(`../locales/en-US.json`)
      break
    case 'zh-CN':
      messages = await import(`../locales/zh-CN.json`)
      break
    case 'pt-BR':
      messages = await import(`../locales/br.json`)
      break
  }
  i18n.global.setLocaleMessage(locale, messages.default)
}

// 获取当前语言对应的语言包名称
function getI18nLocale() {
  if (import.meta.env.DEV) {
    return DEV_LOCALE
  }

  const storedLocale = normalizeLocale(localStorage.getItem('language') || navigator.language)

  const langs = languageColumns.map(v => v.value as string)

  // 存在当前语言的语言包 或 存在当前语言的任意地区的语言包
  const foundLocale = langs.find(v => v === storedLocale || v.indexOf(storedLocale) === 0)

  // 若未找到，则使用 默认语言包
  const locale = foundLocale || FALLBACK_LOCALE

  return locale
}

function normalizeLocale(locale: string) {
  return LEGACY_LOCALE_MAP[locale] || locale
}
