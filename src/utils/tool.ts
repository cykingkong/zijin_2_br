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

const addCommasToNumber = (number, shouldToFixed = true) => {
    if (number === null || number === undefined || number === 0) return '0';
    let integerPart, decimalPart;
    if (shouldToFixed) {
        [integerPart, decimalPart] = number.toFixed(2).split('.');
    } else {
        const parts = number.toString().split('.');
        integerPart = parts[0];
        decimalPart = parts.length > 1 ? parts[1] : '';
    }
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
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
