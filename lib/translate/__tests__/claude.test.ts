// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { translateArticle } from '../claude'

vi.mock('@anthropic-ai/sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn().mockResolvedValue({
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              title: 'BTC最高値更新',
              summary: 'ビットコインが本日新たな最高値を記録した。',
            }),
          },
        ],
      }),
    },
  })),
}))

describe('translateArticle', () => {
  it('translates title and summary to target language', async () => {
    const result = await translateArticle({
      title: 'BTC Hits New High',
      summary: 'Bitcoin reached a new all-time high today.',
      targetLanguage: 'ja',
    })
    expect(result).toMatchObject({
      title: 'BTC最高値更新',
      summary: expect.any(String),
    })
  })

  it('returns null on API error', async () => {
    const Anthropic = (await import('@anthropic-ai/sdk')).default as any
    Anthropic.mockImplementation(() => ({
      messages: {
        create: vi.fn().mockRejectedValue(new Error('API error')),
      },
    }))
    const result = await translateArticle({
      title: 'BTC Hits New High',
      summary: 'Summary',
      targetLanguage: 'ja',
    })
    expect(result).toBeNull()
  })
})
