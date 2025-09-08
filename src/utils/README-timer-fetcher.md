# 定时JSON数据获取器使用指南

## 概述

这个工具提供了完整的定时获取JSON数据的解决方案，特别适用于需要定期从API获取数据的场景，如股票价格、实时数据等。

## 主要特性

- ✅ **定时获取**: 可配置的获取间隔
- ✅ **自动重试**: 失败时自动重试机制
- ✅ **错误处理**: 完善的错误处理和回调
- ✅ **统计信息**: 详细的请求统计和性能监控
- ✅ **Vue集成**: 提供Vue组合式函数
- ✅ **TypeScript支持**: 完整的类型定义
- ✅ **灵活配置**: 丰富的配置选项

## 文件结构

```
src/
├── utils/
│   ├── timer-fetcher.ts          # 核心工具类
│   └── README-timer-fetcher.md   # 本文档
├── composables/
│   └── useTimerFetcher.ts        # Vue组合式函数
└── components/
    └── TimerFetcherExample.vue   # 使用示例
```

## 基础用法

### 1. 直接使用工具类

```typescript
import { TimerFetcher } from '@/utils/timer-fetcher'

// 创建获取器实例
const fetcher = new TimerFetcher({
  url: 'https://api.example.com/data',
  interval: 60000, // 60秒
  onData: (data) => {
    console.log('获取到新数据:', data)
  },
  onError: (error) => {
    console.error('获取失败:', error)
  }
})

// 开始获取数据
fetcher.start()

// 停止获取数据
fetcher.stop()

// 立即获取一次
fetcher.fetchNow()
```

### 2. 使用Vue组合式函数

```vue
<template>
  <div>
    <div>数据: {{ data }}</div>
    <div>加载状态: {{ isLoading }}</div>
    <div>错误: {{ error?.message }}</div>
    <button @click="start">开始</button>
    <button @click="stop">停止</button>
  </div>
</template>

<script setup lang="ts">
import { useTimerFetcher } from '@/composables/useTimerFetcher'

const {
  data,
  error,
  isLoading,
  start,
  stop
} = useTimerFetcher({
  url: 'https://api.example.com/data',
  interval: 60000,
  autoStart: true
})
</script>
```

### 3. 专门用于Yahoo Finance

```typescript
import { useYahooFinanceFetcher } from '@/composables/useTimerFetcher'

const {
  data,
  error,
  isLoading,
  start,
  stop
} = useYahooFinanceFetcher('FLY', '1m', {
  interval: 60000, // 60秒获取一次
  autoStart: true
})
```

## 配置选项

### TimerFetcher 选项

| 参数         | 类型       | 默认值     | 说明                 |
| ------------ | ---------- | ---------- | -------------------- |
| `url`        | `string`   | -          | 要获取数据的URL地址  |
| `interval`   | `number`   | -          | 获取间隔（毫秒）     |
| `maxRetries` | `number`   | `3`        | 最大重试次数         |
| `retryDelay` | `number`   | `1000`     | 重试延迟（毫秒）     |
| `timeout`    | `number`   | `10000`    | 请求超时时间（毫秒） |
| `onData`     | `function` | `() => {}` | 数据获取成功回调     |
| `onError`    | `function` | `() => {}` | 错误回调             |
| `onStart`    | `function` | `() => {}` | 开始获取回调         |
| `onStop`     | `function` | `() => {}` | 停止获取回调         |
| `autoStart`  | `boolean`  | `false`    | 是否自动开始         |

### Vue组合式函数额外选项

| 参数                | 类型      | 默认值 | 说明               |
| ------------------- | --------- | ------ | ------------------ |
| `autoStopOnUnmount` | `boolean` | `true` | 组件卸载时自动停止 |

## 方法说明

### TimerFetcher 类方法

- `start()`: 开始定时获取数据
- `stop()`: 停止定时获取数据
- `fetchNow()`: 立即获取一次数据
- `isActive()`: 检查是否正在运行
- `getStats()`: 获取统计信息
- `resetStats()`: 重置统计信息
- `updateOptions()`: 更新配置选项

### Vue组合式函数返回值

- `data`: 获取到的数据
- `error`: 错误信息
- `isLoading`: 加载状态
- `stats`: 统计信息
- `start`: 开始方法
- `stop`: 停止方法
- `fetchNow`: 立即获取方法
- `isActive`: 检查状态方法
- `resetStats`: 重置统计方法

## 统计信息

获取器会记录以下统计信息：

- `totalRequests`: 总请求数
- `successfulRequests`: 成功请求数
- `failedRequests`: 失败请求数
- `lastFetchTime`: 最后请求时间
- `lastSuccessTime`: 最后成功时间
- `lastErrorTime`: 最后错误时间
- `averageResponseTime`: 平均响应时间

## 错误处理

获取器内置了完善的错误处理机制：

1. **网络错误**: 自动重试，可配置重试次数和延迟
2. **HTTP错误**: 处理非200状态码
3. **超时处理**: 可配置请求超时时间
4. **错误回调**: 通过`onError`回调处理错误

## 实际应用场景

### 1. 股票价格监控

```typescript
const stockFetcher = useYahooFinanceFetcher('AAPL', '1m', {
  interval: 30000, // 30秒获取一次
  onData: (data) => {
    const price = data.chart.result[0].meta.regularMarketPrice
    updateStockPrice(price)
  }
})
```

### 2. 实时数据更新

```typescript
const dataFetcher = useTimerFetcher({
  url: 'https://api.example.com/realtime-data',
  interval: 5000, // 5秒获取一次
  onData: (data) => {
    updateDashboard(data)
  }
})
```

### 3. 多数据源管理

```typescript
const fetchers = [
  useYahooFinanceFetcher('AAPL', '1m'),
  useYahooFinanceFetcher('GOOGL', '1m'),
  useYahooFinanceFetcher('MSFT', '1m')
]

// 统一管理
const startAll = () => fetchers.forEach(f => f.start())
const stopAll = () => fetchers.forEach(f => f.stop())
```

## 性能优化建议

1. **合理设置间隔**: 避免过于频繁的请求
2. **使用缓存**: 对于不常变化的数据，可以增加获取间隔
3. **错误重试**: 合理设置重试次数，避免无限重试
4. **资源清理**: 组件卸载时记得停止获取器

## 注意事项

1. **跨域问题**: 确保目标API支持跨域请求
2. **API限制**: 注意API的请求频率限制
3. **内存管理**: 长时间运行时注意内存使用
4. **网络状态**: 在网络不稳定时，重试机制会自动处理

## 故障排除

### 常见问题

1. **数据不更新**: 检查网络连接和API状态
2. **频繁重试**: 检查网络稳定性和API响应
3. **内存泄漏**: 确保组件卸载时停止获取器

### 调试技巧

```typescript
// 启用详细日志
const fetcher = new TimerFetcher({
  url: 'https://api.example.com/data',
  interval: 60000,
  onData: (data) => {
    console.log('数据更新:', data)
  },
  onError: (error) => {
    console.error('获取失败:', error)
  },
  onStart: () => {
    console.log('开始获取数据')
  },
  onStop: () => {
    console.log('停止获取数据')
  }
})

// 查看统计信息
console.log('统计信息:', fetcher.getStats())
```

## 更新日志

- **v1.0.0**: 初始版本，支持基础定时获取功能
- **v1.1.0**: 添加Vue组合式函数支持
- **v1.2.0**: 增强错误处理和统计功能
- **v1.3.0**: 添加Yahoo Finance专用获取器
