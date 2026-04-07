import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const locale = new URL(request.url).searchParams.get('locale') ?? 'ja'

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      source: true,
      translations: true,
      categories: { include: { category: true } },
    },
  })

  if (!article) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const translation =
    article.translations.find((t: { language: string }) => t.language === locale) ??
    article.translations.find((t: { language: string }) => t.language === 'en')

  return NextResponse.json({
    ...article,
    title: translation?.title ?? article.titleOriginal,
    summary: translation?.summary ?? article.summaryOriginal,
    allTranslations: article.translations,
    categories: article.categories.map((ac: { category: unknown }) => ac.category),
  })
}
