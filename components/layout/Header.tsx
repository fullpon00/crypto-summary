'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useTranslations } from 'next-intl'
import { Sun, Moon, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Header({ locale }: { locale: string }) {
  const { theme, setTheme } = useTheme()
  const t = useTranslations('nav')
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const otherLocale = locale === 'ja' ? 'en' : 'ja'

  return (
    <header
      className="sticky top-0 z-50 h-16 border-b flex items-center px-4 sm:px-6"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center justify-between w-full max-w-[1440px] mx-auto">
        <Link href={`/${locale}`} className="text-lg font-bold" style={{ color: 'var(--accent-gold)' }}>
          Crypto Summary
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href={`/${locale}`} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('news')}
          </Link>
          <Link href={`/${locale}/sources`} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('sources')}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={`/${otherLocale}`}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Globe size={13} />
            <span>{locale.toUpperCase()}</span>
          </Link>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
