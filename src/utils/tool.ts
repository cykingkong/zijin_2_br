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

// 定义一个函数，用于将数字添加逗号
const addCommasToNumber = (number, shouldToFixed = true, noshowZero = false) => {

    // 如果数字为空或未定义或为0，则返回0
    if (number === null || number === undefined || number === 0) {
        if (noshowZero) return ''
        return '0'

    };
    // 定义整数部分和小数部分
    let integerPart, decimalPart;
    // 如果shouldToFixed为true，则将数字转换为字符串，并分割为整数部分和小数部分
    if (shouldToFixed) {
        console.log(number);
        try {
            // 统一转换为数字类型
            const num = Number(number);
            if (isNaN(num)) {
                if (noshowZero) return '';
                return '0';
            }
            [integerPart, decimalPart] = num.toFixed(2).split('.');
        } catch (e) {
            console.error('数字格式化错误:', e);
            // if (noshowZero) return '';
            // return '0';
        }
    } else {
        // 否则，将数字转换为字符串，并分割为整数部分和小数部分
        const parts = number.toString().split('.');
        integerPart = parts[0];
        decimalPart = parts.length > 1 ? parts[1] : '';
    }
    // 将整数部分中的每三位数字添加逗号
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // 如果有小数部分，则返回整数部分和小数部分，否则只返回整数部分
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
