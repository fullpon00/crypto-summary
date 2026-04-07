import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { LanguageToggle } from '@/components/news/LanguageToggle'
import { ViewTracker } from '@/components/news/ViewTracker'
import { ShareButtons } from '@/components/news/ShareButtons'

interface ArticleData {
  id: string
  slug: string
  titleOriginal: string
  summaryOriginal: string | null
  title: string
  summary: string | null
  content: string | null
  originalUrl: string
  publishedAt: string
  isBreaking: boolean
  viewCount: number
  source: { name: string; slug: string; url: string }
  categories: { slug: string; nameJa: string; nameEn: string }[]
  translations: { language: string; title: string; summary: string | null }[]
  allTranslations: { language: string; title: string; summary: string | null }[]
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

async function fetchArticle(slug: string, locale: string): Promise<ArticleData | null> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/articles/${slug}?locale=${locale}`, {
    next: { revalidate: 300 },
  })
  if (!res.ok) return null
  return res.json()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await fetchArticle(slug, locale)
  if (!article) return {}
  return {
    title: article.title,
    description: article.summary ?? undefined,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations('article')

  const article = await fetchArticle(slug, locale)
  if (!article) notFound()

  const localeTranslation = article.allTranslations.find((tr) => tr.language === locale)
  const hasTranslations = Boolean(localeTranslation)

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'}/${locale}/news/${slug}`

  return (
    <article className="max-w-3xl mx-auto py-6 px-4 pb-20 lg:pb-6">
      {/* Back link */}
      <Link
        href={`/${locale}`}
        className="text-sm mb-4 inline-block"
        style={{ color: 'var(--text-secondary)' }}
      >
        {t('backToNews')}
      </Link>

      {/* Header */}
      <header>
        {/* Categories */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {article.categories.map((cat) => (
            <span
              key={cat.slug}
              className="text-xs px-2 py-0.5 rounded-sm border"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            >
              {locale === 'ja' ? cat.nameJa : cat.nameEn}
            </span>
          ))}
        </div>

        {/* Title (shown here only when no translations exist) */}
        {!hasTranslations && (
          <h1 className="text-2xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
            {article.title}
          </h1>
        )}

        {/* Source and date */}
        <div
          className="flex items-center gap-3 text-xs mb-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span>
            <span className="font-medium">{t('source')}: </span>
            {article.source.name}
          </span>
          <span>·</span>
          <span>
            <span className="font-medium">{t('published')}: </span>
            {new Date(article.publishedAt).toLocaleDateString(locale, { dateStyle: 'medium' })}
          </span>
        </div>
      </header>

      {/* Language toggle + content (renders title inside toggle) */}
      {hasTranslations ? (
        <LanguageToggle
          originalTitle={article.titleOriginal}
          translatedTitle={localeTranslation?.title}
          originalSummary={article.summaryOriginal ?? undefined}
          translatedSummary={localeTranslation?.summary ?? undefined}
          originalLabel={t('original')}
          translationLabel={t('translation')}
          translatingLabel={t('translating')}
        />
      ) : (
        article.summary && (
          <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-primary)' }}>
            {article.summary}
          </p>
        )
      )}

      <hr style={{ borderColor: 'var(--border)' }} className="my-6" />

      {/* Actions */}
      <ShareButtons
        url={shareUrl}
        title={localeTranslation?.title ?? article.title}
        shareLabel={t('share')}
        copyLabel={t('copyLink')}
      />

      <div className="mt-6">
        <a
          href={article.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded text-sm font-medium"
          style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}
        >
          {t('readFullArticle')} →
        </a>
      </div>

      {/* Disclaimer */}
      <div
        className="mt-12 p-4 rounded border text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        {t('disclaimer')}
      </div>

      {/* View tracking (fires on mount, renders nothing) */}
      <ViewTracker slug={slug} />
    </article>
  )
}
