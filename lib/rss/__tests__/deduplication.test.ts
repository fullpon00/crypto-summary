// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { createDedupeHash } from '../deduplication'

describe('createDedupeHash', () => {
  it('produces a 64-char hex string', () => {
    const hash = createDedupeHash('https://example.com/article', 'Test Title')
    expect(hash).toHaveLength(64)
    expect(hash).toMatch(/^[a-f0-9]+$/)
  })

  it('produces the same hash for identical inputs', () => {
    const hash1 = createDedupeHash('https://example.com', 'Title')
    const hash2 = createDedupeHash('https://example.com', 'Title')
    expect(hash1).toBe(hash2)
  })

  it('produces different hashes for different URLs', () => {
    const hash1 = createDedupeHash('https://example.com/a', 'Title')
    const hash2 = createDedupeHash('https://example.com/b', 'Title')
    expect(hash1).not.toBe(hash2)
  })
})
