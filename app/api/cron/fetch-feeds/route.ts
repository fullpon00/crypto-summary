import { NextRequest, NextResponse } from 'next/server'
import { ingestFeeds } from '@/lib/rss/ingest'

export const maxDuration = 60 // Vercel Hobby max

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await ingestFeeds(5)
    console.log('[Cron] Ingest complete:', result)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('[Cron] Ingest failed:', error)
    return NextResponse.json({ error: 'Ingest failed' }, { status: 500 })
  }
}
