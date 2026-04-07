import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'
import { LanguageToggle } from '@/components/news/LanguageToggle'
import { ViewTracker } from '@/components/news/ViewTracker'
import { ShareButtons } from '@/components/news/ShareButtons'

interface DetailProps {
  params: Promise<{ locale: string; slug: string }>
}

export default async function NewsDetailPage({ params }: DetailProps) {
  const { locale, slug } = await params
  const t = await getTranslations('article')

  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      source: true,
      translations: true,
      categories: { include: { category: true } },
    },
  })

  if (!article) notFound()

  // Pick the current locale's translation for toggle
  const localeTranslation = article.translations.find((tr) => tr.language === locale)

  // Related articles
  const relatedCategoryId = article.categories[0]?.categoryId
  const related = relatedCategoryId
    ? await prisma.article.findMany({
        where: {
          id: { not: article.id },
          categories: { some: { categoryId: relatedCategoryId } },
        },
        include: {
          translations: { where: { language: locale } },
          source: { select: { name: true } },
        },
        orderBy: { publishedAt: 'desc' },
        take: 3,
      })
    : []

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-20 lg:pb-6">
      {/* Track view */}
      <ViewTracker slug={slug} />

      {/* Back link */}
      <Link
        href={`/${locale}`}
        className="text-sm mb-4 inline-block"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t('backToNews')}
      </Link>

      {/* Categories */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {article.categories.map((ac) => (
          <span
            key={ac.categoryId}
            className="text-xs px-2 py-0.5 rounded-sm border"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
          >
            {locale === 'ja' ? ac.category.nameJa : ac.category.nameEn}
          </span>
        ))}
      </div>

      {/* Language toggle with title + summary */}
      <LanguageToggle
        originalTitle={article.titleOriginal}
        translatedTitle={localeTranslation?.title}
        originalSummary={article.summaryOriginal ?? undefined}
        translatedSummary={localeTranslation?.summary ?? undefined}
        originalLabel={t('original')}
        translationLabel={t('translation')}
        translatingLabel={t('translating')}
      />

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs mt-4 mb-6" style={{ color: 'var(--text-secondary)' }}>
        <span>{article.source.name}</span>
        <span>·</span>
        <span>{new Date(article.publishedAt).toLocaleDateString(locale, { dateStyle: 'medium' })}</span>
      </div>

      <hr style={{ borderColor: 'var(--border)' }} />

      {/* Read original CTA */}
      <div className="mt-6">
        <a
          href={article.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
          style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}
        >
          {t('readOriginal')} →
        </a>
      </div>

      {/* Share buttons */}
      <ShareButtons
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/news/${slug}`}
        title={localeTranslation?.title ?? article.titleOriginal}
        shareLabel={t('share')}
        copyLabel={t('copyLink')}
      />

      {/* Related articles */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            {t('relatedNews')}
          </h2>
          <div className="space-y-3">
            {related.map((r) => {
              const rt = r.translations[0]
              return (
                <Link
                  key={r.id}
                  href={`/${locale}/news/${r.slug}`}
                  className="block p-3 rounded border"
                  style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}
                >
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {rt?.title ?? r.titleOriginal}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {r.source.name}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div
        className="mt-12 p-4 rounded border text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        ⚠️ {t('disclaimer')}
      </div>
    </div>
  )
}
