// app/menu/route.ts
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'   // no cache
export const runtime = 'nodejs'

export async function GET(req: Request) {
  // base del sitio (evita depender de NEXT_PUBLIC_SITE_URL)
  const origin = new URL(req.url).origin

  // lee el global vía REST pública de Payload
  const res = await fetch(`${origin}/api/globals/currentMenu?draft=false`, {
    // importante: que no quede cacheado en el edge
    cache: 'no-store',
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Menú no configurado' }, { status: 404 })
  }

  const data = await res.json()
  const file = data?.pdf
  let url: string | null = file?.url || null

  // completa la URL si es relativa (/media/...)
  if (url && !/^https?:\/\//i.test(url)) {
    url = `${origin}${url}`
  }

  if (!url) {
    return NextResponse.json({ error: 'Menú no configurado' }, { status: 404 })
  }

  return NextResponse.redirect(url, {
    headers: {
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}
