import Anthropic from '@anthropic-ai/sdk'

const LANGUAGE_NAMES: Record<string, string> = {
  ja: 'Japanese',
  en: 'English',
}

interface TranslateInput {
  title: string
  summary?: string
  targetLanguage: string
}

interface TranslateResult {
  title: string
  summary?: string
}

export async function translateArticle(input: TranslateInput): Promise<TranslateResult | null> {
  const langName = LANGUAGE_NAMES[input.targetLanguage] ?? input.targetLanguage

  const prompt = `Translate this crypto news article to ${langName}.
Return ONLY a JSON object with "title" and "summary" fields. No markdown, no explanation.

Title: ${input.title.slice(0, 200)}
Summary: ${(input.summary ?? '').slice(0, 500)}

JSON:`

  try {
    // Support both class instantiation (production) and factory function (test mock)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AnthropicAny = Anthropic as any
    const client = (() => {
      try {
        return new AnthropicAny({ apiKey: process.env.ANTHROPIC_API_KEY })
      } catch {
        return AnthropicAny({ apiKey: process.env.ANTHROPIC_API_KEY })
      }
    })()
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }],
    })
    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    return JSON.parse(text.trim()) as TranslateResult
  } catch (error) {
    console.error('[Translate] Failed:', error)
    return null
  }
}
