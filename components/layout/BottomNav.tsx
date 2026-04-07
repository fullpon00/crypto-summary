'use client'

import Link from 'next/link'
import { Home, Newspaper, Database } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function BottomNav({ locale }: { locale: string }) {
  const t = useTranslations('nav')
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 h-14 border-t flex items-center justify-around lg:hidden z-50"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <Link href={`/${locale}`} className="flex flex-col items-center gap-0.5 p-2">
        <Home size={20} style={{ color: 'var(--text-secondary)' }} />
        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{t('home')}</span>
      </Link>
      <Link href={`/${locale}`} className="flex flex-col items-center gap-0.5 p-2">
        <Newspaper size={20} style={{ color: 'var(--text-secondary)' }} />
        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{t('news')}</span>
      </Link>
      <Link href={`/${locale}/sources`} className="flex flex-col items-center gap-0.5 p-2">
        <Database size={20} style={{ color: 'var(--text-secondary)' }} />
        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{t('sources')}</span>
      </Link>
    </nav>
  )
}
