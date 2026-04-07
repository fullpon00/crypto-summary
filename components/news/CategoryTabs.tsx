'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface CategoryTabsProps {
  activeCategory: string
  labels: Record<string, string>
}

const CATEGORY_SLUGS = ['all', 'breaking', 'bitcoin', 'ethereum', 'regulation', 'etf', 'defi']

export function CategoryTabs({ activeCategory, labels }: CategoryTabsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSelect(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    cat === 'all' ? params.delete('category') : params.set('category', cat)
    params.set('page', '1')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div
      className="flex items-center gap-1 overflow-x-auto border-b py-2"
      style={{ borderColor: 'var(--border)' }}
    >
      {CATEGORY_SLUGS.map((cat) => {
        const isActive = cat === activeCategory || (cat === 'all' && !activeCategory)
        return (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className="shrink-0 px-3 py-1.5 text-sm font-medium transition-colors"
            style={{
              color: isActive ? '#F0B90B' : 'var(--text-secondary)',
              borderBottom: isActive ? '2px solid #F0B90B' : '2px solid transparent',
            }}
          >
            {labels[cat] ?? cat}
          </button>
        )
      })}
    </div>
  )
}
