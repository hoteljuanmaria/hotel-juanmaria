import { NextRequest, NextResponse } from 'next/server'
import { getPayloadRooms } from '@/utilities/getRooms'

const isLocale = (v: string | null): v is 'es' | 'en' | 'all' =>
  v === 'es' || v === 'en' || v === 'all'

export async function GET(req: NextRequest) {
  const qp = req.nextUrl.searchParams.get('locale')
  const locale = isLocale(qp) ? qp : 'es'  // <- narrow de string -> unión literal

  try {
    const rooms = await getPayloadRooms({ locale })
    return NextResponse.json({ rooms })
  } catch (e) {
    console.error('Error fetching rooms:', e)
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 })
  }
}
