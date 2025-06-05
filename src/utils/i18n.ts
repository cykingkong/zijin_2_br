import { createI18n } from 'vue-i18n'
import enUS from 'vant/es/locale/lang/en-US'
import zhCN from 'vant/es/locale/lang/zh-CN'
import zhTW from 'vant/es/locale/lang/zh-TW'
import jaJP from 'vant/es/locale/lang/ja-JP'
import koKR from 'vant/es/locale/lang/ko-KR'
import viVN from 'vant/es/locale/lang/vi-VN'
import thTH from 'vant/es/locale/lang/th-TH'
import idID from 'vant/es/locale/lang/id-ID'
import ruRU from 'vant/es/locale/lang/ru-RU'
import deDE from 'vant/es/locale/lang/de-DE'
import frFR from 'vant/es/locale/lang/fr-FR'
import esES from 'vant/es/locale/lang/es-ES'
import itIT from 'vant/es/locale/lang/it-IT'
import nlNL from 'vant/es/locale/lang/nl-NL'
import plPL from 'vant/es/locale/lang/pl-PL'
import ukUA from 'vant/es/locale/lang/uk-UA'
import trTR from 'vant/es/locale/lang/tr-TR'
import ptPT from '@/locales/pt-PT.json'
import ptBR from '@/locales/pt-BR.json'
import cs from '@/locales/cs.json'
import de from '@/locales/de.json'
import es from '@/locales/es.json'
import fr from '@/locales/fr.json'
import id from '@/locales/id.json'
import it from '@/locales/it.json'
import jp from '@/locales/jp.json'
import kr from '@/locales/kr.json'
import ms from '@/locales/ms.json'
import nl from '@/locales/nl.json'
import pl from '@/locales/pl.json'
import ru from '@/locales/ru.json'
import sv from '@/locales/sv.json'
import th from '@/locales/th.json'
import tr from '@/locales/tr.json'
import uk from '@/locales/uk.json'
import vn from '@/locales/vn.json'

import { Locale } from 'vant'
import type { PickerColumn } from 'vant'

const FALLBACK_LOCALE = 'zh-CN'

const vantLocales = {
  'zh-CN': { ...zhCN },
  'en-US': { ...enUS },
  'pt-PT': { ...ptPT, ...enUS }, // 葡萄牙语使用英文作为兜底
  'pt-BR': { ...ptBR, ...enUS }, // 巴西葡萄牙语使用英文作为兜底
  'cs': { ...cs, ...enUS }, // 捷克语，Vant 无官方语言包，使用英文兜底
  'de': { ...de, ...deDE }, // 德语使用 Vant 官方德语包
  'es': { ...es, ...esES }, // 西班牙语使用 Vant 官方西班牙语包
  'fr': { ...fr, ...frFR }, // 法语使用 Vant 官方法语包
  'id': { ...id, ...idID }, // 印尼语使用 Vant 官方印尼语包
  'it': { ...it, ...itIT }, // 意大利语使用 Vant 官方意大利语包
  'jp': { ...jp, ...jaJP }, // 日语使用 Vant 官方日语包
  'kr': { ...kr, ...koKR }, // 韩语使用 Vant 官方韩语包
  'ms': { ...ms, ...enUS }, // 马来语，Vant 无官方语言包，使用英文兜底
  'nl': { ...nl, ...nlNL }, // 荷兰语使用 Vant 官方荷兰语包
  'pl': { ...pl, ...plPL }, // 波兰语使用 Vant 官方波兰语包
  'ru': { ...ru, ...ruRU }, // 俄语使用 Vant 官方俄语包
  'sv': { ...sv, ...enUS }, // 瑞典语，Vant 无官方语言包，使用英文兜底
  'th': { ...th, ...thTH }, // 泰语使用 Vant 官方泰语包
  'tr': { ...tr, ...trTR }, // 土耳其语使用 Vant 官方土耳其语包
  'uk': { ...uk, ...ukUA }, // 乌克兰语使用 Vant 官方乌克兰语包
  'vn': { ...vn, ...viVN }, // 越南语使用 Vant 官方越南语包
}




export const languageColumns: PickerColumn = [
  { text: 'Português brasileiro', value: 'pt-BR' },
  { text: '简体中文', value: 'zh-CN' },
  { text: 'English', value: 'en-US' },
  { text: 'Português', value: 'pt-PT' },
  { text: 'Čeština', value: 'cs' },
  { text: 'Deutsch', value: 'de' },
  { text: 'Español', value: 'es' },
  { text: 'Français', value: 'fr' },
  { text: 'Bahasa Indonesia', value: 'id' },
  { text: 'Italiano', value: 'it' },
  { text: '日本語', value: 'jp' },
  { text: '한국어', value: 'kr' },
  { text: 'Bahasa Melayu', value: 'ms' },
  { text: 'Nederlands', value: 'nl' },
  { text: 'Polski', value: 'pl' },
  { text: 'Русский', value: 'ru' },
  { text: 'Svenska', value: 'sv' },
  { text: 'ไทย', value: 'th' },
  { text: 'Türkçe', value: 'tr' },
  { text: 'Українська', value: 'uk' },
  { text: 'Tiếng Việt', value: 'vn' },

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
  const messages = await import(`../locales/${locale}.json`)
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
