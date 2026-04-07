import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db/prisma'

export default async function SourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations('sources')

  const sources = await prisma.source.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 pb-20 lg:pb-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        {t('title')}
      </h1>
      <div className="space-y-3">
        {sources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between p-4 rounded border"
            style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
          >
            <div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:underline"
                style={{ color: 'var(--text-primary)' }}
              >
                {source.name}
              </a>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {t('lastFetched')}: {source.lastFetchedAt
                  ? new Date(source.lastFetchedAt).toLocaleString(locale)
                  : t('never')}
              </p>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded border font-mono"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
            >
              {source.language.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
