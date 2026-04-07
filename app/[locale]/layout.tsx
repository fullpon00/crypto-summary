import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BottomNav } from '@/components/layout/BottomNav'

const locales = ['ja', 'en']

export async function generateMetadata(
  { params }: { params: Promise<{ locale: string }> }
): Promise<Metadata> {
  const locale = (await params).locale
  return {
    title: { default: 'Crypto Summary', template: '%s | Crypto Summary' },
    description: locale === 'ja'
      ? '暗号資産ニュースの最新情報と市場データ'
      : 'Latest crypto news and market data for traders',
    openGraph: {
      siteName: 'Crypto Summary',
      locale: locale === 'ja' ? 'ja_JP' : 'en_US',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const locale = (await params).locale
  if (!locales.includes(locale)) notFound()
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--bg-base)' }}>
        <Header locale={locale} />
        <main className="flex-1 container mx-auto max-w-[1440px] px-4 sm:px-6">
          {children}
        </main>
        <Footer />
        <BottomNav locale={locale} />
      </div>
    </NextIntlClientProvider>
  )
}
