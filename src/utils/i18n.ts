import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import jaJP from 'vant/es/locale/lang/ja-JP'
import koKR from 'vant/es/locale/lang/ko-KR'
import deDE from 'vant/es/locale/lang/de-DE'
import esES from 'vant/es/locale/lang/es-ES'

import en from '@/locales/en-US.json'
import zhTW from '@/locales/zh-TW.json'
import jp from '@/locales/jp.json'
import kr from '@/locales/kr.json'
import de from '@/locales/de.json'
import es from '@/locales/es.json'

import { Locale } from 'vant'
import type { PickerColumn } from 'vant'

const FALLBACK_LOCALE = 'es'


const vantLocales = {
  'en': { ...en, ...enUS }, // 英语使用 Vant 官方英语包
  'zh-TW': { ...zhTW, ...zhCN }, // 中文繁体使用 Vant 官方中文包
  'jp': { ...jp, ...jaJP }, // 日语使用 Vant 官方日语包
  'kr': { ...kr, ...koKR }, // 韩语使用 Vant 官方韩语包
  'de': { ...de, ...deDE }, // 德语使用 Vant 官方德语包
  'es': { ...es, ...esES }, // 西班牙语使用 Vant 官方西班牙语包
}




export const languageColumns: PickerColumn = [
  { text: 'Español', value: 'es' },
  { text: 'English', value: 'en' },
  { text: '繁體中文', value: 'zh-TW' },
  { text: '日本語', value: 'jp' },
  { text: '한국어', value: 'kr' },
  { text: 'Deutsch', value: 'de' },
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
    case 'zh-TW':
      messages = await import(`../locales/zh-TW.json`)
      break
    case 'jp':
      messages = await import(`../locales/jp.json`)
      break
    case 'kr':
      messages = await import(`../locales/kr.json`)
      break
    case 'de':
      messages = await import(`../locales/de.json`)
      break
    case 'es':
      messages = await import(`../locales/es.json`)
      break
    default:
      messages = await import(`../locales/es.json`)
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
