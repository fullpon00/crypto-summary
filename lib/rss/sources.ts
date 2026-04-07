export interface FeedSource {
  slug: string
  name: string
  feedUrl: string
  siteUrl: string
  language: string
}

export const RSS_SOURCES: FeedSource[] = [
  { slug: 'coindesk', name: 'CoinDesk', feedUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/', siteUrl: 'https://www.coindesk.com', language: 'en' },
  { slug: 'cointelegraph', name: 'Cointelegraph', feedUrl: 'https://cointelegraph.com/rss', siteUrl: 'https://cointelegraph.com', language: 'en' },
  { slug: 'the-block', name: 'The Block', feedUrl: 'https://www.theblock.co/rss.xml', siteUrl: 'https://www.theblock.co', language: 'en' },
  { slug: 'bitcoin-magazine', name: 'Bitcoin Magazine', feedUrl: 'https://bitcoinmagazine.com/feed', siteUrl: 'https://bitcoinmagazine.com', language: 'en' },
  { slug: 'decrypt', name: 'Decrypt', feedUrl: 'https://decrypt.co/feed', siteUrl: 'https://decrypt.co', language: 'en' },
  { slug: 'cryptoslate', name: 'CryptoSlate', feedUrl: 'https://cryptoslate.com/feed/', siteUrl: 'https://cryptoslate.com', language: 'en' },
  { slug: 'beincrypto', name: 'BeInCrypto', feedUrl: 'https://beincrypto.com/feed/', siteUrl: 'https://beincrypto.com', language: 'en' },
  { slug: 'newsbtc', name: 'NewsBTC', feedUrl: 'https://www.newsbtc.com/feed/', siteUrl: 'https://www.newsbtc.com', language: 'en' },
  { slug: 'ambcrypto', name: 'AMBCrypto', feedUrl: 'https://ambcrypto.com/feed/', siteUrl: 'https://ambcrypto.com', language: 'en' },
  { slug: 'crypto-briefing', name: 'Crypto Briefing', feedUrl: 'https://cryptobriefing.com/feed/', siteUrl: 'https://cryptobriefing.com', language: 'en' },
]
