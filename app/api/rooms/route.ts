import { NextRequest, NextResponse } from 'next/server'

interface Room {
  id: string
  name: string
  createdAt: string
  userCount: number
}

// In-memory storage for demo purposes
const rooms: Map<string, Room> = new Map()

// Initialize with some default rooms
rooms.set('room1', {
  id: 'room1',
  name: 'General Discussion',
  createdAt: new Date().toISOString(),
  userCount: 5
})

rooms.set('room2', {
  id: 'room2',
  name: 'Tech Talk',
  createdAt: new Date().toISOString(),
  userCount: 3
})

rooms.set('room3', {
  id: 'room3',
  name: 'Random Chat',
  createdAt: new Date().toISOString(),
  userCount: 8
})

export async function GET() {
  const roomList = Array.from(rooms.values())
  return NextResponse.json({ rooms: roomList })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, id } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Room name is required' },
        { status: 400 }
      )
    }

    const roomId = id || Math.random().toString(36).substring(2, 15)
    
    const room: Room = {
      id: roomId,
      name,
      createdAt: new Date().toISOString(),
      userCount: 0
    }

    rooms.set(roomId, room)

    return NextResponse.json({ room, success: true })
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
  
  if (!roomId) {
    return NextResponse.json(
      { error: 'Room ID is required' },
      { status: 400 }
    )
  }

  if (rooms.has(roomId)) {
    rooms.delete(roomId)
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { error: 'Room not found' },
    { status: 404 }
  )
}