export interface CoinPrice {
  symbol: string
  name: string
  price: number
  change24h: number
}

const COINS = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin' },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana', symbol: 'SOL', name: 'Solana' },
  { id: 'ripple', symbol: 'XRP', name: 'XRP' },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB' },
]

export async function getTopPrices(): Promise<CoinPrice[]> {
  const ids = COINS.map((c) => c.id).join(',')
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`

  try {
    const res = await fetch(url, {
      headers: { 'x-cg-demo-api-key': process.env.COINGECKO_API_KEY ?? '' },
      next: { revalidate: 300 },
    })
    if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
    const data = await res.json() as Record<string, { usd: number; usd_24h_change: number }>
    return COINS.map((coin) => ({
      symbol: coin.symbol,
      name: coin.name,
      price: data[coin.id]?.usd ?? 0,
      change24h: data[coin.id]?.usd_24h_change ?? 0,
    }))
  } catch (error) {
    console.error('[CoinGecko] Failed:', error)
    return []
  }
}
