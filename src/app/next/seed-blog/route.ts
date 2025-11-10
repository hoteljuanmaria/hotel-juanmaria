import { NextResponse } from 'next/server'
import { seedBlog } from '@/lib/seed/blog'

export async function POST() {
  try {
    const result = await seedBlog()
    return NextResponse.json({ success: true, result })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
