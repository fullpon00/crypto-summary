import Parser from 'rss-parser'

export interface ParsedArticle {
  title: string
  url: string
  summary?: string
  imageUrl?: string
  publishedAt: Date
}

const parser = new Parser({ timeout: 10000 })

export async function parseFeed(feedUrl: string): Promise<ParsedArticle[]> {
  try {
    const feed = await parser.parseURL(feedUrl)
    return (feed.items ?? [])
      .map((item) => ({
        title: item.title ?? 'Untitled',
        url: item.link ?? '',
        summary: item.contentSnippet ?? item.content,
        imageUrl: item.enclosure?.url,
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      }))
      .filter((a) => a.url !== '')
  } catch (error) {
    console.error(`[RSS] Failed to parse ${feedUrl}:`, error)
    return []
  }
}
