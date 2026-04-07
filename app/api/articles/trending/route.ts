import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const articles = await prisma.article.findMany({
    select: { slug: true, titleOriginal: true, viewCount: true, publishedAt: true },
    orderBy: { viewCount: 'desc' },
    take: 5,
  })
  return NextResponse.json(articles)
}
