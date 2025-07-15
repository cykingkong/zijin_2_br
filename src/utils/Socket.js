const envWs = import.meta.env.VITE_WS_API_BASE_URL

class Socket {
  constructor(link, options = {}) {
    // 重连配置
    this.reconnectConfig = {
      enabled: options.reconnect !== false, // 默认启用重连
      maxAttempts: options.maxAttempts || 5, // 最大重连次数
      initialDelay: options.initialDelay || 1000, // 初始重连延迟(ms)
      maxDelay: options.maxDelay || 30000, // 最大重连延迟(ms)
      backoffMultiplier: options.backoffMultiplier || 2, // 退避倍数
      ...options,
    }

    // 重连状态
    this.reconnectState = {
      isReconnecting: false,
      attemptCount: 0,
      currentDelay: this.reconnectConfig.initialDelay,
      reconnectTimer: null,
    }

    // 初始化socket
    if (link && link.constructor === WebSocket) {
      this.socket = link
    }
    else {
      this.wsUrl = link || envWs
      this.socket = new WebSocket(this.wsUrl)
    }

    // this.socket.binaryType = 'arraybuffer';

    this.doOpen()

    // 连接状态的标识符
    this.readyState = this.socket.readyState

    // 订阅/发布模型
    this._events = {
      // 订阅的事件 ： 发布的方法
    }

    // 定时验证的标识符
    this.heartBeatTimer = null
  }

  // 执行socket并发布事件
  doOpen() {
    this.afterOpenEmit = []

    // 执行socket连接 并初始化验证请求
    this.socket.addEventListener('open', evt => this.onOpen(evt))

    // 接收socket数据
    this.socket.addEventListener('message', evt => this.onMessage(evt))

    // 关闭socket连接
    this.socket.addEventListener('close', evt => this.onClose(evt))

    // 请求发生错误
    this.socket.addEventListener('error', err => this.onError(err))
  }

  // 重连机制
  reconnect() {
    if (!this.reconnectConfig.enabled || this.reconnectState.isReconnecting) {
      return
    }

    if (this.reconnectState.attemptCount >= this.reconnectConfig.maxAttempts) {
      console.warn('WebSocket重连次数已达上限，停止重连')
      this.Notify({ Event: 'reconnect_failed', Data: { attemptCount: this.reconnectState.attemptCount } })
      return
    }

    this.reconnectState.isReconnecting = true
    this.reconnectState.attemptCount++

    console.warn(`WebSocket连接断开，${this.reconnectState.currentDelay}ms后进行第${this.reconnectState.attemptCount}次重连`)

    // 通知重连开始
    this.Notify({
      Event: 'reconnecting',
      Data: {
        attemptCount: this.reconnectState.attemptCount,
        delay: this.reconnectState.currentDelay,
      },
    })

    this.reconnectState.reconnectTimer = setTimeout(() => {
      this.performReconnect()
    }, this.reconnectState.currentDelay)

    // 计算下次重连延迟（指数退避）
    this.reconnectState.currentDelay = Math.min(
      this.reconnectState.currentDelay * this.reconnectConfig.backoffMultiplier,
      this.reconnectConfig.maxDelay,
    )
  }

  // 执行重连
  performReconnect() {
    try {
      // 清理旧的连接
      if (this.socket) {
        this.socket.removeEventListener('open', this.onOpen.bind(this))
        this.socket.removeEventListener('message', this.onMessage.bind(this))
        this.socket.removeEventListener('close', this.onClose.bind(this))
        this.socket.removeEventListener('error', this.onError.bind(this))
        this.socket.close()
      }

      // 创建新连接
      this.socket = new WebSocket(this.wsUrl)
      this.readyState = this.socket.readyState
      this.doOpen()
    }
    catch (error) {
      console.error('WebSocket重连失败：', error)
      this.reconnectState.isReconnecting = false
      this.Notify({ Event: 'reconnect_error', Data: error })
    }
  }

  // 重置重连状态
  resetReconnectState() {
    this.reconnectState.isReconnecting = false
    this.reconnectState.attemptCount = 0
    this.reconnectState.currentDelay = this.reconnectConfig.initialDelay
    if (this.reconnectState.reconnectTimer) {
      clearTimeout(this.reconnectState.reconnectTimer)
      this.reconnectState.reconnectTimer = null
    }
  }

  // 发布后通知订阅者
  Notify(entry) {
    // 检查是否有订阅者 返回队列
    const cbQueue = this._events[entry.Event]
    if (cbQueue && cbQueue.length) {
      for (let callback of cbQueue) {
        if (typeof callback === 'function')
          callback(entry.Data)
      }
    }
  }

  // 请求数据的方法
  onOpen(evt) {
    // 连接成功，重置重连状态
    this.resetReconnectState()

    // 每隔20s检查连接
    this.heartBeatTimer = setInterval(() => this.send({
      type: 'PING',
    }), 20000)

    // 通知订阅
    this.Notify({ Event: 'open', Data: evt })

    // 通知重连成功
    if (this.reconnectState.attemptCount > 0) {
      this.Notify({
        Event: 'reconnected',
        Data: { attemptCount: this.reconnectState.attemptCount },
      })
    }
  }

  /**
   * 订阅所有的数据
   * @param {Array | object} datas 订阅参数集合
   */
  send(datas) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket连接未就绪，当前状态：', this.socket.readyState)
      return
    }

    if (datas.constructor !== Array) {
      datas = [datas]
    }
    try {
      for (let item of datas) {
        this.socket.send(JSON.stringify(item))
      }
    }
    catch (err) {
      console.error('WebSocket发送错误：', err)
      this.onError(err)
    }
  }

  onMessage(evt) {
    try {
      // 解析推送的数据
      const data = JSON.parse(evt.data)

      // 通知订阅者
      this.Notify({
        Event: 'message',
        Data: data,
      })
    }
    catch (err) {
      console.warn('WebSocket消息解析错误：', err)

      // 通知订阅者
      this.Notify({
        Event: 'error',
        Data: err,
      })
    }
  }

  // 添加事件监听
  on(name, handler) {
    this.subscribe(name, handler)
  }

  // 取消订阅事件
  off(name, handler) {
    this.unsubscribe(name, handler)
  }

  // 订阅事件的方法
  subscribe(name, handler) {
    if (Object.prototype.hasOwnProperty.call(this._events, name)) {
      this._events[name].push(handler) // 追加事件
    }
    else {
      this._events[name] = [handler] // 添加事件
    }
  }

  // 取消订阅事件
  unsubscribe(name, handler) {
    if (this._events[name]) {
      let start = this._events[name].findIndex(item => item === handler)
      if (start !== -1) {
        // 删除该事件
        this._events[name].splice(start, 1)
      }
    }
  }

  checkOpen() {
    return this.readyState >= 2
  }

  onClose(evt) {
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = null
    }

    this.Notify({ Event: 'close', Data: evt })

    // 如果不是主动关闭，则尝试重连
    if (!evt.wasClean && this.reconnectConfig.enabled && !this.reconnectState.isReconnecting) {
      this.reconnect()
    }
  }

  onError(err) {
    // 如果是重连过程中的错误，重置重连状态
    if (this.reconnectState.isReconnecting) {
      this.reconnectState.isReconnecting = false
      // 如果还有重连次数，继续重连
      if (this.reconnectState.attemptCount < this.reconnectConfig.maxAttempts) {
        this.reconnect()
      }
    }

    this.Notify({ Event: 'error', Data: err })
  }

  emit(data) {
    return new Promise((resolve) => {
      this.send(JSON.stringify(data))
      this.on('message', (data) => {
        console.warn(data, 'data123')
        resolve(data)
      })
    })
  }

  doClose() {
    // 禁用重连，因为这是主动关闭
    this.reconnectConfig.enabled = false
    this.resetReconnectState()
    this.socket.close()
  }

  destroy() {
    // 禁用重连
    this.reconnectConfig.enabled = false

    // 清理重连定时器
    this.resetReconnectState()

    // 清理心跳定时器
    if (this.heartBeatTimer) {
      clearInterval(this.heartBeatTimer)
      this.heartBeatTimer = null
    }

    this.doClose()
    this._events = {}
    this.readyState = 0
    this.socket = null
  }

  // 获取重连状态
  getReconnectState() {
    return {
      ...this.reconnectState,
      config: this.reconnectConfig,
    }
  }

  // 手动触发重连
  forceReconnect() {
    if (this.reconnectState.isReconnecting) {
      console.warn('WebSocket正在重连中，请稍后再试')
      return
    }

    this.resetReconnectState()
    this.reconnect()
  }
}

export default Socket
