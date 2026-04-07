export interface FeedSource {
  slug: string
  name: string
  feedUrl: string
  language: string
}

export const RSS_SOURCES: FeedSource[] = [
  { slug: 'coindesk', name: 'CoinDesk', feedUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/', language: 'en' },
  { slug: 'cointelegraph', name: 'Cointelegraph', feedUrl: 'https://cointelegraph.com/rss', language: 'en' },
  { slug: 'the-block', name: 'The Block', feedUrl: 'https://www.theblock.co/rss.xml', language: 'en' },
  { slug: 'bitcoin-magazine', name: 'Bitcoin Magazine', feedUrl: 'https://bitcoinmagazine.com/feed', language: 'en' },
  { slug: 'decrypt', name: 'Decrypt', feedUrl: 'https://decrypt.co/feed', language: 'en' },
]
