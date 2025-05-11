// 全局防抖函数
const throttleAfterCompletion = <T extends (...args: any[]) => Promise<any>>(
    fn: T,
    delay = 1000,
    options?: {
        onStart?: () => void
        onEnd?: () => void
    }
) => {
    let isPending = false
    return async function (this: ThisParameterType<T>, ...args: Parameters<T>) {
        if (isPending) return
        isPending = true
        options?.onStart?.()

        try {
            return await fn.apply(this, args)
        } finally {
            setTimeout(() => {
                isPending = false
                options?.onEnd?.()
            }, delay)
        }
    }
}

const addCommasToNumber = (number) => {
    if (number === null || number === undefined || number === 0) return '0';
    const [integerPart, decimalPart] = number.toFixed(2).split('.');
    return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimalPart}`;
}
export {
    addCommasToNumber,
    throttleAfterCompletion
}

// 使用示例：
// 1. 导入防抖函数
// import { throttleAfterCompletion } from '@/utils/tool'
//
// 2. 定义原始方法
// const submitOriginal = async () => {
//   // ...业务逻辑
// }
//
// 3. 应用防抖包装
// const submit = throttleAfterCompletion(submitOriginal)
//
// 4. 模板绑定保持不变
// <button @click="submit">提交</button>
