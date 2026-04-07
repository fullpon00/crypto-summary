// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { getFearGreed } from '../feargreed'

global.fetch = vi.fn()

describe('getFearGreed', () => {
  it('returns current and previous fear & greed values', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({
        data: [
          { value: '65', value_classification: 'Greed' },
          { value: '70', value_classification: 'Greed' },
        ],
      }),
    } as Response)

    const result = await getFearGreed()
    expect(result).not.toBeNull()
    expect(result!.value).toBe(65)
    expect(result!.label).toBe('Greed')
    expect(result!.previousValue).toBe(70)
  })

  it('returns null on fetch failure', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))
    const result = await getFearGreed()
    expect(result).toBeNull()
  })
})
