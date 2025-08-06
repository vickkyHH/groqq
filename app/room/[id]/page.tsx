'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Users, Copy, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: Date
  type: 'user' | 'system'
}

export default function RoomPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [userName] = useState(searchParams.get('name') || 'Anonymous')
  const [connectedUsers, setConnectedUsers] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const roomId = params.id as string

  useEffect(() => {
    // Simulate initial system message
    const welcomeMessage: Message = {
      id: '1',
      text: `Welcome to room ${roomId}! Share this link with others to invite them.`,
      sender: 'System',
      timestamp: new Date(),
      type: 'system'
    }
    setMessages([welcomeMessage])
    setConnectedUsers([userName])
  }, [roomId, userName])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        text: newMessage,
        sender: userName,
        timestamp: new Date(),
        type: 'user'
      }
      setMessages(prev => [...prev, message])
      setNewMessage('')
    }
  }

  const copyRoomLink = () => {
    const link = `${window.location.origin}/guest/${roomId}`
    navigator.clipboard.writeText(link)
    alert('Room link copied to clipboard!')
  }

  const copyGuestLink = () => {
    const guestId = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/guest/${guestId}?room=${roomId}`
    navigator.clipboard.writeText(link)
    alert('Guest link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-2rem)]">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5" />
              Room Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium">Room ID</p>
              <p className="text-xs text-muted-foreground break-all">{roomId}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Connected Users</p>
              <div className="space-y-1">
                {connectedUsers.map((user, index) => (
                  <div key={index} className="text-xs bg-secondary rounded px-2 py-1">
                    {user}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={copyRoomLink} variant="outline" size="sm" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copy Room Link
              </Button>
              <Button onClick={copyGuestLink} variant="outline" size="sm" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Generate Guest Link
              </Button>
            </div>

            <Link href="/">
              <Button variant="ghost" size="sm" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[60vh]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.sender === userName ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'system'
                        ? 'bg-muted text-muted-foreground text-center w-full'
                        : message.sender === userName
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary'
                    }`}
                  >
                    {message.type !== 'system' && (
                      <p className="text-xs opacity-70 mb-1">{message.sender}</p>
                    )}
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}