import Link from 'next/link'

interface TrendingArticle {
  slug: string
  titleOriginal: string
  viewCount: number
}

export function Sidebar({ locale, trending, trendingLabel, statsLabel }: {
  locale: string
  trending: TrendingArticle[]
  trendingLabel: string
  statsLabel: string
}) {
  return (
    <aside className="w-[320px] shrink-0 hidden lg:block space-y-4">
      <div
        className="rounded-md border p-4 sticky top-24"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          {trendingLabel}
        </h3>
        <ol className="space-y-2">
          {trending.map((article, i) => (
            <li key={article.slug} className="flex gap-2">
              <span className="text-xs font-mono w-4 shrink-0 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                {i + 1}.
              </span>
              <Link
                href={`/${locale}/news/${article.slug}`}
                className="text-xs leading-snug hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {article.titleOriginal}
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
