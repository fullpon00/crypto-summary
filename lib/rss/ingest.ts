import { prisma } from '@/lib/db/prisma'
import { parseFeed } from './fetcher'
import { createDedupeHash } from './deduplication'
import { translateArticle } from '@/lib/translate/claude'
import { RSS_SOURCES } from './sources'

export function generateSlug(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
    .replace(/-$/, '')
  return `${base}-${id.slice(0, 8)}`
}

export function calculateImportanceScore(title: string): number {
  const keywords = ['sec', 'etf', 'halving', 'hack', 'crash', 'ban', 'approve', 'cftc']
  const lower = title.toLowerCase()
  return keywords.some((k) => lower.includes(k)) ? 80 : 50
}

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  breaking: ['breaking', 'urgent', 'alert'],
  bitcoin: ['bitcoin', 'btc'],
  ethereum: ['ethereum', 'eth'],
  regulation: ['sec', 'cftc', 'regulation', 'ban', 'approve', 'legal', 'lawsuit'],
  etf: ['etf', 'spot etf'],
  defi: ['defi', 'uniswap', 'aave', 'compound', 'liquidity', 'yield'],
}

export function getCategorySlugsForTitle(title: string): string[] {
  const lower = title.toLowerCase()
  return Object.entries(CATEGORY_KEYWORDS)
    .filter(([, keywords]) => keywords.some((k) => lower.includes(k)))
    .map(([slug]) => slug)
}

export async function assignCategories(title: string, articleId: string): Promise<void> {
  const matchedSlugs = getCategorySlugsForTitle(title)
  if (matchedSlugs.length === 0) return

  const categories = await prisma.category.findMany({
    where: { slug: { in: matchedSlugs } },
  })

  await prisma.articleCategory.createMany({
    data: categories.map((cat) => ({ articleId, categoryId: cat.id })),
    skipDuplicates: true,
  })
}

async function ingestSource(feedSource: (typeof RSS_SOURCES)[number]): Promise<{ fetched: number; saved: number }> {
  const dbSource = await prisma.source.findUnique({ where: { slug: feedSource.slug } })
  if (!dbSource || !dbSource.isActive) return { fetched: 0, saved: 0 }

  const articles = await parseFeed(feedSource.feedUrl)
  let saved = 0

  for (const article of articles) {
    if (!article.url || !article.title) continue

    const dedupeHash = createDedupeHash(article.url, article.title)
    const existing = await prisma.article.findUnique({ where: { dedupeHash } })
    if (existing) continue

    const id = crypto.randomUUID()
    const slug = generateSlug(article.title, id)

    const newArticle = await prisma.article.create({
      data: {
        id,
        sourceId: dbSource.id,
        slug,
        originalUrl: article.url,
        titleOriginal: article.title,
        summaryOriginal: article.summary,
        language: dbSource.language,
        imageUrl: article.imageUrl,
        publishedAt: article.publishedAt,
        dedupeHash,
        importanceScore: calculateImportanceScore(article.title),
      },
    })
    saved++

    await assignCategories(article.title, newArticle.id)

    await prisma.articleTranslation.upsert({
      where: { articleId_language: { articleId: newArticle.id, language: 'en' } },
      update: {},
      create: {
        articleId: newArticle.id,
        language: 'en',
        title: article.title,
        summary: article.summary,
        translatedBy: 'original',
      },
    })
  }

  await prisma.source.update({
    where: { id: dbSource.id },
    data: { lastFetchedAt: new Date() },
  })

  return { fetched: articles.length, saved }
}

export async function ingestFeeds(maxTranslations = 3): Promise<{
  fetched: number
  saved: number
  translated: number
}> {
  // Fetch all sources in parallel
  const results = await Promise.allSettled(RSS_SOURCES.map(ingestSource))

  let fetched = 0
  let saved = 0
  for (const r of results) {
    if (r.status === 'fulfilled') {
      fetched += r.value.fetched
      saved += r.value.saved
    }
  }

  // Translate a few untranslated articles
  let translated = 0
  if (maxTranslations > 0) {
    const untranslated = await prisma.article.findMany({
      where: { translations: { none: { language: 'ja' } } },
      orderBy: { publishedAt: 'desc' },
      take: maxTranslations,
      select: { id: true, titleOriginal: true, summaryOriginal: true },
    })

    for (const article of untranslated) {
      const jaTranslation = await translateArticle({
        title: article.titleOriginal,
        summary: article.summaryOriginal ?? undefined,
        targetLanguage: 'ja',
      })
      if (jaTranslation) {
        await prisma.articleTranslation.create({
          data: {
            articleId: article.id,
            language: 'ja',
            title: jaTranslation.title,
            summary: jaTranslation.summary,
          },
        })
        translated++
      }
    }
  }

  return { fetched, saved, translated }
}
