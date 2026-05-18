"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { MessageSquare, Minus, X, Send, Loader2 } from "lucide-react"
import { chatStore } from "@/lib/chat-store"
import Image from "next/image"

interface MessageType {
  id: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export function ChatFloatingBox() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [instructorId, setInstructorId] = useState<string | null>(null)
  const [instructorName, setInstructorName] = useState<string>("")
  const [instructorImage, setInstructorImage] = useState<string | undefined>(undefined)
  const [conversationId, setConversationId] = useState<string | null>(null)
  
  const [messages, setMessages] = useState<MessageType[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Subscribe to chatStore events
  useEffect(() => {
    const unsubscribeOpen = chatStore.subscribe((id, name, img) => {
      setInstructorId(id)
      setInstructorName(name)
      setInstructorImage(img)
      setIsOpen(true)
      setIsMinimized(false)
    })

    const unsubscribeClose = chatStore.subscribeClose(() => {
      setIsOpen(false)
      setInstructorId(null)
      setConversationId(null)
      setMessages([])
    })

    return () => {
      unsubscribeOpen()
      unsubscribeClose()
    }
  }, [])

  // Auto-scroll to bottom of chat when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, isOpen, isMinimized])

  // Get or Create Conversation when instructorId changes
  useEffect(() => {
    if (!isOpen || !instructorId || status !== "authenticated") return

    const initConversation = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ instructorId }),
        })
        const data = await res.json()
        if (res.ok && data.conversation) {
          setConversationId(data.conversation.id)
        } else {
          console.error("Failed to load conversation:", data.message)
        }
      } catch (error) {
        console.error("Init conversation error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initConversation()
  }, [instructorId, isOpen, status])

  // Fetch messages and start polling once conversationId is loaded
  useEffect(() => {
    if (!isOpen || !conversationId || isMinimized) return

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/chat/messages?conversationId=${conversationId}`)
        const data = await res.json()
        if (res.ok && data.messages) {
          setMessages(data.messages)
        }
      } catch (error) {
        console.error("Fetch messages error:", error)
      }
    }

    // Fetch immediately
    fetchMessages()

    // Poll every 3 seconds for new messages (Long Polling)
    const interval = setInterval(fetchMessages, 3000)

    return () => clearInterval(interval)
  }, [conversationId, isOpen, isMinimized])

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!conversationId || !inputValue.trim() || isSending) return

    const messageContent = inputValue.trim()
    setInputValue("")
    setIsSending(true)

    // Optimistic UI update
    const tempMessage: MessageType = {
      id: Math.random().toString(),
      conversationId,
      senderId: session?.user?.id || "",
      content: messageContent,
      createdAt: new Date().toISOString()
    }
    setMessages((prev) => [...prev, tempMessage])

    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          content: messageContent
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        console.error("Failed to send message:", data.message)
        // Remove optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
      } else if (data.message) {
        // Replace optimistic message with actual DB message
        setMessages((prev) => 
          prev.map((m) => m.id === tempMessage.id ? data.message : m)
        )
      }
    } catch (error) {
      console.error("Send message error:", error)
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id))
    } finally {
      setIsSending(false)
    }
  }

  // If user is not authenticated or not loaded, don't show the box at all
  if (status !== "authenticated") {
    return null
  }

  if (!isOpen) return null

  // Minimized state: floating chat badge
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 bg-[#FF6600] rounded-full flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer animate-bounce"
        title={`Tiếp tục trò chuyện với ${instructorName}`}
      >
        <div className="relative">
          <MessageSquare className="w-7 h-7" />
          <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] w-[360px] sm:w-[380px] h-[520px] bg-white/95 backdrop-blur-3xl border border-zinc-100 shadow-2xl rounded-[2.5rem] flex flex-col overflow-hidden transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50/50 px-6 py-5 border-b border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden shadow-md border-2 border-white">
            <Image 
              src={instructorImage || `https://i.pravatar.cc/150?u=${instructorId}`} 
              alt={instructorName} 
              fill
              className="object-cover"
            />
          </div>
          <div className="text-left">
            <h4 className="font-black text-sm text-zinc-900 leading-tight">{instructorName}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Trực tuyến</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsMinimized(true)}
            className="w-8 h-8 rounded-xl bg-white hover:bg-zinc-100 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-all border border-zinc-100"
            title="Thu nhỏ"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => chatStore.closeChat()}
            className="w-8 h-8 rounded-xl bg-white hover:bg-red-50 flex items-center justify-center text-zinc-500 hover:text-red-500 transition-all border border-zinc-100"
            title="Đóng chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body / Message List */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[#FAFAFA]">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF6600]" />
            <p className="text-xs font-bold uppercase tracking-widest">Đang tải cuộc trò chuyện...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6600]">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-sm text-zinc-800 mb-1">Gửi lời chào đầu tiên!</p>
              <p className="text-zinc-400 text-xs font-medium leading-relaxed">Hãy chia sẻ những thắc mắc hoặc câu hỏi về khóa học của bạn với giảng viên.</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const isMe = message.senderId === session?.user?.id
              return (
                <div 
                  key={message.id} 
                  className={`flex ${isMe ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    {!isMe && (
                      <div className="relative w-7 h-7 rounded-xl overflow-hidden shrink-0 mt-1 shadow-sm border border-white">
                        <Image 
                          src={instructorImage || `https://i.pravatar.cc/150?u=${instructorId}`} 
                          alt={instructorName} 
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div 
                      className={`px-4 py-3 text-sm font-medium leading-relaxed shadow-sm ${
                        isMe 
                          ? "bg-[#FF6600] text-white rounded-[1.5rem] rounded-tr-none" 
                          : "bg-white text-zinc-800 border border-zinc-100 rounded-[1.5rem] rounded-tl-none"
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      <span className={`block text-[8px] mt-1 text-right font-bold tracking-wider ${isMe ? "text-orange-200" : "text-zinc-400"}`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Footer / Send Form */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-100 bg-white flex gap-3 items-center">
        <input 
          type="text" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập tin nhắn..." 
          className="flex-1 h-12 rounded-2xl bg-[#F1F3F5] border-none px-5 text-sm font-medium focus-visible:ring-2 focus-visible:ring-orange-500/20 placeholder:text-zinc-400 focus:outline-none"
          required
        />
        <button 
          type="submit" 
          disabled={!inputValue.trim() || isSending}
          className="w-12 h-12 rounded-2xl bg-[#FF6600] hover:bg-orange-600 disabled:bg-zinc-200 disabled:text-zinc-400 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
        >
          {isSending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5 fill-white" />
          )}
        </button>
      </form>
    </div>
  )
}
