// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { getTopPrices } from '../coingecko'

global.fetch = vi.fn()

describe('getTopPrices', () => {
  it('returns price data for top coins', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        bitcoin: { usd: 83421, usd_24h_change: 2.3 },
        ethereum: { usd: 3821, usd_24h_change: 1.8 },
        solana: { usd: 142, usd_24h_change: -0.5 },
        ripple: { usd: 0.52, usd_24h_change: 0.1 },
        binancecoin: { usd: 580, usd_24h_change: 0.8 },
      }),
    } as Response)

    const prices = await getTopPrices()
    expect(prices).toHaveLength(5)
    expect(prices[0]).toMatchObject({ symbol: 'BTC', price: 83421, change24h: 2.3 })
  })

  it('returns empty array on fetch failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
    const prices = await getTopPrices()
    expect(prices).toEqual([])
  })
})
