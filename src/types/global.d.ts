import { throttleAfterCompletion } from '@/utils/tool'

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $throttle: typeof throttleAfterCompletion
    }
}
