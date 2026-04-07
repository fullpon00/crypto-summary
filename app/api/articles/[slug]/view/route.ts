import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export async function POST(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await prisma.article.updateMany({
    where: { slug },
    data: { viewCount: { increment: 1 } },
  })
  return NextResponse.json({ ok: true })
}
