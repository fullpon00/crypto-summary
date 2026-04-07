import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'

export const dynamic = 'force-dynamic'
import { TickerBar } from '@/components/market/TickerBar'
import { FearGreedMeter } from '@/components/market/FearGreedMeter'
import { CategoryTabs } from '@/components/news/CategoryTabs'
import { NewsFeed } from '@/components/news/NewsFeed'
import { Sidebar } from '@/components/layout/Sidebar'
import { getFearGreed } from '@/lib/market/feargreed'

interface HomeProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function HomePage({ params, searchParams }: HomeProps) {
  const { locale } = await params
  const { category: rawCategory, page: rawPage } = await searchParams
  const category = rawCategory ?? 'all'
  const page = Math.max(1, parseInt(rawPage ?? '1'))

  const t = await getTranslations('categories')
  const tArticle = await getTranslations('article')
  const tSidebar = await getTranslations('sidebar')

  const categoryLabels: Record<string, string> = {
    all: t('all'),
    breaking: t('breaking'),
    bitcoin: t('bitcoin'),
    ethereum: t('ethereum'),
    regulation: t('regulation'),
    etf: t('etf'),
    defi: t('defi'),
    altcoins: t('altcoins'),
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const qs = new URLSearchParams({
    locale,
    page: String(page),
    limit: '20',
    ...(category !== 'all' && { category }),
  })

  const [newsRes, trendingRes, fearGreed] = await Promise.all([
    fetch(`${baseUrl}/api/articles?${qs}`, { next: { revalidate: 300 } }),
    fetch(`${baseUrl}/api/articles/trending`, { next: { revalidate: 600 } }),
    getFearGreed(),
  ])

  const newsData = newsRes.ok
    ? await newsRes.json()
    : { data: [], pagination: { page: 1, totalPages: 1 } }
  const trending = trendingRes.ok ? await trendingRes.json() : []

  return (
    <div className="pb-20 lg:pb-8">
      <Suspense fallback={<div className="h-10" />}>
        <TickerBar />
      </Suspense>

      <div className="pt-4">
        <Suspense fallback={null}>
          <CategoryTabs activeCategory={category} labels={categoryLabels} />
        </Suspense>

        <div className="flex gap-6 mt-4">
          {/* Main feed */}
          <div className="flex-1 min-w-0">
            {fearGreed && (
              <div className="lg:hidden mb-4">
                <FearGreedMeter {...fearGreed} />
              </div>
            )}
            <NewsFeed
              articles={newsData.data}
              locale={locale}
              currentPage={newsData.pagination.page}
              totalPages={newsData.pagination.totalPages}
              category={category}
              noArticlesLabel={tArticle('noArticles')}
            />
          </div>

          {/* Sidebar — desktop only */}
          <div className="hidden lg:flex flex-col gap-4 w-[320px] shrink-0">
            {fearGreed && <FearGreedMeter {...fearGreed} />}
            <Sidebar
              locale={locale}
              trending={trending}
              trendingLabel={tSidebar('trending')}
              statsLabel={tSidebar('quickStats')}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
