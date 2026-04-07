import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { NewsCard } from '../news/NewsCard'

const mockArticle = {
  slug: 'btc-new-high-a1b2c3d4',
  title: 'BTC最高値更新',
  titleOriginal: 'BTC Hits New High',
  summary: 'ビットコインが最高値を記録した。',
  isBreaking: false,
  publishedAt: new Date('2026-04-01T10:00:00Z').toISOString(),
  source: { name: 'CoinDesk', slug: 'coindesk' },
  categories: [{ slug: 'bitcoin', nameEn: 'Bitcoin', nameJa: 'ビットコイン' }],
  language: 'en',
  imageUrl: null,
  viewCount: 0,
  originalUrl: 'https://coindesk.com/article',
}

describe('NewsCard', () => {
  it('renders article title', () => {
    render(<NewsCard article={mockArticle} locale="ja" />)
    expect(screen.getByText('BTC最高値更新')).toBeInTheDocument()
  })

  it('renders source name', () => {
    render(<NewsCard article={mockArticle} locale="ja" />)
    expect(screen.getByText('CoinDesk')).toBeInTheDocument()
  })

  it('renders BREAKING badge when isBreaking is true', () => {
    render(<NewsCard article={{ ...mockArticle, isBreaking: true }} locale="ja" />)
    expect(screen.getByText('BREAKING')).toBeInTheDocument()
  })

  it('shows Japanese category name when locale is ja', () => {
    render(<NewsCard article={mockArticle} locale="ja" />)
    expect(screen.getByText('ビットコイン')).toBeInTheDocument()
  })
})
