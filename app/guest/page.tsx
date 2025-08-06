'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function GuestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [guestName, setGuestName] = useState('')
  const [availableRooms] = useState([
    { id: 'room1', name: 'General Discussion', users: 5 },
    { id: 'room2', name: 'Tech Talk', users: 3 },
    { id: 'room3', name: 'Random Chat', users: 8 },
  ])

  useEffect(() => {
    const name = searchParams.get('name')
    if (name) {
      setGuestName(name)
    }
  }, [searchParams])

  const joinRoom = (roomId: string) => {
    if (guestName.trim()) {
      router.push(`/room/${roomId}?name=${encodeURIComponent(guestName)}&guest=true`)
    } else {
      alert('Please enter your name first')
    }
  }

  const createGuestRoom = () => {
    if (guestName.trim()) {
      const roomId = Math.random().toString(36).substring(2, 15)
      router.push(`/room/${roomId}?name=${encodeURIComponent(guestName)}&guest=true`)
    } else {
      alert('Please enter your name first')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Guest Access
            </CardTitle>
            <CardDescription>
              Enter your name to join conversations as a guest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="flex-1"
              />
              <Button onClick={createGuestRoom} disabled={!guestName.trim()}>
                Create New Room
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {room.name}
                </CardTitle>
                <CardDescription>
                  {room.users} users online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => joinRoom(room.id)} 
                  className="w-full"
                  disabled={!guestName.trim()}
                >
                  Join Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!guestName.trim() && (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Please enter your name above to join any room
            </p>
          </div>
        )}
      </div>
    </div>
  )
}