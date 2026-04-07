import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const categories = [
    { slug: 'breaking', nameEn: 'Breaking', nameJa: '速報', tier: 1, sortOrder: 0 },
    { slug: 'bitcoin', nameEn: 'Bitcoin', nameJa: 'ビットコイン', tier: 2, sortOrder: 1 },
    { slug: 'ethereum', nameEn: 'Ethereum', nameJa: 'イーサリアム', tier: 2, sortOrder: 2 },
    { slug: 'regulation', nameEn: 'Regulation', nameJa: '規制', tier: 1, sortOrder: 3 },
    { slug: 'etf', nameEn: 'ETF', nameJa: 'ETF', tier: 2, sortOrder: 4 },
    { slug: 'defi', nameEn: 'DeFi', nameJa: 'DeFi', tier: 2, sortOrder: 5 },
    { slug: 'altcoins', nameEn: 'Altcoins', nameJa: 'アルトコイン', tier: 2, sortOrder: 6 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  const sources = [
    { name: 'CoinDesk', slug: 'coindesk', url: 'https://www.coindesk.com', feedUrl: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
    { name: 'Cointelegraph', slug: 'cointelegraph', url: 'https://cointelegraph.com', feedUrl: 'https://cointelegraph.com/rss' },
    { name: 'The Block', slug: 'the-block', url: 'https://www.theblock.co', feedUrl: 'https://www.theblock.co/rss.xml' },
    { name: 'Bitcoin Magazine', slug: 'bitcoin-magazine', url: 'https://bitcoinmagazine.com', feedUrl: 'https://bitcoinmagazine.com/feed' },
    { name: 'Decrypt', slug: 'decrypt', url: 'https://decrypt.co', feedUrl: 'https://decrypt.co/feed' },
  ]

  for (const source of sources) {
    await prisma.source.upsert({
      where: { slug: source.slug },
      update: {},
      create: { ...source, language: 'en', licenseStatus: 'link-only' },
    })
  }

  console.log('✅ Seed complete')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
