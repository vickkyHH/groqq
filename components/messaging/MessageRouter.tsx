'use client'

import { useState, useEffect } from 'react'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  roomId: string
  type: 'user' | 'system'
}

interface MessageRouterProps {
  roomId: string
  onMessagesUpdate: (messages: Message[]) => void
  onUsersUpdate: (users: string[]) => void
}

export function MessageRouter({ roomId, onMessagesUpdate, onUsersUpdate }: MessageRouterProps) {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Simulate connection
    setIsConnected(true)
    
    // Fetch initial messages and users
    fetchMessages()
    
    // Set up polling for new messages (in a real app, you'd use WebSockets)
    const interval = setInterval(fetchMessages, 2000)
    
    return () => {
      clearInterval(interval)
      setIsConnected(false)
    }
  }, [roomId])

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?roomId=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        const messages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
        onMessagesUpdate(messages)
        onUsersUpdate(data.users)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const sendMessage = async (text: string, sender: string) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          sender,
          roomId,
          type: 'user'
        }),
      })

      if (response.ok) {
        // Immediately fetch updated messages
        fetchMessages()
        return true
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    }
    return false
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages?roomId=${roomId}&messageId=${messageId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchMessages()
        return true
      }
    } catch (error) {
      console.error('Failed to delete message:', error)
    }
    return false
  }

  // Return router functions that can be used by parent components
  return {
    isConnected,
    sendMessage,
    deleteMessage,
    refreshMessages: fetchMessages
  }
}

// Hook for using the message router
export function useMessageRouter(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<string[]>([])
  
  const router = MessageRouter({
    roomId,
    onMessagesUpdate: setMessages,
    onUsersUpdate: setUsers
  })

  return {
    messages,
    users,
    ...router
  }
}