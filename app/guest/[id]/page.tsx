'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function GuestLinkPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [guestName, setGuestName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const guestId = params.id as string
  const targetRoom = searchParams.get('room')

  const joinAsGuest = () => {
    if (guestName.trim()) {
      setIsLoading(true)
      // Simulate a brief loading state
      setTimeout(() => {
        if (targetRoom) {
          router.push(`/room/${targetRoom}?name=${encodeURIComponent(guestName)}&guest=true&guestId=${guestId}`)
        } else {
          router.push(`/guest?name=${encodeURIComponent(guestName)}`)
        }
      }, 500)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Guest Invitation
            </CardTitle>
            <CardDescription>
              {targetRoom 
                ? 'You\'ve been invited to join a conversation room'
                : 'You\'ve been invited to join Groqq messaging'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Your Name</label>
              <Input
                placeholder="Enter your name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && joinAsGuest()}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={joinAsGuest} 
              className="w-full"
              disabled={!guestName.trim() || isLoading}
            >
              {isLoading ? 'Joining...' : targetRoom ? 'Join Room' : 'Continue as Guest'}
            </Button>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Guest ID: {guestId}
              </p>
              {targetRoom && (
                <p className="text-xs text-muted-foreground mt-1">
                  Target Room: {targetRoom}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}