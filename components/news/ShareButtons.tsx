'use client'

import { useState } from 'react'

interface ShareButtonsProps {
  url: string
  title: string
  shareLabel: string
  copyLabel: string
}

export function ShareButtons({ url, title, shareLabel, copyLabel }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`

  async function handleCopy() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex gap-3 mt-6">
      <a
        href={xShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        𝕏 {shareLabel}
      </a>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium"
        style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
      >
        {copied ? '✓' : '🔗'} {copyLabel}
      </button>
    </div>
  )
}
