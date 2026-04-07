'use client'

import { useState } from 'react'

interface LanguageToggleProps {
  originalTitle: string
  translatedTitle: string | undefined
  originalSummary: string | undefined
  translatedSummary: string | undefined
  originalLabel: string
  translationLabel: string
  translatingLabel: string
}

export function LanguageToggle({
  originalTitle,
  translatedTitle,
  originalSummary,
  translatedSummary,
  originalLabel,
  translationLabel,
  translatingLabel,
}: LanguageToggleProps) {
  const [showOriginal, setShowOriginal] = useState(false)

  const hasTranslation = Boolean(translatedTitle)
  const displayTitle = showOriginal || !hasTranslation ? originalTitle : (translatedTitle ?? originalTitle)
  const displaySummary = showOriginal || !hasTranslation ? originalSummary : (translatedSummary ?? originalSummary)

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowOriginal(false)}
          className="text-xs px-3 py-1 rounded border"
          style={{
            backgroundColor: !showOriginal ? '#F0B90B' : 'transparent',
            color: !showOriginal ? '#0B0E11' : 'var(--text-secondary)',
            borderColor: !showOriginal ? '#F0B90B' : 'var(--border)',
          }}
        >
          {hasTranslation ? translationLabel : translatingLabel}
        </button>
        <button
          onClick={() => setShowOriginal(true)}
          className="text-xs px-3 py-1 rounded border"
          style={{
            backgroundColor: showOriginal ? '#F0B90B' : 'transparent',
            color: showOriginal ? '#0B0E11' : 'var(--text-secondary)',
            borderColor: showOriginal ? '#F0B90B' : 'var(--border)',
          }}
        >
          {originalLabel}
        </button>
      </div>

      <h1 className="text-2xl font-bold leading-tight mb-4" style={{ color: 'var(--text-primary)' }}>
        {displayTitle}
      </h1>
      {displaySummary && (
        <p className="text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
          {displaySummary}
        </p>
      )}
    </div>
  )
}
