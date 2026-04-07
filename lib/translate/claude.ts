// Free translation using MyMemory API (no API key required, 1000 req/day)
// https://mymemory.translated.net/doc/spec.php

interface TranslateInput {
  title: string
  summary?: string
  targetLanguage: string
}

interface TranslateResult {
  title: string
  summary?: string
}

async function translateText(text: string, langpair: string): Promise<string | null> {
  if (!text.trim()) return text
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${langpair}`
    const res = await fetch(url, { next: { revalidate: 0 } })
    if (!res.ok) return null
    const data = await res.json() as { responseStatus: number; responseData: { translatedText: string } }
    if (data.responseStatus !== 200) return null
    return data.responseData.translatedText
  } catch {
    return null
  }
}

export async function translateArticle(input: TranslateInput): Promise<TranslateResult | null> {
  const langpair = `en|${input.targetLanguage}`

  try {
    const [translatedTitle, translatedSummary] = await Promise.all([
      translateText(input.title, langpair),
      input.summary ? translateText(input.summary, langpair) : Promise.resolve(undefined),
    ])

    if (!translatedTitle) return null

    return {
      title: translatedTitle,
      summary: translatedSummary ?? undefined,
    }
  } catch (error) {
    console.error('[Translate] Failed:', error)
    return null
  }
}
