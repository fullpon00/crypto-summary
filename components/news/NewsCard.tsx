import Link from 'next/link'

interface ArticleCategory {
  slug: string
  nameEn: string
  nameJa: string
}

interface Article {
  slug: string
  title: string
  titleOriginal: string
  summary?: string | null
  isBreaking: boolean
  publishedAt: string
  source: { name: string; slug: string }
  categories: ArticleCategory[]
  language: string
  originalUrl: string
  viewCount: number
  imageUrl?: string | null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  return `${Math.floor(hours / 24)}d`
}

export function NewsCard({ article, locale }: { article: Article; locale: string }) {
  return (
    <article
      className="rounded-md border p-4 transition-colors cursor-pointer"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          {article.isBreaking && (
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-sm"
              style={{ backgroundColor: '#F6465D', color: '#fff' }}
            >
              BREAKING
            </span>
          )}
          {article.categories.slice(0, 2).map((cat) => (
            <span
              key={cat.slug}
              className="text-xs px-2 py-0.5 rounded-sm border"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            >
              {locale === 'ja' ? cat.nameJa : cat.nameEn}
            </span>
          ))}
        </div>
        <span className="text-xs font-mono shrink-0 ml-2" style={{ color: 'var(--text-secondary)' }}>
          {timeAgo(article.publishedAt)}
        </span>
      </div>

      <Link href={`/${locale}/news/${article.slug}`}>
        <h2
          className="text-base font-semibold leading-snug mb-2 line-clamp-2 hover:underline"
          style={{ color: 'var(--text-primary)' }}
        >
          {article.title}
        </h2>
      </Link>

      {article.summary && (
        <p className="text-sm leading-relaxed mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {article.summary}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {article.source.name}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            🌐 {article.language.toUpperCase()}
          </span>
        </div>
        <Link href={`/${locale}/news/${article.slug}`} className="text-xs font-medium" style={{ color: '#F0B90B' }}>
          →
        </Link>
      </div>
    </article>
  )
}
