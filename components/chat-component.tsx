"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { WebSocketService } from "@/lib/websocket-service"
import { Send } from "lucide-react"

interface Message {
  id: string
  userId: string
  username: string
  avatar: string
  content: string
  timestamp: string
  isHighlighted?: boolean
}

interface ChatComponentProps {
  streamId: string
}

export function ChatComponent({ streamId }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocketService | null>(null)

  // Mock user data - in a real app, this would come from authentication
  const currentUser = {
    id: "user-current",
    username: "CurrentUser",
    avatar: "/placeholder.svg?height=40&width=40&text=CU",
  }

  // Initialize with some mock messages
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "msg-1",
        userId: "user-1",
        username: "TechArchitect",
        avatar: "/placeholder.svg?height=40&width=40&text=TA",
        content: "Welcome everyone to the stream! Today we're discussing microservices architecture.",
        timestamp: new Date(Date.now() - 300000).toISOString(),
        isHighlighted: true,
      },
      {
        id: "msg-2",
        userId: "user-2",
        username: "DevOpsNinja",
        avatar: "/placeholder.svg?height=40&width=40&text=DN",
        content: "Looking forward to learning about service discovery patterns!",
        timestamp: new Date(Date.now() - 240000).toISOString(),
      },
      {
        id: "msg-3",
        userId: "user-3",
        username: "CloudExpert",
        avatar: "/placeholder.svg?height=40&width=40&text=CE",
        content: "Will you be covering Kubernetes integration?",
        timestamp: new Date(Date.now() - 180000).toISOString(),
      },
      {
        id: "msg-4",
        userId: "user-1",
        username: "TechArchitect",
        avatar: "/placeholder.svg?height=40&width=40&text=TA",
        content: "Yes, we'll cover Kubernetes in the second half of the stream!",
        timestamp: new Date(Date.now() - 120000).toISOString(),
      },
      {
        id: "msg-5",
        userId: "user-4",
        username: "DatabaseGuru",
        avatar: "/placeholder.svg?height=40&width=40&text=DG",
        content: "How do you handle database scaling in a microservices architecture?",
        timestamp: new Date(Date.now() - 60000).toISOString(),
      },
    ]

    setMessages(mockMessages)
  }, [])

  // In a real app, we would connect to a WebSocket server
  useEffect(() => {
    // For demo purposes, we'll simulate WebSocket connection
    setIsConnected(true)

    // Simulate receiving messages periodically
    const interval = setInterval(() => {
      const users = [
        { id: "user-2", username: "DevOpsNinja", avatar: "/placeholder.svg?height=40&width=40&text=DN" },
        { id: "user-3", username: "CloudExpert", avatar: "/placeholder.svg?height=40&width=40&text=CE" },
        { id: "user-4", username: "DatabaseGuru", avatar: "/placeholder.svg?height=40&width=40&text=DG" },
        { id: "user-5", username: "FrontendWizard", avatar: "/placeholder.svg?height=40&width=40&text=FW" },
      ]

      const messages = [
        "This is really interesting!",
        "Could you explain that in more detail?",
        "Great explanation, thanks!",
        "How does this compare to a monolithic architecture?",
        "What tools do you recommend for monitoring?",
        "Have you tried using Redis for caching?",
        "What's your opinion on GraphQL vs REST?",
        "Is Docker Swarm still relevant with Kubernetes?",
        "How do you handle service discovery?",
        "What's the best way to implement circuit breakers?",
      ]

      const randomUser = users[Math.floor(Math.random() * users.length)]
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]

      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        userId: randomUser.id,
        username: randomUser.username,
        avatar: randomUser.avatar,
        content: randomMessage,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, newMessage])
    }, 5000)

    return () => {
      clearInterval(interval)
      // In a real app, we would disconnect from WebSocket here
    }
  }, [streamId])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      avatar: currentUser.avatar,
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // In a real app, we would send this message via WebSocket
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isHighlighted ? "bg-primary/10 -mx-2 px-2 py-1 rounded" : ""}`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.avatar || "/placeholder.svg"} />
                <AvatarFallback>{message.username.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{message.username}</span>
                  <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                </div>
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim() || !isConnected} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>
            {isConnected ? (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Disconnected
              </span>
            )}
          </span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  )
}
