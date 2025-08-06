import { NextRequest, NextResponse } from 'next/server'

interface Message {
  id: string
  text: string
  sender: string
  timestamp: string
  roomId: string
  type: 'user' | 'system'
}

// In-memory storage for demo purposes
// In production, you'd use a database
const messages: Map<string, Message[]> = new Map()
const roomUsers: Map<string, Set<string>> = new Map()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')
  
  if (!roomId) {
    return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
  }

  const roomMessages = messages.get(roomId) || []
  const users = Array.from(roomUsers.get(roomId) || [])
  
  return NextResponse.json({ 
    messages: roomMessages,
    users: users
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sender, roomId, type = 'user' } = body

    if (!text || !sender || !roomId) {
      return NextResponse.json(
        { error: 'Text, sender, and roomId are required' },
        { status: 400 }
      )
    }

    const message: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date().toISOString(),
      roomId,
      type
    }

    // Add message to room
    if (!messages.has(roomId)) {
      messages.set(roomId, [])
    }
    messages.get(roomId)!.push(message)

    // Add user to room
    if (!roomUsers.has(roomId)) {
      roomUsers.set(roomId, new Set())
    }
    roomUsers.get(roomId)!.add(sender)

    return NextResponse.json({ message, success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const roomId = searchParams.get('roomId')
  const messageId = searchParams.get('messageId')
  
  if (!roomId || !messageId) {
    return NextResponse.json(
      { error: 'Room ID and Message ID are required' },
      { status: 400 }
    )
  }

  const roomMessages = messages.get(roomId)
  if (roomMessages) {
    const messageIndex = roomMessages.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      roomMessages.splice(messageIndex, 1)
      return NextResponse.json({ success: true })
    }
  }

  return NextResponse.json(
    { error: 'Message not found' },
    { status: 404 }
  )
}