'use client'

import { useQuery } from '@tanstack/react-query'

interface CoinPrice {
  symbol: string
  price: number
  change24h: number
}

export function TickerBar() {
  const { data: prices = [] } = useQuery<CoinPrice[]>({
    queryKey: ['prices'],
    queryFn: () => fetch('/api/market/prices').then((r) => r.json()),
    refetchInterval: 300_000,
  })

  if (prices.length === 0) return <div className="h-10" />

  return (
    <div
      className="h-10 border-b flex items-center overflow-x-auto"
      style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border)' }}
    >
      <div className="flex items-center gap-6 px-4 whitespace-nowrap">
        {prices.map((coin) => (
          <div key={coin.symbol} className="flex items-center gap-2 text-xs font-mono">
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{coin.symbol}</span>
            <span style={{ color: 'var(--text-primary)' }}>
              ${coin.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
            </span>
            <span style={{ color: coin.change24h >= 0 ? '#0ECB81' : '#F6465D' }}>
              {coin.change24h >= 0 ? '▲' : '▼'}{Math.abs(coin.change24h).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
