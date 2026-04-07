import { NextResponse } from 'next/server'
import { getFearGreed } from '@/lib/market/feargreed'

export const revalidate = 3600

export async function GET() {
  const data = await getFearGreed()
  if (!data) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })
  return NextResponse.json(data)
}
