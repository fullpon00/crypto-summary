import Link from 'next/link'
import { NewsCard } from './NewsCard'

interface Article {
  slug: string
  title: string
  titleOriginal: string
  summary?: string | null
  isBreaking: boolean
  publishedAt: string
  source: { name: string; slug: string }
  categories: { slug: string; nameEn: string; nameJa: string }[]
  language: string
  originalUrl: string
  viewCount: number
  imageUrl?: string | null
}

interface NewsFeedProps {
  articles: Article[]
  locale: string
  currentPage: number
  totalPages: number
  category: string
  noArticlesLabel: string
}

export function NewsFeed({ articles, locale, currentPage, totalPages, category, noArticlesLabel }: NewsFeedProps) {
  if (articles.length === 0) {
    return (
      <p className="text-sm py-12 text-center" style={{ color: 'var(--text-secondary)' }}>
        {noArticlesLabel}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {articles.map((article) => (
        <NewsCard key={article.slug} article={article} locale={locale} />
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
            <Link
              key={page}
              href={`?${category !== 'all' ? `category=${category}&` : ''}page=${page}`}
              className="w-8 h-8 flex items-center justify-center rounded text-sm font-mono"
              style={{
                backgroundColor: page === currentPage ? '#F0B90B' : 'var(--bg-elevated)',
                color: page === currentPage ? '#0B0E11' : 'var(--text-primary)',
              }}
            >
              {page}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
