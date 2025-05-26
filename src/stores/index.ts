import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import useUserStore from './modules/user'
import navTitleStore from './modules/navTitle'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export { useUserStore, navTitleStore }
export default pinia
