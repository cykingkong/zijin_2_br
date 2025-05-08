import { I18n } from '../utils/i18n'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $t: I18n['global']['t']
  }
}
