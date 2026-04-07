export interface FearGreedData {
  value: number
  label: string
  previousValue: number
  previousLabel: string
}

export async function getFearGreed(): Promise<FearGreedData | null> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=2', {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`Fear & Greed error: ${res.status}`)
    const data = await res.json()
    const [current, previous] = data.data ?? []
    return {
      value: parseInt(current?.value ?? '50'),
      label: current?.value_classification ?? 'Neutral',
      previousValue: parseInt(previous?.value ?? '50'),
      previousLabel: previous?.value_classification ?? 'Neutral',
    }
  } catch (error) {
    console.error('[FearGreed] Failed:', error)
    return null
  }
}
