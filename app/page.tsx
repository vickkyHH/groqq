'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, Link as LinkIcon } from 'lucide-react'

export default function HomePage() {
  const [roomName, setRoomName] = useState('')
  const [guestName, setGuestName] = useState('')
  const router = useRouter()

  const createRoom = () => {
    if (roomName.trim()) {
      const roomId = Math.random().toString(36).substring(2, 15)
      router.push(`/room/${roomId}?name=${encodeURIComponent(roomName)}`)
    }
  }

  const joinAsGuest = () => {
    if (guestName.trim()) {
      router.push(`/guest?name=${encodeURIComponent(guestName)}`)
    }
  }

  const generateGuestLink = () => {
    const guestId = Math.random().toString(36).substring(2, 15)
    const link = `${window.location.origin}/guest/${guestId}`
    navigator.clipboard.writeText(link)
    alert('Guest link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Create Room
            </CardTitle>
            <CardDescription>
              Start a new messaging room and invite others
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter room name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createRoom()}
            />
            <Button onClick={createRoom} className="w-full">
              Create Room
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join as Guest
            </CardTitle>
            <CardDescription>
              Join existing conversations as a guest user
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter your name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinAsGuest()}
            />
            <Button onClick={joinAsGuest} variant="outline" className="w-full">
              Join as Guest
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5" />
              Guest Links
            </CardTitle>
            <CardDescription>
              Generate shareable links for guest access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={generateGuestLink} variant="secondary" className="w-full">
              Generate Guest Link
            </Button>
            <p className="text-sm text-muted-foreground">
              Share the generated link with others to let them join as guests
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}