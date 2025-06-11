// WebSocket service for real-time communication

type MessageHandler = (data: any) => void
type ConnectionHandler = () => void

interface WebSocketOptions {
  reconnectInterval?: number
  maxReconnectAttempts?: number
}

export class WebSocketService {
  private socket: WebSocket | null = null
  private url: string
  private messageHandlers: Map<string, MessageHandler[]> = new Map()
  private connectionHandlers: {
    onConnect: ConnectionHandler[]
    onDisconnect: ConnectionHandler[]
  } = {
    onConnect: [],
    onDisconnect: [],
  }
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null

  constructor(url: string, options: WebSocketOptions = {}) {
    this.url = url
    this.reconnectInterval = options.reconnectInterval || 2000
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5
  }

  connect(): void {
    if (this.socket) {
      this.disconnect()
    }

    try {
      this.socket = new WebSocket(this.url)

      this.socket.onopen = () => {
        console.log("WebSocket connection established")
        this.reconnectAttempts = 0
        this.connectionHandlers.onConnect.forEach((handler) => handler())
      }

      this.socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          const { type, data } = message

          if (this.messageHandlers.has(type)) {
            this.messageHandlers.get(type)?.forEach((handler) => handler(data))
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }

      this.socket.onclose = () => {
        console.log("WebSocket connection closed")
        this.connectionHandlers.onDisconnect.forEach((handler) => handler())
        this.attemptReconnect()
      }

      this.socket.onerror = (error) => {
        console.error("WebSocket error:", error)
        this.socket?.close()
      }
    } catch (error) {
      console.error("Failed to establish WebSocket connection:", error)
      this.attemptReconnect()
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log("Max reconnect attempts reached")
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, this.reconnectInterval)
  }

  send(type: string, data: any): boolean {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected")
      return false
    }

    try {
      const message = JSON.stringify({ type, data })
      this.socket.send(message)
      return true
    } catch (error) {
      console.error("Error sending WebSocket message:", error)
      return false
    }
  }

  on(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)?.push(handler)
  }

  off(type: string, handler: MessageHandler): void {
    if (!this.messageHandlers.has(type)) return

    const handlers = this.messageHandlers.get(type) || []
    const index = handlers.indexOf(handler)

    if (index !== -1) {
      handlers.splice(index, 1)
    }
  }

  onConnect(handler: ConnectionHandler): void {
    this.connectionHandlers.onConnect.push(handler)
  }

  onDisconnect(handler: ConnectionHandler): void {
    this.connectionHandlers.onDisconnect.push(handler)
  }

  isConnected(): boolean {
    return this.socket !== null && this.socket.readyState === WebSocket.OPEN
  }
}

// Singleton instance for app-wide use
let wsServiceInstance: WebSocketService | null = null

export const getWebSocketService = (url?: string): WebSocketService => {
  if (!wsServiceInstance && url) {
    wsServiceInstance = new WebSocketService(url)
  } else if (!wsServiceInstance) {
    throw new Error("WebSocket service not initialized")
  }

  return wsServiceInstance
}
