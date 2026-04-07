// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { parseFeed } from '../fetcher'

vi.mock('rss-parser', () => {
  const mockParseURL = vi.fn().mockResolvedValue({
    items: [
      {
        title: 'BTC Hits New High',
        link: 'https://coindesk.com/btc-new-high',
        contentSnippet: 'Bitcoin reached a new all-time high today.',
        pubDate: 'Tue, 01 Apr 2026 10:00:00 GMT',
        enclosure: { url: 'https://example.com/image.jpg' },
      },
      {
        title: 'ETH Update',
        link: 'https://coindesk.com/eth-update',
        contentSnippet: 'Ethereum developers released a new update.',
        pubDate: 'Tue, 01 Apr 2026 09:00:00 GMT',
      },
    ],
  })
  class MockParser {
    parseURL = mockParseURL
  }
  return { default: MockParser }
})

describe('parseFeed', () => {
  it('returns normalized articles from a feed URL', async () => {
    const articles = await parseFeed('https://coindesk.com/rss')
    expect(articles).toHaveLength(2)
    expect(articles[0]).toMatchObject({
      title: 'BTC Hits New High',
      url: 'https://coindesk.com/btc-new-high',
      summary: 'Bitcoin reached a new all-time high today.',
    })
    expect(articles[0].publishedAt).toBeInstanceOf(Date)
    expect(articles[0].imageUrl).toBe('https://example.com/image.jpg')
  })

  it('handles missing optional fields gracefully', async () => {
    const articles = await parseFeed('https://coindesk.com/rss')
    expect(articles[1].imageUrl).toBeUndefined()
  })
})
