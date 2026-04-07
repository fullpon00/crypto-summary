import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50)
  const category = searchParams.get('category')
  const locale = searchParams.get('locale') ?? 'ja'
  const skip = (page - 1) * limit

  const where = category && category !== 'all'
    ? { categories: { some: { category: { slug: category } } } }
    : {}

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        source: { select: { name: true, slug: true } },
        translations: {
          where: { language: locale },
          select: { title: true, summary: true },
        },
        categories: {
          include: { category: { select: { slug: true, nameEn: true, nameJa: true } } },
        },
      },
      orderBy: [{ importanceScore: 'desc' }, { publishedAt: 'desc' }],
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ])

  type ArticleWithRelations = (typeof articles)[number]
  const data = articles.map((a: ArticleWithRelations) => ({
    id: a.id,
    slug: a.slug,
    source: a.source,
    originalUrl: a.originalUrl,
    title: a.translations[0]?.title ?? a.titleOriginal,
    titleOriginal: a.titleOriginal,
    summary: a.translations[0]?.summary ?? a.summaryOriginal,
    language: a.language,
    imageUrl: a.imageUrl,
    isBreaking: a.isBreaking,
    publishedAt: a.publishedAt,
    viewCount: a.viewCount,
    categories: a.categories.map((ac: { category: unknown }) => ac.category),
  }))

  return NextResponse.json({ data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
}
