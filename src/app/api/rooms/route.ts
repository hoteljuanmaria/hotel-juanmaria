import { NextResponse } from 'next/server'
import { getPayloadRooms } from '@/utilities/getRooms'

export async function GET() {
  try {
    const rooms = await getPayloadRooms()
    return NextResponse.json({ rooms })
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}
