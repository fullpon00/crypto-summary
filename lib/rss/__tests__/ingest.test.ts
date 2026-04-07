// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { generateSlug, calculateImportanceScore, getCategorySlugsForTitle } from '../ingest'

describe('generateSlug', () => {
  it('produces kebab-case slug from title and id', () => {
    const slug = generateSlug('BTC Hits New High Today', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
    expect(slug).toMatch(/^btc-hits-new-high-today-a1b2c3d4$/)
  })

  it('strips special characters', () => {
    const slug = generateSlug('SEC & CFTC: New Rules!', 'a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
    expect(slug).not.toContain('&')
    expect(slug).not.toContain(':')
    expect(slug).not.toContain('!')
  })

  it('truncates long titles at 60 chars before the id suffix', () => {
    const longTitle = 'A'.repeat(100)
    const slug = generateSlug(longTitle, 'a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx')
    const [base] = slug.split('-a1b2c3d4')
    expect(base.length).toBeLessThanOrEqual(60)
  })
})

describe('calculateImportanceScore', () => {
  it('returns 80 for high-signal keywords', () => {
    expect(calculateImportanceScore('SEC Approves ETF')).toBe(80)
    expect(calculateImportanceScore('BTC Halving Approaches')).toBe(80)
    expect(calculateImportanceScore('Exchange Hack Reported')).toBe(80)
  })

  it('returns 50 for normal titles', () => {
    expect(calculateImportanceScore('Bitcoin Developer Update')).toBe(50)
    expect(calculateImportanceScore('Weekly Market Recap')).toBe(50)
  })
})

describe('getCategorySlugsForTitle', () => {
  it('matches bitcoin keyword', () => {
    expect(getCategorySlugsForTitle('Bitcoin ETF Approved')).toContain('bitcoin')
  })

  it('matches regulation keyword', () => {
    expect(getCategorySlugsForTitle('SEC Sues Exchange')).toContain('regulation')
  })

  it('returns empty array for no matches', () => {
    expect(getCategorySlugsForTitle('Weekly Roundup')).toHaveLength(0)
  })
})
