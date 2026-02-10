import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
// import zhCN from 'vant/es/locale/lang/zh-CN'

import en from '@/locales/en-US.json'


import { Locale } from 'vant'
import type { PickerColumn } from 'vant'

const FALLBACK_LOCALE = 'en'


const vantLocales = {
  'en': { ...en, ...enUS }, // 英语使用 Vant 官方英语包
  // 'zh-TW': { ...zhCN }, // 中文繁体使用 Vant 官方中文包

}




export const languageColumns: PickerColumn = [
  { text: 'English', value: 'en' },
  { text: 'Brazilian', value: 'br' },
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
  await loadLocaleMsg(lang, i18n)

  document.querySelector('html').setAttribute('lang', lang)
  localStorage.setItem('language', lang)
  i18n.global.locale.value = lang

  // 设置 vant 组件语言包
  Locale.use(lang, vantLocales[lang])
}

// 加载本地语言包
async function loadLocaleMsg(locale: string, i18n: I18n) {
  let messages
  switch (locale) {
    case 'en':
      messages = await import(`../locales/en-US.json`)
      break
  }
  i18n.global.setLocaleMessage(locale, messages.default)
}

// 获取当前语言对应的语言包名称
function getI18nLocale() {
  const storedLocale = localStorage.getItem('language') || navigator.language

  const langs = languageColumns.map(v => v.value as string)

  // 存在当前语言的语言包 或 存在当前语言的任意地区的语言包
  const foundLocale = langs.find(v => v === storedLocale || v.indexOf(storedLocale) === 0)

  // 若未找到，则使用 默认语言包
  const locale = foundLocale || FALLBACK_LOCALE

  return locale
}
