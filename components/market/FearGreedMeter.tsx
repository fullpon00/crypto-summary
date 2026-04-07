interface FearGreedMeterProps {
  value: number
  label: string
  previousValue: number
  previousLabel: string
}

function getColor(value: number): string {
  if (value <= 25) return '#F6465D'
  if (value <= 45) return '#F7931A'
  if (value <= 55) return '#848E9C'
  if (value <= 75) return '#0ECB81'
  return '#00FF88'
}

export function FearGreedMeter({ value, label, previousValue }: FearGreedMeterProps) {
  const color = getColor(value)
  const delta = value - previousValue

  return (
    <div
      className="rounded-md border p-4"
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>FEAR &amp; GREED</p>
      <div className="text-4xl font-bold font-mono" style={{ color }}>{value}</div>
      <div className="text-sm font-medium mt-1" style={{ color }}>{label}</div>
      <div className="mt-3 h-1.5 rounded-full" style={{ backgroundColor: 'var(--bg-elevated)' }}>
        <div className="h-1.5 rounded-full" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
        <span>Yesterday: <span>{previousValue}</span></span>
        <span style={{ color: delta >= 0 ? '#0ECB81' : '#F6465D' }}>
          {delta >= 0 ? '+' : ''}{delta}
        </span>
      </div>
    </div>
  )
}
