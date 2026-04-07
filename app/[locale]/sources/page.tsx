import { getTranslations } from 'next-intl/server'
import { RSS_SOURCES } from '@/lib/rss/sources'

// Site URLs for each source (feedUrl is the RSS feed; provide the website URL here)
const SITE_URLS: Record<string, string> = {
  coindesk: 'https://www.coindesk.com',
  cointelegraph: 'https://cointelegraph.com',
  'the-block': 'https://www.theblock.co',
  'bitcoin-magazine': 'https://bitcoinmagazine.com',
  decrypt: 'https://decrypt.co',
}

export default async function SourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  await params
  const t = await getTranslations('sources')

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-20 lg:pb-6">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
        {t('title')}
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
        {t('description')}
      </p>
      <div className="space-y-3">
        {RSS_SOURCES.map((source) => (
          <div
            key={source.slug}
            className="flex items-center justify-between p-4 rounded border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div>
              <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {source.name}
              </span>
              <span
                className="ml-3 text-xs px-2 py-0.5 rounded border font-mono"
                style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
              >
                {source.language.toUpperCase()}
              </span>
            </div>
            <a
              href={SITE_URLS[source.slug] ?? source.feedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm px-3 py-1.5 rounded font-medium"
              style={{ backgroundColor: '#F0B90B', color: '#0B0E11' }}
            >
              {t('visitSite')}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
